from typing import Optional
from flask_jwt_extended import jwt_required
from flask import Blueprint, request, jsonify
from pydantic import BaseModel
from .database.models import db, Role, UserRole, RolePermission, Permission
from .utils.logging import log_error, log_info, log_debug

roles_app = Blueprint("roles", __name__)


class RoleRequestModel(BaseModel):
    roleId: Optional[int] = None
    name: str
    description: str
    color: str


@jwt_required()
@roles_app.route("/fetch_roles", methods=["GET"])
def fetch_roles():
    try:
        roles = Role.get_all()
        roles_list = []

        for role in roles:
            role_dict = role.to_dict()

            role_permissions = RolePermission.get_by_role_id(role.roleId)

            permission_ids = [rp.permissionId for rp in role_permissions]

            if permission_ids:
                permissions = Permission.get_by_ids(permission_ids)
                role_dict["permissions"] = [
                    permission.to_dict() for permission in permissions
                ]
            else:
                role_dict["permissions"] = []

            roles_list.append(role_dict)

        return jsonify(roles_list), 200

    except Exception as e:
        log_error(f"Failed to fetch roles: {str(e)}")
        return {}, 500


@jwt_required()
@roles_app.route("/create_role", methods=["POST"])
def create_role():
    try:
        data = request.get_json()

        undo = data.get("roleId")
        if undo is not None:
            data = data.get("role")

        name = data.get("name")
        color = data.get("color")
        description = data.get("description")
        permissions = data.get("permissions", [])

        role = Role.get_by_name(name)
        if role:
            log_error(f"Role name already exists")
            return jsonify({"error": "Role name already exists"}), 400

        role = Role.get_by_color(color)
        if role:
            log_error(f"Role color already exists")
            return jsonify({"error": "Role color already exists"}), 400

        new_role = Role(roleId=undo, name=name, description=description, color=color)
        db.session.add(new_role)
        db.session.commit()

        if permissions:
            for permission_id in permissions:
                permission = Permission.get_by_id(permission_id)

                if permission:
                    role_permission = RolePermission(
                        roleId=new_role.roleId, permissionId=permission.permissionId
                    )
                    db.session.add(role_permission)
                else:
                    log_error(f"Permission with ID {permission_id} not found")

        db.session.commit()

        log_info(
            f"Role '{new_role.name}' created"
            if undo is None
            else f"Role '{new_role.name}' restored"
        )

        return jsonify(new_role.to_dict()), 201

    except Exception as e:
        log_error(f"Failed to create role: {str(e)}")
        return jsonify({"error": "Failed to create role"}), 500


@jwt_required()
@roles_app.route("/edit_role/<int:roleId>", methods=["PUT"])
def edit_role(roleId: int):
    try:
        data = request.get_json()

        role = Role.get_by_id(roleId)
        if not role:
            log_error(f"Role with ID {roleId} not found")
            return jsonify({"error": "Role not found"}), 404

        existing_role_by_name = Role.get_by_name(data.get("name"))
        if existing_role_by_name and existing_role_by_name.roleId != roleId:
            log_error(f"Role name already exists")
            return jsonify({"error": "Role name already exists"}), 400

        existing_role_by_color = Role.get_by_color(data.get("color"))
        if existing_role_by_color and existing_role_by_color.roleId != roleId:
            log_error(f"Role color already exists")
            return jsonify({"error": "Role color already exists"}), 400

        role.name = data.get("name", role.name)
        role.description = data.get("description", role.description)
        role.color = data.get("color", role.color)
        db.session.commit()

        permissions = data.get("permissions", [])
        if permissions:
            RolePermission.query.filter_by(roleId=roleId).delete()

            for permission_id in permissions:
                permission = Permission.get_by_id(permission_id)
                if permission:
                    role_permission = RolePermission(
                        roleId=role.roleId, permissionId=permission.permissionId
                    )
                    db.session.add(role_permission)

        db.session.commit()

        log_info(f"Role with ID {roleId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit role {roleId}: {e}")
        return jsonify({"error": "Failed to edit role"}), 500


@jwt_required()
@roles_app.route("/delete_role/<int:roleId>", methods=["DELETE"])
def delete_role(roleId: int):
    try:
        role = Role.get_by_id(roleId)
        if not role:
            log_error(f"Role with ID {roleId} not found")
            return {}, 404

        existing_users = UserRole.get_by_roleId(roleId)
        if existing_users:
            log_error(f"Role with ID {roleId} has existing users")
            return {}, 400

        db.session.delete(role)
        db.session.commit()

        log_info(f"Role with ID {roleId} deleted")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete role {roleId}: {str(e)}")
        return {}, 500

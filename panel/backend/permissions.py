from flask_jwt_extended import jwt_required
from flask import Blueprint, request, jsonify
from .database.models import db, Role, Permission, RolePermission
from .utils.logging import log_error, log_info, log_debug

permissions_app = Blueprint("permissions", __name__)

@jwt_required()
@permissions_app.route("/fetch_permissions", methods=["GET"])
def fetch_permissions():
    try:
        permissions = Permission.get_all()
        permissions_list = [permission.to_dict() for permission in permissions]
        
        return jsonify(permissions_list), 200
    except Exception as e:
        log_error(f"Failed to fetch permissions: {str(e)}")
        return {}, 500

@jwt_required()
@permissions_app.route("/fetch_role_permissions", methods=["GET"])
def fetch_role_permissions():
    try:
        roles = Role.get_all()
        roles_list = [role.to_dict() for role in roles]
        
        return jsonify(roles_list), 200
    except Exception as e:
        log_error(f"Failed to fetch role permissions: {str(e)}")
        return {}, 500

@jwt_required()
@permissions_app.route("/fetch_role_permissions/<int:roleId>", methods=["GET"])
def fetch_role_permissions_id(roleId: int):
    try:
        role = Role.get_by_id(roleId)
        if not role:
            log_error(f"Role with ID {roleId} not found")
            return {}, 404
        
        permissions = RolePermission.get_by_role_id(roleId)
        permissions_list = [permission.to_dict() for permission in permissions]
        
        return jsonify(permissions_list), 200
    except Exception as e:
        log_error(f"Failed to fetch role permissions: {str(e)}")
        return {}, 500


@jwt_required()
@permissions_app.route("/create_permission", methods=["POST"])
def create_permission():
    try:
        data = request.get_json()
        
        undo = data.get("permissionId")
        if undo is not None:
            data = data.get("permission")
        name = data.get("name")
        description = data.get("description")
        
        permission = Permission.get_by_name(name)
        if permission:
            log_error(f"Permission name already exists")
            return {}, 400
        
        new_permission = Permission(
            permissionId=undo,
            name=name,
            description=description
        )
        db.session.add(new_permission)
        db.session.commit()
        
        log_info(f"Permission with ID {new_permission.name} created" if undo is None
            else f"Permission {new_permission.name} restored")
        return jsonify(new_permission.to_dict()), 201
    except Exception as e:
        log_error(f"Failed to create permission: {str(e)}")
        return {}, 500


@jwt_required()
@permissions_app.route("/edit_permission/<int:permissionId>", methods=["PUT"])
def edit_permission(permissionId: int):
    try:
        data = request.get_json()
        
        permission = Permission.get_by_id(permissionId)
        if not permission:
            log_error(f"Permission with ID {permissionId} not found")
            return {}, 404
        
        permission.name = data.get("name", permission.name)
        permission.description = data.get("description", permission.description)
        db.session.commit()
        
        log_info(f"Permission with ID {permissionId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit permission {permissionId}: {str(e)}")
        return {}, 500

@jwt_required()
@permissions_app.route("/add_role_permissions/<int:roleId>", methods=["POST"])
def add_role_permission(roleId: int):
    try:
        data = request.get_json()
        
        role = Role.get_by_id(roleId)
        if not role:
            log_error(f"Role with ID {roleId} not found")
            return {}, 404
        
        permissions = data.get("permissions")
        for permission in permissions:
            role_permission = RolePermission.get_by_role_permission_id(roleId, permission)
            if role_permission:
                log_error(f"Role {role.name} already has permission {permission}")
                return {}, 400
            
            new_role_permission = RolePermission(
                roleId=roleId,
                permissionId=permission
            )
            db.session.add(new_role_permission)
        
        db.session.commit()
        
        log_info(f"Permissions added to role {role.name}")
        return {}, 201
    except Exception as e:
        log_error(f"Failed to add permissions to role {roleId}: {str(e)}")
        return {}, 500


@jwt_required()
@permissions_app.route("/delete_permission/<int:permissionId>", methods=["DELETE"])
def delete_permission(permissionId: int):
    try:
        permission = Permission.get_by_id(permissionId)
        if not permission:
            log_error(f"Permission with ID {permissionId} not found")
            return {}, 404
        
        existing_roles = RolePermission.get_by_permission_id(permissionId)
        if existing_roles:
            log_error(f"Permission with ID {permissionId} has roles")
            return {}, 400
        
        db.session.delete(permission)
        db.session.commit()
        
        log_info(f"Permission with ID {permissionId} deleted")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete permission {permissionId}: {str(e)}")
        return {}, 500 

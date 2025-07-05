from typing import Optional
from flask_jwt_extended import jwt_required
from flask import Blueprint, request, jsonify
from pydantic import BaseModel
from .database.models import (
    db,
    User,
    Suspension,
    UserRole,
    UserGame,
    Game,
    Role,
    UserStatus,
    UserSettings,
    datetime_now,
)
from datetime import datetime, timedelta
import random, string
from .utils.utils import male_names
from .utils.logging import log_error, log_info, log_debug
from .games import GameRequestModel
from .roles import RoleRequestModel

users_app = Blueprint("users", __name__)


class UserRequestModel(BaseModel):
    userId: Optional[int] = None
    username: str
    email: str
    password: str
    HWID: Optional[str] = None
    registerDate: Optional[datetime] = None
    registerIP: Optional[str] = None
    subscriptionStart: Optional[datetime] = None
    subscriptionEnd: Optional[datetime] = None
    lastLogin: Optional[datetime] = None
    lastIP: Optional[str] = None
    lastEdit: Optional[datetime] = None
    status: str
    roles: Optional[list[RoleRequestModel]] = None
    games: Optional[list[GameRequestModel]] = None


@jwt_required()
@users_app.route("/fetch_users", methods=["GET"])
def fetch_users():
    try:
        users = User.get_all()
        users_list = [user.to_dict() for user in users]

        return jsonify(users_list)
    except Exception as e:
        log_error(f"Failed to fetch users: {str(e)}")
        return {}, 500


@jwt_required()
@users_app.route("/get_user/<int:userId>", methods=["POST"])
def get_user(userId: int):
    try:
        user = User.get_by_id(userId)
        if not user:
            log_info(f"User with ID {userId} not found")
            return {}, 404

        return jsonify(user.to_dict())
    except Exception as e:
        log_error(f"Failed to fetch user: {e}")
        return {}, 500


@jwt_required()
@users_app.route("/create_random_user", methods=["POST"])
def create_random_user():
    try:
        username = random.choice(male_names)
        email = f"{username}{random.choice(string.digits)}@example.com"
        password = "".join(random.choices(string.ascii_letters + string.digits, k=12))
        hwid = "".join(random.choices(string.ascii_letters + string.digits, k=34))
        subscriptionStart = datetime_now - timedelta(days=random.randint(1, 365))
        subscriptionEnd = datetime_now + timedelta(days=random.randint(1, 365))
        lastLogin = datetime_now - timedelta(days=random.randint(1, 365))
        clientIp = str(request.remote_addr)
        random_date = datetime_now - timedelta(days=random.randint(1, 365))

        new_user = User(
            username=username,
            email=email,
            password=password,
            HWID=hwid,
            registerDate=random_date,
            registerIP=clientIp,
            subscriptionStart=subscriptionStart,
            subscriptionEnd=subscriptionEnd,
            lastLogin=lastLogin,
            lastIP=clientIp,
        )

        default_role = Role.get_by_name("Member")
        if default_role:
            existing_roles = UserRole.get_by_id(new_user.userId, default_role.roleId)
            if not existing_roles:
                user_role = UserRole(userId=new_user.userId, roleId=default_role.roleId)
                db.session.add(user_role)
        else:
            log_error("Default role not found")

        default_game = Game.get_by_name("CS2")
        if default_game:
            user_game = UserGame(userId=new_user.userId, gameId=default_game.gameId)
            db.session.add(user_game)
        else:
            log_error("Default game not found")

        db.session.commit()

        log_info(f"Random user with ID {new_user.userId} created")
        return jsonify(new_user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Error creating a random user: {e}")
        return {}, 500


@jwt_required()
@users_app.route("/create_user", methods=["POST"])
def create_user():
    try:
        request_ip = str(request.remote_addr)
        data = request.get_json()

        undo = data.get("userId")
        if undo is not None:
            data = data.get("user")
        log_debug(f"Creating user with data: {data}")
        subscription = data.get("subscription")
        subscriptionStart, subscriptionEnd = None, None
        if subscription:
            subscription_from = subscription.get("start")
            subscription_to = subscription.get("end")
            if subscription_from:
                subscriptionStart = datetime.strptime(
                    subscription_from, "%Y-%m-%dT%H:%M:%S.%fZ"
                )
            if subscription_to:
                subscriptionEnd = datetime.strptime(
                    subscription_to, "%Y-%m-%dT%H:%M:%S.%fZ"
                )

        username = data.get("username")
        email = data.get("email")
        hwid = data.get("HWID")

        if User.username_exists_except_id(username, undo):
            log_error(f"Username {username} already exists")
            return {}, 400

        if User.email_exists_except_id(email, undo):
            log_error(f"Email {email} already exists")
            return {}, 400

        if hwid and User.hwid_exists_except_id(hwid, undo):
            log_error(f"HWID {hwid} already exists")
            return {}, 400

        new_user = User(
            userId=undo,
            username=username,
            email=email,
            password=data.get("password"),
            HWID=hwid,
            registerIP=request_ip,
            subscriptionStart=subscriptionStart,
            subscriptionEnd=subscriptionEnd,
            lastLogin=datetime_now,
            lastIP=request_ip,
            status=data.get("status"),
        )

        db.session.add(new_user)
        db.session.commit()

        roles = data.get("roles")
        if roles:
            for role in roles:
                role_id = role.get("roleId")
                user_role = UserRole(userId=new_user.userId, roleId=role_id)
                db.session.add(user_role)
            db.session.commit()

        games = data.get("games")
        if games:
            for game in games:
                game_id = game.get("gameId")
                user_game = UserGame(userId=new_user.userId, gameId=game_id)
                db.session.add(user_game)
            db.session.commit()

        log_info(
            f"User with ID {new_user.userId} created"
            if undo is None
            else f"User with ID {new_user.userId} restored"
        )
        return jsonify(new_user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Error creating user: {e}")
        return {}, 500


@jwt_required()
@users_app.route("/edit_user/<int:userId>", methods=["PUT"])
def edit_user(userId: int):
    try:
        data = request.get_json()

        user = User.get_by_id(userId)
        if not user:
            log_error(f"User with ID {userId} not found")
            return {}, 404

        user.username = data.get("username", user.username)
        if User.username_exists_except_id(user.username, userId):
            return {}, 400

        user.email = data.get("email", user.email)
        if User.email_exists_except_id(user.email, userId):
            return {}, 400

        user.password = data.get("password", user.password)
        user.HWID = data.get("HWID", user.HWID)
        if User.hwid_exists_except_id(user.HWID, userId) and user.HWID != "":
            return {}, 400

        user.status = data.get("status", user.status)

        subscription = data.get("subscription")
        subscriptionStart, subscriptionEnd = None, None
        if subscription:
            subscription_start = subscription.get("start")
            subscription_end = subscription.get("end")
            if subscription_start:
                subscriptionStart = datetime.strptime(
                    subscription_start, "%Y-%m-%dT%H:%M:%S.%fZ"
                )
            if subscription_end:
                subscriptionEnd = datetime.strptime(
                    subscription_end, "%Y-%m-%dT%H:%M:%S.%fZ"
                )

        user.subscriptionStart = subscriptionStart
        user.subscriptionEnd = subscriptionEnd

        received_role_ids = set(
            int(role.get("roleId")) for role in data.get("roles", [])
        )
        existing_roles = {ur.roleId for ur in UserRole.get_by_userId(userId)}

        roles_to_add = received_role_ids - existing_roles
        for role_id in roles_to_add:
            new_user_role = UserRole(userId=userId, roleId=role_id)
            db.session.add(new_user_role)

        roles_to_remove = existing_roles - received_role_ids
        for role_id in roles_to_remove:
            UserRole.delete(userId, role_id)

        received_game_ids = set(
            int(game.get("gameId")) for game in data.get("games", [])
        )
        existing_games = {ug.gameId for ug in UserGame.get_by_userId(userId)}

        games_to_add = received_game_ids - existing_games
        for game_id in games_to_add:
            new_user_game = UserGame(userId=userId, gameId=game_id)
            db.session.add(new_user_game)

        games_to_remove = existing_games - received_game_ids
        for game_id in games_to_remove:
            UserGame.delete(userId, game_id)

        if not user.subscriptionStart and received_game_ids:
            return {}, 400

        user.lastEdit = datetime_now
        db.session.commit()

        log_info(f"User with ID {userId} edited")
        return {}, 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Error editing user with ID {userId}: {e}")
        return {}, 500


@jwt_required()
@users_app.route("/update_user_status/<int:userId>", methods=["PUT"])
def update_user_status(userId: int):
    try:
        data = request.get_json()
        user_status = data.get("status")

        user = User.get_by_id(userId)
        if not user:
            log_error(f"User with ID {userId} not found")
            return {}, 404

        user.status = user_status
        user.lastEdit = datetime_now
        if (
            user_status == UserStatus.Banned.value
            or user_status == UserStatus.Frozen.value
        ):
            new_suspension = Suspension(
                userId=userId,
                status=user_status,
                reason=f"Status changed to {user_status}",
                suspensionStart=datetime_now,
                isActive=True,
                suspendedBy=data.get("suspendedBy"),
            )
            db.session.add(new_suspension)
        db.session.commit()

        log_info(f"User with ID {userId} updated status to {user_status}")
        return {}, 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Error updating user status: {str(e)}")
        return {}, 500


@jwt_required()
@users_app.route("/delete_user/<int:userId>", methods=["DELETE"])
def delete_user(userId: int):
    try:
        user = User.get_by_id(userId)
        if not user:
            log_error(f"User with ID {userId} not found")
            return {}, 404

        suspension = Suspension.get_by_userId(userId)
        if suspension:
            log_error(
                f"User with ID {userId} has suspension record with ID {suspension.suspensionId} and cant be deleted"
            )
            return {"message": f"User has suspension record"}, 400

        UserRole.delete_by_userId(userId)
        UserGame.delete_by_userId(userId)
        UserSettings.delete_by_userId(userId)

        db.session.delete(user)
        db.session.commit()

        log_info(f"User with ID {userId} deleted")
        return {}, 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Error deleting user with ID {userId}: {e}")
        return {}, 500

from flask import Blueprint, request, jsonify
from .. import jwt
from functools import wraps
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    jwt_required,
    unset_jwt_cookies,
    current_user,
    verify_jwt_in_request,
    get_jwt_identity,
    get_jwt,
)
from ..database.models import db, User, UserRole, Role, UserGame, Game, Permission, RolePermission, datetime_now
from ..utils.logging import log_error, log_info, log_debug
from datetime import timedelta

auth = Blueprint("auth", __name__)


#TODO: PERMISSION REQUIRED

def permission_required(*permissions):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()  # Ensure JWT is present
            current_user_id = get_jwt_identity()  # Get the user ID from the JWT
            current_identity = current_user

            if not current_identity:
                return jsonify({"message": "User not found"}), 404

            if any(permission in current_identity.permissions for permission in permissions):
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Insufficient permissions"}), 403
        return decorator
    return wrapper

def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request() # Make sure the JWT is present and valid
            current_user_id = get_jwt_identity() # Get the user ID from the JWT
            current_user = User.get_by_id(current_user_id)
            if not current_user:
                log_error(f"User with ID {current_user_id} not found")
                return jsonify({"message": "User not found"}), 404

            if any(role in current_user.get_roles() for role in roles):
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Insufficient permissions"}), 403
        return decorator
    return wrapper

@jwt.user_identity_loader
def user_identity_lookup(user: "User") -> str:
    # Convert userId to string to satisfy JWT subject requirement
    return str(user.userId)

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    try:
        # Convert string identity back to integer for database lookup
        user_id = int(identity)
        user = User.get_by_id(user_id)
        return user.to_identity() if user else None
    except (ValueError, TypeError):
        log_error(f"Failed to parse user ID from JWT: {identity}")
        return None


@auth.route("/sign_in", methods=["POST"])
def sign_in():
    log_info(f"Entered sign_in route")
    data = request.get_json()
    
    # Log request data (omitting password)
    request_data = data.copy() if data else {}
    if 'password' in request_data:
        request_data['password'] = '******'  # Mask password
    log_info(f"Sign in request data: {request_data}")

    # Validate required fields
    if not data:
        log_error("No JSON data received in sign_in request")
        return jsonify({"message": "Missing request data"}), 422
        
    username = data.get("username")
    password = data.get("password")
    remember_me = data.get("rememberMe", False)
    
    # Validate username and password
    if not username:
        log_error("Missing username in sign_in request")
        return jsonify({"message": "Username is required"}), 422
        
    if not password:
        log_error("Missing password in sign_in request")
        return jsonify({"message": "Password is required"}), 422
    
    # Try to fetch user
    user = User.get_by_username(username)
    if user is None:
        log_error(f"Sign in failed: User '{username}' not found")
        return jsonify({"message": "Wrong username or password"}), 401
        
    # Check password
    try:
        if not user.check_password(password):
            log_error(f"Sign in failed: Incorrect password for user '{username}'")
            return jsonify({"message": "Wrong username or password"}), 401
    except Exception as e:
        log_error(f"Password check failed with error: {str(e)}")
        return jsonify({"message": "Authentication error occurred"}), 500

    # Update last login time
    try:
        user.lastLogin = datetime_now
        db.session.commit()
    except Exception as e:
        log_error(f"Failed to update last login time: {str(e)}")
        # Continue anyway - non-critical error
        
    log_info(f"User with ID {user.userId} signed in successfully")

    # Create response with JWT token
    response = jsonify({})
    expires = timedelta(days=7) if remember_me else timedelta(hours=1)
    access_token = create_access_token(identity=user, expires_delta=expires)

    set_access_cookies(response, access_token)
    return response

@auth.route("/sign_up", methods=["POST"])
def sign_up():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    request_ip = str(request.remote_addr)

    if not username or not password or not email:
        return jsonify({"message": "Missing username, password or email"}), 400

    if User.username_exists(username):
        return jsonify({"message": "Username already taken"}), 400

    if User.email_exists(email):
        return jsonify({"message": "Email already taken"}), 400

    user = User(username=username, email=email, password=password, registerIP=request_ip, lastIP=request_ip)
    db.session.add(user)
    db.session.commit()

    log_info(f"User with ID {user.userId} signed up")
    return jsonify({}), 201

@auth.route("/sign_out", methods=["POST"])
def sign_out():
    response = jsonify({})
    log_info(f"User signed out")
    unset_jwt_cookies(response)
    return response

@auth.route("/auth_status", methods=["GET"])
@jwt_required(optional=True)
def auth_status():
    if current_user:
        user_identity = current_user.to_dict()  # Using UserIdentity here
        log_info(f"User with ID {current_user.userId} is authenticated")
        return jsonify({
            "isAuthenticated": True,
            "user": user_identity,
        }), 200
    else:
        return jsonify({"isAuthenticated": False}), 200

@auth.route("/adminonly", methods=["GET"])
@jwt_required()
@role_required("admin")
def admin_only():
    log_debug(f"User with ID {current_user.userId} accessed admin-only data")
    return jsonify({"data": "This is admin-only data."})


@auth.route("/admin_permission_only", methods=["GET"])
@jwt_required()
@permission_required("admin_permission")
def admin_permission_only():
    log_debug(f"User with ID {current_user.userId} accessed admin-permission-only data")
    return jsonify({"data": "This is admin-permission-only data."})

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from .database.models import db, Settings, UserSettings
from .utils.logging import log_error, log_info, log_debug

settings_app = Blueprint("settings", __name__)


@jwt_required()
@settings_app.route("/fetch_user_settings/<int:userId>", methods=["GET"])
def fetch_user_settings(userId: int):
    try:
        user_settings = UserSettings.get_by_userId(userId)
        if not user_settings:
            log_error(f"User settings for user with ID {userId} not found")
            return {}, 404

        settings = Settings.get_by_id(user_settings.settingsId)
        if not settings:
            log_error(f"Settings for user with ID {userId} not found")
            return {}, 404

        return jsonify(settings.to_dict()), 200
    except Exception as e:
        log_error(f"Error fetching settings for user with ID {userId}: {str(e)}")
        return {}, 500


@jwt_required()
@settings_app.route("/edit_user_settings/<int:userId>", methods=["PUT"])
def edit_user_settings(userId: int):
    data = request.get_json()
    try:
        user_settings = UserSettings.get_by_userId(userId)
        if not user_settings:
            log_error(f"User settings for user with ID {userId} not found")
            return {}, 404

        settings = Settings.get_by_id(user_settings.settingsId)
        if not settings:
            log_error(f"Settings for user with ID {userId} not found")
            return {}, 404

        settings.language = data.get("language", settings.language)
        settings.date = data.get("date", settings.date)
        settings.time = data.get("time", settings.time)
        settings.currency = data.get("currency", settings.currency)
        db.session.commit()

        log_info(f"Settings for user with ID {userId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Error editing settings for user with ID {userId}: {str(e)}")
        return {}, 500

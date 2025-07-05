from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from .database.models import Session
from .utils.logging import log_error

sessions_app = Blueprint("sessions", __name__)


@jwt_required()
@sessions_app.route("/fetch_sessions", methods=["GET"])
def get_sessions():
    try:
        sessions = Session.get_all()
        session_list = [session.to_dict() for session in sessions]

        return jsonify(session_list), 200
    except Exception as e:
        log_error(f"Failed to fetch sessions: {str(e)}")
        return {}, 500


# @jwt_required()
# @app.route("/get_session_logs", methods=["POST"])
# def get_session_logs():
#     data = request.get_json()
#     sessionId = data.get("id")
#     session_logs = SessionLogs.query.filter_by(sessionId=sessionId).all()
#     session_logs = [log.sessionLogId for log in session_logs]
#     return jsonify(session_logs)

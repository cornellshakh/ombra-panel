from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify
from .utils.logging import log_error
from .utils.utils import parse_all_logs

app = Blueprint("main", __name__)

@jwt_required()
@app.route("/fetch_user_dashboard", methods=["GET"])
def fetch_user_dashboard():
    return jsonify({"message": "User dashboard data"})


@jwt_required()
@app.route("/fetch_server_logs", methods=["GET"])
def get_logs():
    logs = parse_all_logs()
    if not logs:
        log_error("No logs found.")
        return {}, 404

    return jsonify(logs)

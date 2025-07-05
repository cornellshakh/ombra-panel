from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify, request
from .database.models import Suspension
from .utils.logging import log_error, log_info, log_debug
from . import db

suspensions_app = Blueprint("suspensions", __name__)


@jwt_required()
@suspensions_app.route("/fetch_suspensions", methods=["GET"])
def fetch_suspensions():
    try:
        suspensions = Suspension.get_all()
        suspensions_list = [suspension.to_dict() for suspension in suspensions]

        return jsonify(suspensions_list), 200
    except Exception as e:
        log_error(f"Failed to fetch suspensions: {str(e)}")
        return {}, 500
"""
    suspensionId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    HWID = db.Column(db.String(200))
    status = db.Column(db.String(50), nullable=False)  # TODO: Change it to Enum
    suspendedBy = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    suspensionStart = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime_now
    )
    suspensionEnd = db.Column(db.DateTime)
    isActive = db.Column(db.Boolean, nullable=False, default=True)
    lastEdit = db.Column(db.DateTime, default=lambda: datetime_now)
"""
@jwt_required()
@suspensions_app.route("/create_suspension", methods=["POST"])
def create_suspension():
    try:
        data = request.get_json()

        undo = data.get("suspensionId")

        if undo is not None:
            data = data.get("suspension")
        userId = data.get("userId")
        reason = data.get("reason")
        hwid = data.get("HWID")
        status = data.get("status")
        suspendedBy = data.get("suspendedBy")
        suspensionEnd = data.get("suspensionEnd")

        exists = Suspension.get_by_userId(userId)
        if exists:
            log_error(f"User with ID {userId} is already suspended, check the suspension with ID {exists.suspensionId}")
            return {}, 400
        
        suspension = Suspension(
            suspensionId=undo,
            userId=userId,
            reason=reason,
            HWID=hwid,
            status=status,
            suspendedBy=suspendedBy,
            suspensionEnd=suspensionEnd,
        )
        db.session.add(suspension)
        db.session.commit()

        log_info(f"Suspension created for user with ID {userId}") if undo is None else log_info(f"Suspension with ID {undo} updated")
        return jsonify(suspension.to_dict()), 200
    except Exception as e:
        log_error(f"Failed to create suspension: {str(e)}")
        return {}, 500

@jwt_required()
@suspensions_app.route("/delete_suspension/<int:suspensionId>", methods=["DELETE"])
def delete_suspension(suspensionId: int):
    try:
        suspension = Suspension.get_by_id(suspensionId)
        if not suspension:
            log_error(f"Suspension with ID {suspensionId} not found")
            return {}, 404

        db.session.delete(suspension)
        db.session.commit()

        log_info(f"Suspension with ID {suspensionId} deleted")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete suspension {suspensionId}: {str(e)}")
        return {}, 500
    
@jwt_required()
@suspensions_app.route("/edit_suspension/<int:suspensionId>", methods=["PUT"])
def edit_suspension(suspensionId: int):
    try:
        data = request.get_json()
        
        suspension = Suspension.get_by_id(suspensionId)
        if not suspension:
            log_error(f"Suspension with ID {suspensionId} not found")
            return {}, 404
        
        suspension.userId = data.get("userId", suspension.userId)
        suspension.reason = data.get("reason", suspension.reason)
        suspension.HWID = data.get("HWID", suspension.HWID)
        suspension.status = data.get("status", suspension.status)
        suspension.suspendedBy = data.get("suspendedBy", suspension.suspendedBy)
        suspension.suspensionEnd = data.get("suspensionEnd", suspension.suspensionEnd)
        suspension.isActive = data.get("isActive", suspension.isActive)
        suspension.lastEdit = data.get("lastEdit", suspension.lastEdit)
        db.session.commit()
        
        log_info(f"Suspension with ID {suspensionId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit suspension {suspensionId}: {str(e)}")
        return {}, 500

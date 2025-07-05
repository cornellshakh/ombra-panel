from typing import Optional
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from pydantic import BaseModel, field_validator
from .database.models import db, Game, GameType, Key
from .utils.logging import log_error, log_info, log_debug
from .utils.invite import generate_invite_code
from datetime import datetime
from .game_types import GameTypeRequestModel
from .games import GameRequestModel
from .users import UserRequestModel

keys_app = Blueprint("keys", __name__)


class KeyRequestModel(BaseModel):
    keyId: Optional[int] = None
    key: Optional[str] = None
    gameType: GameTypeRequestModel
    game: GameRequestModel
    createdBy: int
    usedBy: Optional[UserRequestModel] = None
    createdAt: Optional[datetime] = None
    usedAt: Optional[datetime] = None
    isUsed: bool = False


@jwt_required()
@keys_app.route("/fetch_keys", methods=["GET"])
def fetch_keys():
    try:
        keys = Key.get_all()
        keys_list = [key.to_dict() for key in keys]

        return jsonify(keys_list)
    except Exception as e:
        log_error(f"Failed to fetch keys: {str(e)}")
        return {}, 500


@jwt_required()
@keys_app.route("/create_key", methods=["POST"])
def create_key():
    try:
        data = request.get_json()

        try:
            key_data = KeyRequestModel(**data)
        except Exception as e:
            log_error(f"Failed to validate key data: {str(e)}")
            return {}, 400

        undo = key_data.keyId

        if key_data.gameType.gameTypeId is None:
            log_error(f"Game type ID not provided")
            return {}, 400

        if key_data.game.gameId is None:
            log_error(f"Game ID not provided")
            return {}, 400

        if key_data.createdBy is None:
            log_error(f"User ID not provided")
            return {}, 400

        game_type = GameType.get_by_id(key_data.gameType.gameTypeId)
        if not game_type:
            log_error(f"Game type {key_data.gameType.gameTypeId} not found")
            return {}, 404

        game = Game.get_by_id(key_data.game.gameId)
        if not game:
            log_error(f"Game with ID {key_data.game.gameId} not found")
            return {}, 404

        generated_key = generate_invite_code()
        new_key = Key(
            keyId=undo,
            key=generated_key,
            createdBy=key_data.createdBy,
            gameId=key_data.game.gameId,
            gameTypeId=key_data.gameType.gameTypeId,
        )

        db.session.add(new_key)
        db.session.commit()

        log_info(
            f"Key with ID {new_key.keyId} created"
            if undo is None
            else f"Key with ID {new_key.keyId} restored"
        )
        return jsonify(new_key.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        log_error(f"Failed to create key: {str(e)}")
        return {}, 500


@jwt_required()
@keys_app.route("/edit_key/<int:keyId>", methods=["PUT"])
def edit_key(keyId):
    try:
        data = request.get_json()

        key = Key.get_by_id(keyId)
        if not key:
            log_error(f"Key with ID {keyId} not found")
            return {}, 404

        game_type = GameType.get_by_name(data.get("gameType").get("name"))
        game = Game.get_by_name(data.get("game").get("name"))

        key.key = data.get("key", key.key)
        key.gameTypeId = game_type.gameTypeId if game_type else key.gameTypeId
        key.gameId = game.gameId if game else key.gameId
        key.createdBy = data.get("createdBy", key.createdBy)
        key.usedBy = data.get("usedBy", key.usedBy)

        created_at = data.get("createdAt")
        used_at = data.get("usedAt")
        if created_at is not None:
            key.createdAt = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%S.%fZ")
        if used_at is not None:
            key.usedAt = datetime.strptime(used_at, "%Y-%m-%dT%H:%M:%S.%fZ")

        key.isUsed = data.get("isUsed", key.isUsed)
        db.session.commit()

        log_info(f"Key with ID {keyId} edited")
        return {}, 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Failed to edit key {keyId}: {str(e)}")
        return {}, 500


@jwt_required()
@keys_app.route("/delete_key/<int:keyId>", methods=["DELETE"])
def delete_key(keyId: int):
    try:
        key = Key.get_by_id(keyId)
        if not key:
            log_error(f"Key with ID {keyId} not found")
            return {}, 404

        db.session.delete(key)
        db.session.commit()

        log_info(f"Key with ID {keyId} deleted")
        return {}, 200
    except Exception as e:
        db.session.rollback()
        log_error(f"Failed to delete key {keyId}: {str(e)}")
        return {}, 500


@jwt_required()
@keys_app.route("/use_key/<int:keyId>", methods=["POST"])
def use_key(keyId: int):
    try:
        data = request.get_json()
        userId = data.get("userId")

        key = Key.get_by_id(keyId)
        if not key:
            log_error(f"Key with ID {keyId} not found")
            return {}, 404

        key.use_key(userId)
        db.session.commit()

        log_info(f"Key with ID {keyId} used by user with ID {userId}")
        return {}, 200

    except Exception as e:
        db.session.rollback()
        log_error(f"Failed to use key with ID {keyId}: {str(e)}")
        return {}, 500

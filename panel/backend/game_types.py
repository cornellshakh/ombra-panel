from typing import Optional
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from pydantic import BaseModel
from .database.models import db, GameType, Key, Game
from .utils.logging import log_error, log_info, log_debug

game_types_app = Blueprint("game_types", __name__)


class GameTypeRequestModel(BaseModel):
    gameTypeId: Optional[int] = None
    name: str
    description: str
    color: str


@jwt_required()
@game_types_app.route("/fetch_game_types", methods=["GET"])
def fetch_game_types():
    try:
        game_types = GameType.get_all()
        game_types_list = [game_type.to_dict() for game_type in game_types]

        return jsonify(game_types_list), 200
    except Exception as e:
        log_error(f"Failed to fetch game types: {str(e)}")
        return {}, 500


@jwt_required()
@game_types_app.route("/create_game_type", methods=["POST"])
def create_game_type():
    try:
        data = request.get_json()
        undo = data.get("gameTypeId")
        if undo is not None:
            data = data.get("gameType")
        name = data.get("name")
        description = data.get("description")
        color = data.get("color")
        game_type = GameType.get_by_name(name)
        if game_type:
            log_error(f"Game type name already exists")
            return {}, 400

        game_type = GameType.get_by_color(color)
        if game_type:
            log_error(f"Game type color already exists")
            return {}, 400

        new_game_type = GameType(
            gameTypeId=undo, name=name, description=description, color=color
        )
        db.session.add(new_game_type)
        db.session.commit()

        log_info(
            f"Game type with ID {new_game_type.gameTypeId} restored"
            if undo is not None
            else f"Game type with ID {new_game_type.gameTypeId} created"
        )
        return jsonify(new_game_type.to_dict()), 201
    except Exception as e:
        log_error(f"Failed to create game type: {str(e)}")
        return {}, 500


@jwt_required()
@game_types_app.route("/edit_game_type/<int:gameTypeId>", methods=["PUT"])
def edit_game_type(gameTypeId: int):
    try:
        data = request.get_json()
        game_type = GameType.get_by_id(gameTypeId)

        if not game_type:
            log_error(f"Game type with ID {gameTypeId} not found")
            return {}, 404

        game_type.name = data.get("name", game_type.name)
        game_type.color = data.get("color", game_type.color)
        db.session.commit()

        log_info(f"Game type with ID {gameTypeId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit game type {gameTypeId}: {str(e)}")
        return {}, 500


@jwt_required()
@game_types_app.route("/delete_game_type/<int:gameTypeId>", methods=["DELETE"])
def delete_game_type(gameTypeId: int):
    try:
        game_type = GameType.get_by_id(gameTypeId)
        if not game_type:
            log_error(f"Game type with ID {gameTypeId} not found")
            return {}, 404

        existing_games = Game.get_by_game_type_id(gameTypeId)
        if existing_games:
            log_error(f"Game type with ID {gameTypeId} has games")
            return {}, 400

        existing_keys = Key.get_by_game_type_id(gameTypeId)
        if existing_keys:
            log_error(f"Game type with ID {gameTypeId} has keys")
            return {}, 400

        db.session.delete(game_type)
        db.session.commit()

        log_info(f"Game type with ID {gameTypeId} deleted")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete game type {gameTypeId}: {str(e)}")
        return {}, 500

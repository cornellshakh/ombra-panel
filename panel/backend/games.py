from typing import Optional
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from pydantic import BaseModel
from .database.models import db, Game, Key, UserGame
from .utils.logging import log_error, log_info, log_debug
from .game_types import GameTypeRequestModel

games_app = Blueprint("games", __name__)


class GameRequestModel(BaseModel):
    gameId: Optional[int] = None
    name: str
    gameType: GameTypeRequestModel
    color: str


@jwt_required()
@games_app.route("/fetch_games", methods=["GET"])
def fetch_games():
    try:
        log_info("Fetching games")
        games = Game.get_all()
        games_list = [game.to_dict() for game in games]

        return jsonify(games_list), 200
    except Exception as e:
        log_error(f"Failed to fetch games: {str(e)}")
        return {}, 500


@jwt_required()
@games_app.route("/create_game", methods=["POST"])
def create_game():
    try:
        data = request.get_json()

        undo = data.get("gameId")
        if undo is not None:
            data = data.get("game")

        name = data.get("name")
        game_type_id = data.get("gameType").get("gameTypeId")
        color = data.get("color")

        game = Game.get_by_name(name)
        if game:
            log_error(f"Game name already exists")
            return {}, 400

        game = Game.get_by_color(color)
        if game:
            log_error(f"Game color already exists")
            return {}, 400

        new_game = Game(gameId=undo, name=name, gameTypeId=game_type_id, color=color)
        db.session.add(new_game)
        db.session.commit()

        log_info(
            f"Game with ID {new_game.gameId} restored"
            if undo is not None
            else f"Game with ID {new_game.gameId} created"
        )
        return jsonify(new_game.to_dict()), 201
    except Exception as e:
        log_error(f"Failed to create game: {str(e)}")
        return {}, 500


@jwt_required()
@games_app.route("/edit_game/<int:gameId>", methods=["PUT"])
def edit_game(gameId: int):
    try:
        data = request.get_json()

        game = Game.get_by_id(gameId)
        if not game:
            log_error(f"Game with ID {gameId} not found")
            return {}, 404

        game = Game.get_by_name(data.get("name"))
        if game and game.gameId != data.get("gameId"):
            log_error(f"Game name already exists")
            return {}, 400

        game = Game.get_by_color(data.get("color"))
        if game and game.gameId != data.get("gameId"):
            log_error(f"Game color already exists")
            return {}, 400

        if game:
            game.name = data.get("name", game.name)
            game.gameTypeId = data.get("gameType").get("gameTypeId", game.gameTypeId)
            game.color = data.get("color", game.color)
            db.session.commit()

        log_info(f"Game with ID {gameId} edited")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to edit game {gameId}: {str(e)}")
        return {}, 500


@jwt_required()
@games_app.route("/delete_game/<int:gameId>", methods=["DELETE"])
def delete_game(gameId: int):
    try:
        game = Game.get_by_id(gameId)
        if not game:
            log_error(f"Game with ID {gameId} not found")
            return {}, 404

        existing_users = UserGame.get_by_gameId(gameId)
        if existing_users:
            log_error(f"Game with ID {gameId} has users")
            return {}, 400

        existing_keys = Key.get_by_game_id(gameId)
        if existing_keys:
            log_error(f"Game with ID {gameId} has keys")
            return {}, 400

        db.session.delete(game)
        db.session.commit()

        log_info(f"Game with ID {gameId} deleted")
        return {}, 200
    except Exception as e:
        log_error(f"Failed to delete game {gameId}: {str(e)}")
        return {}, 500

from flask_sqlalchemy import SQLAlchemy
from .utils.logging import setup_loguru, InterceptHandler
from flask import Flask
import logging
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()


def create_app() -> Flask:
    global jwt
    # Configure Loguru before Flask app is created
    setup_loguru()

    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "yung-twizzy-cookie-lean-mix"
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = (
        True  # Only send cookies over https. Set to False if development in http.
    )
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True  # Enable CSRF protection

    jwt = JWTManager(app)
    # Disable Flask"s default logging
    app.logger.disabled = True
    logging.getLogger("werkzeug").disabled = True

    # Redirect all standard logging to Loguru
    logging.basicConfig(handlers=[InterceptHandler()], level=0)

    # App configuration
    app.config["SECRET_KEY"] = "ombra-hq-twizzy-up"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.sqlite"

    # Initialize extensions
    db.init_app(app)

    # Import and register blueprints
    from .main import app as main_blueprint

    app.register_blueprint(main_blueprint)
    from .server.auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)
    from .users import users_app as user_blueprint

    app.register_blueprint(user_blueprint)
    from .suspensions import suspensions_app as suspensions_blueprint

    app.register_blueprint(suspensions_blueprint)
    from .keys import keys_app as keys_blueprint

    app.register_blueprint(keys_blueprint)
    from .roles import roles_app as roles_blueprint

    app.register_blueprint(roles_blueprint)
    from .permissions import permissions_app as permissions_blueprint

    app.register_blueprint(permissions_blueprint)
    from .games import games_app as games_blueprint

    app.register_blueprint(games_blueprint)
    from .game_types import game_types_app as game_types_blueprint

    app.register_blueprint(game_types_blueprint)
    from .settings import settings_app as settings_blueprint

    app.register_blueprint(settings_blueprint)
    from .sessions import sessions_app as sessions_blueprint

    app.register_blueprint(sessions_blueprint)
    from .listings import listings_app as listings_blueprint

    app.register_blueprint(listings_blueprint)
    from .discounts import discounts_app as discounts_blueprint

    app.register_blueprint(discounts_blueprint)

    CORS(app, supports_credentials=True)
    return app

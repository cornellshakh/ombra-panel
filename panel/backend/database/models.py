from .. import db  # Cant be imported from .database because of circular import

# datetime_now_str has to be here because its imported from somewhere else
from .database import datetime_now, UserStatus, datetime_now_str
from datetime import datetime
from typing import Any, Optional
import bcrypt
import os
import base64
from io import BytesIO
from PIL import Image
class Role(db.Model):
    __tablename__ = "Roles"
    roleId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    color = db.Column(db.String(7), nullable=False, unique=True)

    @classmethod
    def get_all(cls) -> list["Role"]:
        return Role.query.all()

    @classmethod
    def get_by_id(cls, roleId: int) -> "Role | None":
        return Role.query.get(roleId)

    @classmethod
    def get_by_name(cls, name: str) -> "Role | None":
        return Role.query.filter_by(name=name).first()

    @classmethod
    def get_by_color(cls, color: str) -> "Role | None":
        return Role.query.filter_by(color=color).first()

    def to_dict(self) -> dict[str, Any]:
        return {
            "roleId": self.roleId,
            "name": self.name,
            "description": self.description,
            "color": self.color,
        }

    def __init__(
        self,
        name: str,
        roleId: int | None = None,
        description: Optional[str] = "",
        color: Optional[str] = "",
    ):
        if roleId is not None:
            self.roleId = roleId
        self.name = name
        self.description = description
        self.color = color


class Permission(db.Model):
    __tablename__ = "Permissions"
    permissionId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)

    @classmethod
    def get_all(cls) -> list["Permission"]:
        return cls.query.all()

    @classmethod
    def get_by_ids(cls, permissionIds: list[int]) -> list["Permission"]:
        return cls.query.filter(
            cls.permissionId.in_(permissionIds)
        ).all()  # tohle neni error, Pylance to jenom spatne zobrazuje

    @classmethod
    def get_by_id(cls, permissionId: int) -> "Permission | None":
        return cls.query.get(permissionId)

    @classmethod
    def get_by_name(cls, name: str) -> "Permission | None":
        return cls.query.filter_by(name=name).first()

    def to_dict(self) -> dict[str, Any]:
        return {
            "permissionId": self.permissionId,
            "name": self.name,
            "description": self.description,
        }

    def __init__(
        self,
        name: str,
        description: Optional[str] = "",
        permissionId: int | None = None,
    ):
        if permissionId is not None:
            self.permissionId = permissionId
        self.name = name
        self.description = description


class RolePermission(db.Model):
    __tablename__ = "RolePermissions"
    roleId = db.Column(db.Integer, db.ForeignKey("Roles.roleId"), primary_key=True)
    permissionId = db.Column(
        db.Integer, db.ForeignKey("Permissions.permissionId"), primary_key=True
    )

    @classmethod
    def get_by_role_id(cls, roleId: int) -> list["RolePermission"]:
        return cls.query.filter_by(roleId=roleId).all()

    @classmethod
    def get_by_permission_id(cls, permissionId: int) -> list["RolePermission"]:
        return cls.query.filter_by(permissionId=permissionId).all()

    @classmethod
    def to_dict(cls) -> dict[str, Any]:
        return {"roleId": cls.roleId, "permissionId": cls.permissionId}

    @classmethod
    def get_all(cls) -> list["RolePermission"]:
        return cls.query.all()

    @classmethod
    def get_all_by_role_id(cls, roleId: int) -> list["RolePermission"]:
        return cls.query.filter_by(roleId=roleId).all()

    @classmethod
    def get_by_role_permission_id(
        cls, roleId: int, permissionId: int
    ) -> "RolePermission | None":
        return cls.query.filter_by(roleId=roleId, permissionId=permissionId).first()

    def __init__(self, roleId: int, permissionId: int):
        self.roleId = roleId
        self.permissionId = permissionId


class GameType(db.Model):
    __tablename__ = "GameTypes"
    gameTypeId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    color = db.Column(db.String(7), nullable=False, unique=True)

    @classmethod
    def get_all(cls) -> list["GameType"]:
        return GameType.query.all()

    @classmethod
    def get_by_id(cls, gameTypeId: int) -> "GameType | None":
        return GameType.query.get(gameTypeId)

    @classmethod
    def get_by_name(cls, name: str) -> "GameType | None":
        return GameType.query.filter_by(name=name).first()

    @classmethod
    def get_by_color(cls, color: str) -> "GameType | None":
        return GameType.query.filter_by(color=color).first()

    def to_dict(self) -> dict[str, Any]:
        return {
            "gameTypeId": self.gameTypeId,
            "name": self.name,
            "description": self.description,
            "color": self.color,
        }

    def __init__(
        self,
        name: str,
        gameTypeId: int | None = None,
        description: Optional[str] = "",
        color: Optional[str] = "",
    ):
        if gameTypeId is not None:
            self.gameTypeId = gameTypeId
        self.name = name
        self.description = description
        self.color = color


class Game(db.Model):
    __tablename__ = "Games"
    gameId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    gameTypeId = db.Column(db.Integer, db.ForeignKey("GameTypes.gameTypeId"))
    color = db.Column(db.String(7), nullable=False, unique=True)

    @classmethod
    def get_all(cls) -> list["Game"]:
        return Game.query.all()

    @classmethod
    def get_by_id(cls, gameId: int) -> "Game | None":
        return Game.query.get(gameId)

    @classmethod
    def get_by_game_type_id(cls, gameTypeId: int) -> list["Game"]:
        return Game.query.filter_by(gameTypeId=gameTypeId).all()

    @classmethod
    def get_by_name(cls, name: str) -> "Game | None":
        return Game.query.filter_by(name=name).first()

    @classmethod
    def get_by_color(cls, color: str) -> "Game | None":
        return Game.query.filter_by(color=color).first()

    def to_dict(self) -> dict[str, Any] | None:
        game_type = GameType.get_by_id(self.gameTypeId)
        game_type_dict = game_type.to_dict() if game_type is not None else None

        return (
            {
                "gameId": self.gameId,
                "name": self.name,
                "gameType": game_type_dict,
                "color": self.color,
            }
            if self
            else None
        )

    def __init__(
        self,
        name: str,
        gameTypeId: int,
        gameId: int | None = None,
        color: Optional[str] = "",
    ):
        if gameId is not None:
            self.gameId = gameId
        self.name = name
        self.gameTypeId = gameTypeId
        self.color = color


class Settings(db.Model):
    __tablename__ = "Settings"
    settingsId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language = db.Column(db.String(2), nullable=False, default="en")
    date = db.Column(db.String(10), nullable=False, default="DD.MM.YYYY")
    time = db.Column(db.String(2), nullable=False, default="24")
    currency = db.Column(db.String(3), nullable=False, default="USD")

    @classmethod
    def get_by_id(cls, settingsId: int) -> "Settings | None":
        return Settings.query.get(settingsId)

    def to_dict(self) -> dict[str, Any]:
        return {
            "language": self.language,
            "date": self.date,
            "time": self.time,
            "currency": self.currency,
        }

    def __init__(
        self,
        language: str = "en",
        date: str = "DD.MM.YYYY",
        time: str = "24",
        currency: str = "USD",
    ):
        self.language = language
        self.date = date
        self.time = time
        self.currency = currency


class UserIdentity:
    def __init__(self, userId: int, username: str, email: str, roles: list[str], permissions: list[str]):
        self.userId = userId
        self.username = username
        self.email = email
        self.roles = roles
        self.permissions = permissions

    def to_dict(self) -> dict[str, Any]:
        return {
            "userId": self.userId,
            "username": self.username,
            "email": self.email,
            "roles": self.roles,
            "permissions": self.permissions
        }

    @classmethod
    def from_user(cls, user: "User") -> "UserIdentity":
        # Fetch role names (strings)
        roles = [role['name'] for role in user.get_roles()]
        permissions = cls.get_permissions_from_roles(roles)  # Pass role names to the method
        return cls(user.userId, user.username, user.email, roles, permissions)

    @staticmethod
    def get_permissions_from_roles(role_names: list[str]) -> list[str]:
        permissions = []
        for role_name in role_names:
            role = Role.get_by_name(role_name)
            if role:
                # Get all permissions linked to this role
                role_permissions = RolePermission.get_all_by_role_id(role.roleId)
                for rp in role_permissions:
                    permission = Permission.get_by_id(rp.permissionId)
                    if permission:
                        permissions.append(permission.name)
        return permissions

class User(db.Model):
    __tablename__ = "Users"
    userId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    HWID = db.Column(db.String(200))
    registerDate = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    registerIP = db.Column(db.String(40), nullable=False)
    subscriptionStart = db.Column(db.DateTime)
    subscriptionEnd = db.Column(db.DateTime)
    lastLogin = db.Column(db.DateTime)
    lastEdit = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    lastIP = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default=UserStatus.Inactive.value)

    @classmethod
    def get_all(cls) -> list["User"]:
        return User.query.all()

    @classmethod
    def get_by_id(cls, userId: int) -> "User | None":
        return User.query.get(userId)

    @classmethod
    def get_by_username(cls, username: str) -> "User | None":
        return User.query.filter_by(username=username).first()

    @classmethod
    def get_by_role_id(cls, roleId: int) -> list["User"]:
        return User.query.join(UserRole).filter(UserRole.roleId == roleId).all()

    @classmethod
    def get_by_game_id(cls, gameId: int) -> list["User"]:
        return User.query.join(UserGame).filter(UserGame.gameId == gameId).all()

    @classmethod
    def username_exists(cls, username: str) -> bool:
        return User.query.filter_by(username=username).one_or_none() is not None

    @classmethod
    def username_exists_except_id(cls, username: str, userId: int) -> bool:
        return (
            User.query.filter_by(username=username)
            .filter(User.userId != userId)
            .one_or_none()
            is not None
        )

    @classmethod
    def email_exists(cls, email: str) -> bool:
        return User.query.filter_by(email=email).one_or_none() is not None

    @classmethod
    def email_exists_except_id(cls, email: str, userId: int) -> bool:
        return (
            User.query.filter_by(email=email)
            .filter(User.userId != userId)
            .one_or_none()
            is not None
        )

    @classmethod
    def hwid_exists(cls, HWID: str) -> bool:
        return User.query.filter_by(HWID=HWID).one_or_none() is not None

    @classmethod
    def hwid_exists_except_id(cls, HWID: str, userId: int) -> bool:
        return (
            User.query.filter_by(HWID=HWID).filter(User.userId != userId).one_or_none()
            is not None
        )

    @classmethod
    def get_profile_picture(cls, userId: int) -> str | None:
        try:
            with open(f"./profile_pictures/{userId}.webp", "rb") as f:
                profile_pic = f.read()
                profile_pic_base64 = base64.b64encode(profile_pic).decode(
                    "utf-8"
                )  # Encode the binary data to base64
                return f"data:image/webp;base64,{profile_pic_base64}"
        except FileNotFoundError:
            return None
        except Exception as e:
            print(f"Error reading profile picture for user {userId}: {e}")
            return None

    @classmethod
     
    def edit_profile_picture(cls, userId: int, picture: str) -> None:
        try:
            picture_data = base64.b64decode(picture.split(",")[1])

            image = Image.open(BytesIO(picture_data))

            max_size_in_bytes = 2 * 1024 * 1024  # 2MB
            if len(picture_data) > max_size_in_bytes:
                raise ValueError("Image size exceeds the limit of 2MB.")

            output = BytesIO()
            image.save(output, format="WEBP")
            webp_data = output.getvalue()

            with open(f"./profile_pictures/{userId}.webp", "wb") as f:
                f.write(webp_data)
        except Exception as e:
            print(f"Error editing profile picture for user {userId}: {e}")

    @classmethod
    def delete_profile_picture(cls, userId: int) -> None:
        os.remove(f"./profile_pictures/{userId}.webp")

    @classmethod
    def add_profile_picture(cls, userId: int, picture: str) -> None:
        try:
            picture_data = base64.b64decode(picture.split(",")[1])
            image = Image.open(BytesIO(picture_data))

            max_size_in_bytes = 2 * 1024 * 1024  # 2MB

            if len(picture_data) > max_size_in_bytes:
                raise ValueError("Image size exceeds the limit of 2MB.")

            output = BytesIO()
            image.save(output, format="WEBP")
            webp_data = output.getvalue()

            with open(f"./profile_pictures/{userId}.webp", "wb") as f:
                f.write(webp_data)
        except Exception as e:
            print(f"Error adding profile picture for user {userId}: {e}")
            raise

    def to_identity(self) -> "UserIdentity":
        return UserIdentity.from_user(self)

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

    def get_roles(self):
        user_roles = UserRole.get_by_userId(self.userId)
        roles_info = []

        for user_role in user_roles:
            role = Role.get_by_id(user_role.roleId)
            if role:
                roles_info.append(role.to_dict())
        return roles_info

    def get_games(self):
        user_games = UserGame.query.filter_by(userId=self.userId).all()
        games_info = []

        for user_game in user_games:
            game = Game.get_by_id(user_game.gameId)
            if game:
                games_info.append(game.to_dict())
        return games_info

    def to_dict(self) -> dict[str, Any]:
        return {
            "userId": self.userId,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "HWID": self.HWID,
            "registerDate": (
                self.registerDate.isoformat() if self.registerDate else None
            ),
            "registerIP": self.registerIP,
            "subscription": (
                {
                    "start": (
                        self.subscriptionStart.isoformat()
                        if self.subscriptionStart
                        else None
                    ),
                    "end": (
                        self.subscriptionEnd.isoformat()
                        if self.subscriptionEnd
                        else None
                    ),
                }
                if self.subscriptionStart or self.subscriptionEnd
                else None
            ),
            "lastLogin": self.lastLogin.isoformat() if self.lastLogin else None,
            "lastEdit": self.lastEdit.isoformat() if self.lastEdit else None,
            "lastIP": self.lastIP,
            "status": self.status,
            "roles": self.get_roles(),
            "games": self.get_games(),
            "profilePicture": User.get_profile_picture(self.userId),
        }

    def __init__(
        self,
        username: str,
        email: str,
        password: str,
        registerIP: str,
        lastIP: str,
        userId: int | None = None,
        HWID: Optional[str] = "",
        registerDate: Optional[datetime] = None,
        subscriptionStart: Optional[datetime] = None,
        subscriptionEnd: Optional[datetime] = None,
        lastLogin: Optional[datetime] = None,
        status: str = UserStatus.Inactive.value,
    ):
        if userId is not None:
            self.userId = userId
        self.username = username
        self.email = email
        self.password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
        self.HWID = HWID
        self.registerDate = registerDate if registerDate else datetime_now
        self.registerIP = registerIP
        self.status = status
        self.subscriptionStart = subscriptionStart
        self.subscriptionEnd = subscriptionEnd
        self.lastLogin = lastLogin
        self.lastIP = lastIP

        db.session.add(self)
        db.session.commit()

        member_role = Role.get_by_name("Member")
        if member_role:
            user_roles = UserRole(self.userId, member_role.roleId)
            db.session.add(user_roles)
            db.session.commit()

        settings = Settings()
        db.session.add(settings)
        db.session.commit()

        user_settings = UserSettings(self.userId, settings.settingsId)
        db.session.add(user_settings)
        db.session.commit()


class UserRole(db.Model):
    __tablename__ = "UserRoles"
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), primary_key=True)
    roleId = db.Column(db.Integer, db.ForeignKey("Roles.roleId"), primary_key=True)

    @classmethod
    def get_by_id(cls, userId: int, roleId: int) -> "UserRole | None":
        return UserRole.query.filter_by(userId=userId, roleId=roleId).first()

    @classmethod
    def get_by_userId(cls, userId: int) -> list["UserRole"]:
        return UserRole.query.filter_by(userId=userId).all()

    @classmethod
    def get_by_roleId(cls, roleId: int) -> list["UserRole"]:
        return UserRole.query.filter_by(roleId=roleId).all()

    @classmethod
    def delete_by_userId(cls, userId: int) -> None:
        UserRole.query.filter_by(userId=userId).delete()

    @classmethod
    def delete(cls, userId: int, roleId: int) -> None:
        UserRole.query.filter_by(userId=userId, roleId=roleId).delete()

    def __init__(self, userId: int, roleId: int):
        self.userId = userId
        self.roleId = roleId


class UserGame(db.Model):
    __tablename__ = "UserGames"
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), primary_key=True)
    gameId = db.Column(db.Integer, db.ForeignKey("Games.gameId"), primary_key=True)

    @classmethod
    def get_by_userId(cls, userId: int) -> list["UserGame"]:
        return UserGame.query.filter_by(userId=userId).all()

    @classmethod
    def get_by_gameId(cls, gameId: int) -> list["UserGame"]:
        return UserGame.query.filter_by(gameId=gameId).all()

    @classmethod
    def delete_by_userId(cls, userId: int) -> None:
        UserGame.query.filter_by(userId=userId).delete()

    @classmethod
    def delete(cls, userId: int, gameId: int) -> None:
        UserGame.query.filter_by(userId=userId, gameId=gameId).delete()

    def __init__(self, userId: int, gameId: int):
        self.userId = userId
        self.gameId = gameId


class UserSettings(db.Model):
    __tablename__ = "UserSettings"
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), primary_key=True)
    settingsId = db.Column(
        db.Integer, db.ForeignKey("Settings.settingsId"), primary_key=True
    )

    @classmethod
    def get_by_userId(cls, userId: int) -> "UserSettings | None":
        return UserSettings.query.filter_by(userId=userId).first()

    @classmethod
    def delete_by_userId(cls, userId: int) -> "UserSettings | None":
        return UserSettings.query.filter_by(userId=userId).first()

    def __init__(self, userId: int, settingsId: int):
        self.userId = userId
        self.settingsId = settingsId


class Session(db.Model):
    __tablename__ = "Sessions"
    sessionId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    gameId = db.Column(db.Integer, db.ForeignKey("Games.gameId"), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # TODO: Change it to Enum
    createdAt = db.Column(db.DateTime, default=lambda: datetime_now)

    @classmethod
    def get_all(cls) -> list["Session"]:
        return Session.query.all()

    @classmethod
    def get_by_id(cls, sessionId: int) -> "Session | None":
        return Session.query.get(sessionId)

    def to_dict(self) -> dict[str, Any]:
        user = User.get_by_id(self.userId)
        user_dict = user.to_dict() if user is not None else None
        game = Game.get_by_id(self.gameId)
        game_dict = game.to_dict() if game is not None else None

        return {
            "sessionId": self.sessionId,
            "user": user_dict,
            "game": game_dict,
            "status": self.status,
            "createdAt": self.createdAt.isoformat() if self.createdAt else None,
        }

    def __init__(self, userId: int, gameId: int, status: str):
        self.userId = userId
        self.gameId = gameId
        self.status = status
        self.createdAt = datetime_now


class SessionLog(db.Model):
    __tablename__ = "SessionLogs"
    sessionLogId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sessionId = db.Column(
        db.Integer, db.ForeignKey("Sessions.sessionId"), nullable=False
    )

    def __init__(self, sessionId: int):
        self.sessionId = sessionId

"""
typedef enum {
    SecurityReportType_Generic,
    SecurityReportType_ProcessDetected,
    SecurityReportType_ModuleDetected,
    SecurityReportType_MemoryDetected,
    SecurityReportType_DebugDetected,
    SecurityReportType_ThreadDetected,
    SecurityReportType_HookDetected,
    SecurityReportType_Error
} SecurityReportType;
""" 
class Suspension(db.Model): # TODO: pridat security report type
    __tablename__ = "Suspensions"
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

    @classmethod
    def get_all(cls) -> list["Suspension"]:
        return Suspension.query.all()
    
    @classmethod
    def get_by_id(cls, suspensionId: int) -> "Suspension | None":
        return Suspension.query.get(suspensionId)

    @classmethod
    def get_by_userId(cls, userId: int) -> "Suspension | None":
        return Suspension.query.filter_by(userId=userId).first()

    def to_dict(self) -> dict[str, Any]:
        user = User.get_by_id(self.userId)
        user_dict = user.to_dict() if user is not None else None

        suspended_by = User.get_by_id(self.suspendedBy)
        suspended_by_dict = suspended_by.to_dict() if suspended_by is not None else None

        return {
            "suspensionId": self.suspensionId,
            "user": user_dict,
            "status": self.status,
            "reason": self.reason,
            "HWID": self.HWID,
            "suspendedBy": suspended_by_dict,
            "suspension": {
                "start": (
                    self.suspensionStart.isoformat() if self.suspensionStart else None
                ),
                "end": self.suspensionEnd.isoformat() if self.suspensionEnd else None,
            },
            "isActive": self.isActive,
            "lastEdit": self.lastEdit.isoformat() if self.lastEdit else None,
        }

    def __init__(
        self,
        userId: int,
        status: str,
        reason: str,
        suspendedBy: int,
        suspensionId: int | None = None,
        HWID: Optional[str] = None,
        suspensionStart: Optional[datetime] = None,
        suspensionEnd: Optional[datetime] = None,
        isActive: bool = True,
    ):
        if suspensionId is not None:
            self.suspensionId = suspensionId
        self.userId = userId
        self.status = status
        self.reason = reason
        self.suspendedBy = suspendedBy
        self.HWID = HWID
        self.suspensionStart = suspensionStart if suspensionStart else datetime_now
        self.suspensionEnd = suspensionEnd
        self.isActive = isActive
        self.lastEdit = datetime_now


class InviteCode(db.Model):
    __tablename__ = "InviteCodes"
    inviteId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(200), nullable=False)
    createdBy = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    usedBy = db.Column(db.Integer, db.ForeignKey("Users.userId"))
    usedAt = db.Column(db.DateTime)
    isActive = db.Column(db.Boolean, default=True)
    lastEdit = db.Column(db.DateTime, default=lambda: datetime_now)

    def __init__(
        self,
        code: str,
        createdBy: int,
        usedBy: Optional[int] = None,
        usedAt: Optional[datetime] = None,
        isActive: bool = True,
    ):
        self.code = code
        self.createdBy = createdBy
        self.createdAt = datetime_now
        self.usedBy = usedBy
        self.usedAt = usedAt
        self.isActive = isActive
        self.lastEdit = datetime_now


class Key(db.Model):
    __tablename__ = "Keys"
    keyId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(200), nullable=False, unique=True)
    gameTypeId = db.Column(db.Integer, db.ForeignKey("GameTypes.gameTypeId"))
    gameId = db.Column(db.Integer, db.ForeignKey("Games.gameId"))
    createdBy = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    usedBy = db.Column(db.Integer, db.ForeignKey("Users.userId"))
    createdAt = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    usedAt = db.Column(db.DateTime)
    isUsed = db.Column(db.Boolean, default=False)

    @classmethod
    def get_all(cls) -> list["Key"]:
        return Key.query.all()

    @classmethod
    def get_by_id(cls, keyId: int) -> "Key | None":
        return Key.query.get(keyId)

    @classmethod
    def get_by_game_type_id(cls, gameTypeId: int) -> list["Key"]:
        return Key.query.filter_by(gameTypeId=gameTypeId).all()

    @classmethod
    def get_by_game_id(cls, gameId: int) -> list["Key"]:
        return Key.query.filter_by(gameId=gameId).all()

    def use_key(self, userId: int) -> None:
        self.usedBy = userId
        self.usedAt = datetime_now
        self.isUsed = True

    def to_dict(self) -> dict[str, Any]:
        game_type_dict = None
        game_dict = None
        created_by_dict = None
        used_by_dict = None

        if self.gameTypeId is not None:
            game_type = GameType.get_by_id(self.gameTypeId)
            game_type_dict = game_type.to_dict() if game_type else None

        if self.gameId is not None:
            game = Game.get_by_id(self.gameId)
            game_dict = game.to_dict() if game else None

        if self.createdBy is not None:
            created_by = User.get_by_id(self.createdBy)
            created_by_dict = created_by.to_dict() if created_by else None

        if self.usedBy is not None:
            used_by = User.get_by_id(self.usedBy)
            used_by_dict = used_by.to_dict() if used_by else None

        return {
            "keyId": self.keyId,
            "key": self.key,
            "gameType": game_type_dict,
            "game": game_dict,
            "createdBy": created_by_dict,
            "usedBy": used_by_dict,
            "createdAt": self.createdAt.isoformat() if self.createdAt else None,
            "usedAt": self.usedAt.isoformat() if self.usedAt else None,
            "isUsed": self.isUsed,
        }

    def __init__(
        self,
        key: str,
        createdBy: int,
        keyId: Optional[int] = None,
        gameTypeId: Optional[int] = None,
        gameId: Optional[int] = None,
        isUsed: bool = False,
        usedBy: Optional[int] = None,
        usedAt: Optional[datetime] = None,
    ):
        if keyId is not None:
            self.keyId = keyId
        self.key = key
        self.createdBy = createdBy
        self.usedBy = usedBy
        self.usedAt = usedAt
        self.gameTypeId = gameTypeId
        self.gameId = gameId
        self.isUsed = isUsed
        self.createdAt = datetime_now


class Listing(db.Model):
    __tablename__ = "Listings"
    listingId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    gameId = db.Column(db.Integer, db.ForeignKey("Games.gameId"), nullable=False)
    price = db.Column(db.Float, nullable=False)
    copies = db.Column(db.Integer, nullable=False)
    sold = db.Column(db.Integer, nullable=False, default=0)
    isActive = db.Column(db.Boolean, default=True)
    discountId = db.Column(db.Integer, db.ForeignKey("Discounts.discountId"), nullable=True)

    # One-to-many with DiscountIntent
    intended_discounts = db.relationship("DiscountIntent", back_populates="listing")

    discount = db.relationship("Discount", back_populates="listings")

    def to_dict(self) -> dict[str, Any]:
        return {
            "listingId": self.listingId,
            "name": self.name,
            "description": self.description,
            "gameId": self.gameId,
            "price": self.price,
            "copies": self.copies,
            "sold": self.sold,
            "isActive": self.isActive,
            "discount": self.discount.to_dict() if self.discount else None,
            "intendedDiscounts": [intent.discountId for intent in self.intended_discounts],
        }

    @classmethod
    def get_all(cls) -> list["Listing"]:
        return Listing.query.all()
    
    @classmethod
    def get_by_id(cls, listingId: int) -> "Listing | None":
        return Listing.query.get(listingId)
    
    @classmethod
    def get_by_name(cls, listingName: str) -> "Listing | None":
        return Listing.query.filter_by(name=listingName).first()
        

    def __init__(
        self,
        name: str,
        gameId: int,
        price: float,
        description: str,
        copies: int,
        discountId: Optional[int] = None,
        startDate: Optional[datetime] = None,
        endDate: Optional[datetime] = None,
        isActive: bool = True,
        listingId: int | None = None,
    ):
        if listingId is not None:
            self.listingId = listingId
        self.name = name
        self.startDate = startDate if startDate else datetime_now
        self.endDate = endDate
        self.gameId = gameId
        self.price = price
        self.description = description
        self.copies = copies
        self.sold = 0
        self.isActive = isActive
        self.discountId = discountId


class DiscountIntent(db.Model):
    __tablename__ = "DiscountIntents"
    discountIntentId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    discountId = db.Column(db.Integer, db.ForeignKey("Discounts.discountId"), nullable=False)
    listingId = db.Column(db.Integer, db.ForeignKey("Listings.listingId"), nullable=False)

    discount = db.relationship("Discount", back_populates="intended_listings")
    listing = db.relationship("Listing", back_populates="intended_discounts")

    def to_dict(self) -> dict[str, Any]:
        return {
            "discountIntentId": self.discountIntentId,
            "discountId": self.discountId,
            "listingId": self.listingId,
        }
    def __init__(self, discountId: int, listingId: int):
        self.discountId = discountId
        self.listingId = listingId

class Discount(db.Model):
    __tablename__ = "Discounts"
    discountId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    startDate = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    endDate = db.Column(db.DateTime)
    discount = db.Column(db.Float, nullable=False)
    isActive = db.Column(db.Boolean, default=True)

    # One-to-many with DiscountIntent
    intended_listings = db.relationship("DiscountIntent", back_populates="discount")

    listings = db.relationship("Listing", back_populates="discount", lazy='dynamic')

    def to_dict(self) -> dict[str, Any]:
        return {
            "discountId": self.discountId,
            "name": self.name,
            "startDate": self.startDate.isoformat() if self.startDate else None,
            "endDate": self.endDate.isoformat() if self.endDate else None,
            "discount": self.discount,
            "isActive": self.isActive,
            "intendedListings": [intent.listingId for intent in self.intended_listings],  # List of intended Listing IDs
            "listingsId": [listing.listingId for listing in self.listings],  # List of applied Listing IDs
        }

    @classmethod
    def get_all(cls) -> list["Discount"]:
        return Discount.query.all()

    @classmethod
    def get_by_id(cls, discountId: int) -> "Discount | None":
        return Discount.query.get(discountId)

    def __init__(
        self,
        name: str,
        discount: float,
        discountId=None,
        startDate: Optional[datetime] = None,
        endDate: Optional[datetime] = None,
        isActive: bool = True,
    ):
        if discountId is not None:
            self.discountId = discountId
        self.name = name
        self.discount = discount
        self.startDate = startDate if startDate else datetime_now
        self.endDate = endDate
        self.isActive = isActive

class Subscription(db.Model):
    __tablename__ = "Subscriptions"
    subscriptionId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.Integer, db.ForeignKey("Users.userId"), nullable=False)
    listingId = db.Column(
        db.Integer, db.ForeignKey("Listings.listingId"), nullable=False
    )
    startDate = db.Column(db.DateTime, nullable=False, default=lambda: datetime_now)
    endDate = db.Column(db.DateTime)
    isActive = db.Column(db.Boolean, default=True)

    @classmethod
    def get_all(cls) -> list["Subscription"]:
        return Subscription.query.all()

    @classmethod
    def get_by_id(cls, subscriptionId: int) -> "Subscription | None":
        return Subscription.query.get(subscriptionId)

    @classmethod
    def get_by_user_id(cls, userId: int) -> list["Subscription"]:
        return Subscription.query.filter_by(userId=userId).all()

    @classmethod
    def get_by_listing_id(cls, listingId: int) -> list["Subscription"]:
        return Subscription.query.filter_by(listingId=listingId).all()

    @classmethod
    def get_active_by_user_id(cls, userId: int) -> "Subscription | None":
        return Subscription.query.filter_by(userId=userId, isActive=True).first()

    @classmethod
    def get_active_by_listing_id(cls, listingId: int) -> list["Subscription"]:
        return Subscription.query.filter_by(listingId=listingId, isActive=True).all()

    def to_dict(self) -> dict[str, Any]:
        return {
            "subscriptionId": self.subscriptionId,
            "userId": self.userId,
            "listingId": self.listingId,
            "startDate": self.startDate.isoformat() if self.startDate else None,
            "endDate": self.endDate.isoformat() if self.endDate else None,
            "isActive": self.isActive,
        }

    def __init__(
        self,
        userId: int,
        listingId: int,
        startDate: Optional[datetime] = None,
        endDate: Optional[datetime] = None,
        isActive: bool = True,
    ):
        self.userId = userId
        self.listingId = listingId
        self.startDate = startDate if startDate else datetime_now
        self.endDate = endDate
        self.isActive = isActive


# class Price(db.Model):
#     __tablename__ = "Prices"
#     priceId = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     gameId = db.Column(db.Integer, db.ForeignKey("Games.gameId"), nullable=False)
#     durationDays = db.Column(db.Integer, nullable=False)  # Subscription length in days
#     price = db.Column(db.Float, nullable=False)  # Price in euros or other currency

#     @classmethod
#     def get_by_game_id(cls, gameId: int) -> list["Price"]:
#         return Price.query.filter_by(gameId=gameId).all()

#     def to_dict(self) -> dict[str, Any]:
#         return {
#             "priceId": self.f,
#             "gameId": self.gameId,
#             "durationDays": self.durationDays,
#             "price": self.price,
#         }

#     def __init__(self, gameId: int, durationDays: int, price: float):
#         self.gameId = gameId
#         self.durationDays = durationDays
#         self.price = price


class RoleListing(db.Model):
    __tablename__ = "RoleListings"
    roleId = db.Column(db.Integer, db.ForeignKey("Roles.roleId"), primary_key=True)
    listingId = db.Column(
        db.Integer, db.ForeignKey("Listings.listingId"), primary_key=True
    )

    @classmethod
    def get_by_role_id(cls, roleId: int) -> list["RoleListing"]:
        return RoleListing.query.filter_by(roleId=roleId).all()

    @classmethod
    def get_by_listing_id(cls, listingId: int) -> list["RoleListing"]:
        return RoleListing.query.filter_by(listingId=listingId).all()

    def to_dict(self) -> dict[str, Any]:
        return {"roleId": self.roleId, "listingId": self.listingId}

    def __init__(self, roleId: int, listingId: int):
        self.roleId = roleId
        self.listingId = listingId

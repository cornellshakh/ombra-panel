from enum import Enum
from loguru import logger
import logging, sys
from flask import has_request_context, request

def setup_loguru():
    logger.remove() # Remove default handler provided by Loguru
    logger.add(
        sys.stdout, 
        colorize=True, 
        format="<green>{time:DD-MM-YYYY HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    )
    logger.add(
        "./logs/info.log",
        rotation="10 MB",
        format="{time:DD-MM-YYYY HH:mm:ss} | {level: <8} | {name}:{line} - {message}",
        level="INFO"
    )
    logger.add(
        "./logs/error.log",
        rotation="10 MB",
        format="{time:DD-MM-YYYY HH:mm:ss} | {level: <8} | {name}:{line} - {message}",
        level="ERROR"
    )
    logger.add(
        "./logs/warning.log",
        rotation="10 MB",
        format="{time:DD-MM-YYYY HH:mm:ss} | {level: <8} | {name}:{line} - {message}",
        level="WARNING"
    )


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        level: str | int
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


class LogLevel(Enum):
    INFO = "INFO"
    ERROR = "ERROR"
    WARNING = "WARNING"
    DEBUG = "DEBUG"


def log(message: str, level: LogLevel):
    if has_request_context():
        endpoint_info = f"{request.method} {request.path}"
        message = f"{endpoint_info} - {message}"
    getattr(logger.opt(depth=2), level.name.lower())(message)


def log_info(message: str):
    log(message, LogLevel.INFO)


def log_error(message: str):
    log(message, LogLevel.ERROR)


def log_warning(message: str):
    log(message, LogLevel.WARNING)


def log_debug(message: str):
    log(message, LogLevel.DEBUG)

from threading import Thread
from backend import create_app
from api import Server

app = create_app()

def run_websocket_server():
    ws_server = Server("whitelist.txt", "blacklist.txt", app)
    ws_server.start(3387)


def run_flask_app():
    app.logger.disabled = True
    app.run(port=5000, debug=True)
    

if __name__ == "__main__":
    #Thread(target=run_websocket_server).start()
    run_flask_app()

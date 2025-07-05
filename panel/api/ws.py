from .ip_filter import IPFilterList
from .packets import PacketProcessor
from backend.database.models import db, Session as db_Session
from backend.utils.logging import log_error, log_info, log_warning
import socket, threading

MAX_TIMESTAMP_TOLERANCE_MS = 1000
WHITELIST_MODE_ONLY = False
DEBUG_MODE = False

class Session:
    def __init__(self, id=0, is_logged_in=False, handshake_completed=False, encryption_key=None, client_ip=""):
        self.id = id
        self.is_logged_in = is_logged_in
        self.handshake_completed = handshake_completed
        self.encryption_key = [0] * 32 if encryption_key is None else encryption_key
        self.client_ip = client_ip

class Server:
    def __init__(self, whitelist_file, blacklist_file, app) -> None:
        self.app = app  # Store the Flask app instance
        self.server_socket = None
        self.sessions = {}
        self.ip_filter_list = IPFilterList(whitelist_file, blacklist_file)  # Initialize IP filtering
        self.packet_processor = PacketProcessor(self)  # Initialize packet processing
        
        log_info(f"Server initialized with whitelist '{whitelist_file}' and blacklist '{blacklist_file}'")

    def start(self, port) -> None:
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind(("", port))
        self.server_socket.listen()
        log_info(f"Listening on port {port}")

        while True:
            client_socket, addr = self.server_socket.accept()
            client_ip = addr[0]
            
            # Check IP filter
            if WHITELIST_MODE_ONLY and not self.ip_filter_list.is_whitelisted(client_ip):
                log_warning(f"Connection from non-whitelisted IP: {client_ip}")
                client_socket.close()
                continue
            if self.ip_filter_list.is_blacklisted(client_ip):
                log_warning(f"Connection from blacklisted IP: {client_ip}")
                client_socket.close()
                continue
            else:
                log_info(f"Client Connected from IP {client_ip}")


            client_thread = threading.Thread(target=self.handle_client, args=(client_socket,))
            client_thread.start()

    def receive_all(self, client_socket, buffer_size) -> bytearray | None:
        buffer = bytearray()
        while len(buffer) < buffer_size:
            data = client_socket.recv(buffer_size - len(buffer))
            if not data:
                return None
            buffer.extend(data)
        return buffer
    
    def log_session_creation(self, session_id, client_ip):
        with self.app.app_context():
            new_log = db_Session(userId=0, status="active", gameId=1) # 0 for now as an example, later will use real user id
            db.session.add(new_log)
            db.session.commit()

    def handle_client(self, client_socket) -> None:
        session = self.get_or_create_session(client_socket)
        if session is None:
            return

        while True:
            data = self.receive_all(client_socket, 1024)  # Adjust buffer size as needed
            if not data:
                break

            self.packet_processor.process_packet(client_socket, data)

        log_info(f"Client with IP {session.client_ip} disconnected")
        with self.app.app_context():
            changed_log = db_Session.get_by_id(session.id)
            if not changed_log:
                log_error(f"Session with ID {session.id} not found")
                return
                
            changed_log.status = "Inactive"
            db.session.commit()
        self.cleanup_socket(client_socket)

    def get_or_create_session(self, client_socket) -> Session | None:
        client_ip = client_socket.getpeername()[0]
        session_created = False
        if client_socket not in self.sessions:
            session = Session(id=len(self.sessions) + 1, client_ip=client_ip)
            self.sessions[client_socket] = session
            session_created = True
        
        if session_created:
            self.log_session_creation(session.id, client_ip)
            log_info(f"Session created for IP {client_ip}")
        
        return self.sessions[client_socket]

    def cleanup_socket(self, client_socket):
        del self.sessions[client_socket]
        client_socket.close()

import socket, struct, time
from enum import IntEnum, unique

@unique
class PacketType(IntEnum):
    kHandshake = 1
    kLoginRequest = 2
    kFetchModule = 3

class Client:
    def __init__(self):
        self.client_socket = None

    def connect_to_server(self, ip, port):
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            self.client_socket.connect((ip, port))
            print("Connected to server")
            return True
        except Exception as e:
            print(f"Failed to connect to server: {e}")
            return False

    def send_packet(self, packet_type, payload):
        # Simplified packet structure: [type][payload_size][payload]
        payload_size = len(payload)
        packet_header = struct.pack("II", packet_type, payload_size)
        packet = packet_header + payload.encode("utf-8")
        
        try:
            self.client_socket.sendall(packet)
            print(f"Sent {PacketType(packet_type).name} packet")
            return True
        except Exception as e:
            print(f"Failed to send packet: {e}")
            return False

    def close_connection(self):
        if self.client_socket:
            self.client_socket.close()
            print("Connection closed")

if __name__ == "__main__":
    client = Client()
    if client.connect_to_server("127.0.0.1", 3387):
        # Simulate handshake (this would be where you"d add your encryption Key exchange)
        if client.send_packet(PacketType.kHandshake, "handshake_data"):
            print("Handshake request sent successfully")

        # Sending a login request
        if client.send_packet(PacketType.kLoginRequest, "Username:Password"):
            print("Login request sent successfully")

        # Sending a fetch module request
        if client.send_packet(PacketType.kFetchModule, "module_id"):
            print("Fetch module request sent successfully")

        client.close_connection()
    else:
        print("Failed to connect to the server")

from .invite import read_invite_codes
from .. import crypto as c
import re
from .logging import log_error

male_names = [
    "James", "John", "Robert", "Michael", "William", "David", "Joseph", "Daniel", "Thomas", "Charles",
    "Christopher", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua",
    "George", "Kevin", "Brian", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Gary",
    "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Frank", "Jonathan", "Scott", "Justin", "Brandon",
    "Raymond", "Gregory", "Benjamin", "Samuel", "Patrick", "Alexander", "Jack", "Dennis", "Jerry", "Tyler",
    "Aaron", "Jose", "Henry", "Adam", "Arthur", "Carl", "Nathan", "Albert", "Lawrence", "Sean",
    "Christian", "Ethan", "Austin", "Joe", "Willie", "Jordan", "Bryan", "Billy", "Bruce", "Ralph",
    "Roy", "Noah", "Dylan", "Eugene", "Wayne", "Alan", "Juan", "Louis", "Russell", "Gabriel",
    "Dylan", "Louis", "Alan", "Juan", "Gabriel", "Randy", "Philip", "Harry", "Vincent", "Bobby",
    "Johnny", "Phillip", "Jimmy", "Harold", "Karl", "Gerald", "Todd", "Terry", "Glenn", "Jesse",
    "Hector", "Shawn", "Craig", "Clarence", "Sam", "Luis", "Nathaniel", "Chris", "Lee", "Antonio",
    "Travis", "Paul", "Allen", "Jack", "Frederick", "Peter", "Blake", "Willard", "Jerome", "Lance",
    "Ray", "Curtis", "Melvin", "Derek", "Stanley", "Alfred", "Vernon", "Jared", "Cameron", "Maurice",
    "Andre", "Perry", "Casey", "Darryl", "Nelson", "Alvin", "Angelo", "Fernando", "Leroy", "Cory",
    "Clinton", "Clyde", "Leon", "Tim", "Gilbert", "Eddie", "Darren", "Theodore", "Wesley", "Gordon",
    "Alvin", "Ivan", "Sidney", "Floyd", "Nelson", "Guy", "Lester", "Glen", "Jimmie", "Orlando",
    "Ross", "Clifford", "Freddie", "Ruben", "Terrance", "Mickey", "Ricardo", "Rudy", "Stanley", "Wade",
    "Garry", "Mitchell", "Kurt", "Marcus", "Leonard", "Rene", "Willis", "Gilbert", "Milton", "Dwight",
    "Bradley", "Jose", "Grant", "Horace", "Neil", "Ted", "Roland", "Rex", "Curt", "Galen",
    "Arnold", "Willis", "Pedro", "Julio", "Lonnie", "Donnie", "Gerald", "Byron", "Homer", "Dane",
    "Wade", "Nolan", "Doug", "Hubert", "Loyd", "Yves", "Gale", "Coy", "Junior", "Jan",
    "Jessie", "Wilfred", "Boyd", "Claude", "Shelby", "Pat", "Charlie", "Robin", "Wiley", "Denny",
    "Rick", "Reed", "Jeremiah", "Jerald", "Adrian", "Lyle", "Ronnie", "Herbert", "Terrance", "Ben",
    "Rodney", "Roger", "Alberto", "Ira", "Randal", "Scot", "Harvey", "Teddy", "Sherman", "Rick",
    "Hal", "Garland", "Riley", "Clifton", "Buddy", "Elton", "Bryant", "Emil", "Curtis", "Brendan",
    "Ricky", "Desmond", "Lonny", "Jerold", "Delbert", "Ellis", "Gerry", "Orville", "Nickolas", "Zane",
    "Kermit", "Winston", "Rodger", "Alfonso", "Marlon", "Lon", "Dewey", "Mel", "Rocky", "Joesph",
    "Roscoe", "Ernesto", "Darrel", "Gustavo", "Reginald", "Wilbert", "Salvatore", "Ivory", "Bo", "Alton",
    "Dion", "Chance", "Devin", "Elias", "Sonny", "Stan", "Luke", "Rory", "Archie", "Marvin",
    "Leland", "Elliott", "Waylon", "Conrad", "Donny", "Garrett", "Arturo", "Guillermo", "Chad", "Barton",
    "Mitchel", "Toby", "Nicky", "Wilfredo", "Nick", "Rusty", "Art", "Carroll", "Laurence", "Elden",
    "Timmy", "Raleigh", "Bennie", "Lucien", "Jarrod", "Bryon", "Jonas", "Gregorio", "Michel", "Jarvis",
    "Tod", "Jerrold", "Humberto", "Darell", "Brice", "Jackie", "Dewayne", "Sammie", "Stanford", "Bernardo",
    "Abel", "Gus", "Mack", "Lanny", "Junior", "Arnulfo", "Ollie", "Danial", "Tomas", "Efrain",
    "Brady", "Gerardo", "Deon", "Noe", "Terrell", "Ernie", "Dino", "Loy", "Rolland", "Jamal",
    "Allan", "Jame", "Vance", "Wilber", "Ivory", "Gil", "Aubrey", "Hollis", "Chas", "Prince",
    "Benito", "Orlando", "Cyrus", "Coy", "Eddy", "Theron", "Malcolm", "Basil", "Tommy", "Murray",
    "Rod", "Wilmer", "Emery", "Irvin", "Hubbard", "Stefan", "Donn", "Sung", "Joey", "Jerald",
    "Rocco", "Jon", "Quentin", "Demetrius", "Dorian", "Anton", "Harris", "Trent", "Wilburn", "Darrin",
    "Rudolph", "Gale", "Matt", "Sol", "Samual", "Rufus", "Clair", "Hugo", "Gino", "Mason",
    "Joesph", "Dudley", "Thaddeus", "Antione", "Hank", "Herb", "Lenny", "Rolando", "Carmine", "Clement",
    "Titus", "Emilio", "Elvis", "Randal", "Brice", "August", "Leonardo", "Carey", "Antone", "Jc",
    "Eldon", "Darrick", "Lamar", "Darius", "Toby", "Teddy", "Roosevelt", "Al", "Augustine", "Leonardo",
    "Carey", "Antone", "Jc", "Eldon", "Darrick", "Lamar", "Darius", "Toby", "Teddy", "Roosevelt"]

publicKey, privateKey= c.load_keys()
def extract_public_key(input_string : str) -> tuple | bool:
    try:
        start_index = input_string.find("PublicKey(")
    except Exception:
        print(input_string)
        return False
    if start_index != -1:
        start_index += len("PublicKey(")
        end_index = input_string.find(")", start_index)
        if end_index != -1:
            input_string = input_string[start_index-1:end_index+1]
            try:
                numbers = input_string.strip("()").split(",")
                num1 = int(numbers[0])
                num2 = int(numbers[1])
                return (num1, num2)
            except (ValueError, IndexError):
                return False
    return False


def get_payload(payload):
    # Data: unix time stamp, HWID, info ??
    try:
        start_index = payload.find("DATA(")
    except Exception:
        print(payload)
        return False

    if start_index != -1:
        start_index += len("DATA(")
        end_index = payload.find(")", start_index)
        if end_index != -1:
            payload = payload[start_index:end_index]
            return str(payload)
    return False # Return False if the substring pattern is not found or there was an error ( faulty request )

     
def check_hwid(data : str) -> bool:
    hwids = ["12953453", "0x64ftntdqvntrpoa", "499523841"] # tohle potom bude z SQL database 
    for HWID in hwids:
        print(f"checking if HWID {HWID} is in string {data}")
        if HWID in data:
            return True
    return False


def heartbeat_auth(data) -> str | tuple | bytes:
    iter = False
    print(f"received data: {data}")
    stringa = c.decrypt(data, privateKey)
    payload = get_payload(str(stringa))
    print(payload)
    
    if not payload:
        return "Bad request.", 201
    
    codes = read_invite_codes("./logs/invite_codes.txt")
    
    for code in codes:
        if code in payload:
            iter = True
            
    if not iter:
        return "User not found.", 201

    print(stringa)
    response = "Success"
    enc_data = c.encrypt(response,publicKey)
    return enc_data


def parse_all_logs() -> list[dict] | str:
    logs = []
    for log_type in ["info", "error", "warning"]:
        log_entries = parse_log_file(log_type)
        if not log_entries:
            return []
        logs.extend(log_entries)
    return logs


def parse_log_file(log_type: str) -> list[dict] | str:
    file_lines = read_log_file(log_type)
    if not file_lines:
        log_error(f"No content in log file {log_type} or file does not exist.")
        return []

    log_entries = []
    log_pattern = r"(?P<createdAt>\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}) \| (?P<level>[A-Z]+)\s+\| (?P<functionName>[^.]+(?:\.[^\s:]+)*):(?P<lineNumber>\d+) - (?P<method>[A-Z]+) (?P<endpoint>[^\s-]+) - (?P<message>.+)"
    for line in file_lines:
        match = re.match(log_pattern, line.strip())
        if match:
            log_entries.append(match.groupdict())

    if not log_entries:
        log_error(f"File read but no logs matched the expected format in {log_type}.")
        return []

    return log_entries


def read_log_file(log_type: str) -> list[str]: 
    try:
        with open(f"./logs/{log_type}.log", "r") as file:
            lines = file.readlines()
        if not lines:
            print(f"Log file {log_type} is empty.")
        return lines
    except FileNotFoundError:
        print(f"Log file {log_type} not found.")
        log_error(f"Log file {log_type} not found.")
        return []


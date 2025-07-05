#how does the invite system work?
#invite codes are generated randomly, and stored in the database
#users will be given invite codes, only then can you register
#protoype via .txt file
#generate random string, used for invite codes

import random, string

def generate_invite_code() -> str: # length will most likely be set
    return random_string(35)


def get_random_invite_code(invite_codes) -> str | None:
    if not invite_codes:
        print("No invite codes found.")
        return None
    return random.choice(invite_codes)


def read_invite_codes(file_path) -> list[str]:
    invite_codes = []
    try:
        with open(file_path, "r") as file:
            for line in file:
                invite_codes.append(line.strip())
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    return (invite_codes)


def random_string(prefix, n=8) -> str:
    return (str(prefix) + "".join(random.SystemRandom().choice(string.ascii_letters) for _ in range(n)))


def response_random_string(n=64) -> str:
    return ("".join(random.SystemRandom().choice(string.ascii_lowercase) for _ in range(n)))


def save_invite_code(code) -> None:
    with open("panel/logs/invite_codes.txt", "a") as f:
        print("saving invite code")
        f.write(code + "\n")


def read_invite_code(code) -> bool:
    with open("panel/logs/invite_codes.txt", "r+") as f:
        print("reading invite code")
        file = f.read()
        if code in file:
            print("invite code found")
            return True
        else:
            print("invite code not found")
            return False


def read_invite_file() -> list[str]:
    with open("panel/logs/invite_codes.txt", "r+") as f:
        return f.readlines()

   
def remove_invite_code(code):
    with open("panel/logs/invite_codes.txt", "r+") as f:
        print("removing invite code")
        file = f.read()
        if code in file:
            print("invite code found")
            file = file.replace(code + "\n", "")
            f.seek(0)
            f.write(file)
            f.truncate()
            return True
        else:
            print("invite code not found")
            return False

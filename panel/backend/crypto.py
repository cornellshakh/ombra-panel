import rsa

def memory_generate_keys():
    (publicKey, privateKey) = rsa.newkeys(1024)
    print("KEY:", publicKey.save_pkcs1("DER"))
    return (publicKey, privateKey)
    

def file_generate_keys(): # will not be needed in the final version, keys will be created beforehand
    (publicKey, privateKey) = rsa.newkeys(4096)
    with open("backend/keys/publicKey.pem", "wb") as p:
        p.write(publicKey.save_pkcs1("PEM"))
    with open("backend/keys/privateKey.pem", "wb") as p:
        p.write(privateKey.save_pkcs1("PEM"))


def load_keys():
    with open("backend/keys/publicKey.pem", "rb") as p:
        publicKey = rsa.PublicKey.load_pkcs1(p.read())
    with open("backend/keys/privateKey.pem", "rb") as p:
        privateKey = rsa.PrivateKey.load_pkcs1(p.read())
    return publicKey, privateKey


def encrypt(message, Key):
    return rsa.encrypt(message.encode("ascii"), Key)


def decrypt(ciphertext, Key):
    try:
        return rsa.decrypt(ciphertext, Key).decode("ascii")
    except:
        return False


def sign(message, Key):
    return rsa.sign(message.encode("ascii"), Key, "SHA-256")


def verify(message, signature, Key):
    try:
        return rsa.verify(message.encode("ascii"), signature, Key,) == "SHA-256"
    except:
        return False

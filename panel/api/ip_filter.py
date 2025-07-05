class IPFilterList:
    def __init__(self, whitelist_file, blacklist_file):
        self.whitelist_file = whitelist_file
        self.blacklist_file = blacklist_file
        self.whitelist = set()
        self.blacklist = set()
        self.refresh_lists()

    def refresh_lists(self):
        self.whitelist = self.load_list(self.whitelist_file)
        self.blacklist = self.load_list(self.blacklist_file)

    @staticmethod
    def load_list(file_path):
        try:
            with open(file_path, "r") as file:
                return {line.strip() for line in file if line.strip()}
        except FileNotFoundError:
            return set()

    def is_whitelisted(self, ip_address):
        return ip_address in self.whitelist

    def is_blacklisted(self, ip_address):
        return ip_address in self.blacklist

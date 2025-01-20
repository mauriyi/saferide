import json

class ConfigManager:
    def __init__(self, config_file='config/config.json'):
        self.config_file = config_file

    def load_config(self):
        with open(self.config_file, 'r') as file:
            return json.load(file)

    def get_wifi_config(self):
        config = self.load_config()
        return config['wifi']['ssid'], config['wifi']['password']
    
    def get_telegram_config(self):
        config = self.load_config()
        return config['telegram']['token']

    def get_mqtt_config(self):
        config = self.load_config()
        return config['mqtt']['broker'], config['mqtt']['client'], config['mqtt']['port'], config['mqtt']['topic']

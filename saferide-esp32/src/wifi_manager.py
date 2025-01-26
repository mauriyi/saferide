import network
import time
from src.config_manager import ConfigManager

class WiFiManager:
    def __init__(self):
        # Cargar configuración WiFi desde el archivo JSON
        config_manager = ConfigManager()
        self.ssid, self.password = config_manager.get_wifi_config()

    def connect(self, timeout=10):
        """
        Intenta conectar a la red WiFi especificada.

        :param timeout: Tiempo máximo (en segundos) para intentar conectarse.
        :return: True si la conexión es exitosa, False si falla.
        """
        # Crea una instancia de la interfaz WiFi en modo estación
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)  # Activa la interfaz WiFi
        wlan.connect(self.ssid, self.password)  # Intenta conectarse usando las credenciales
        print(f"Conectando a WiFi: {self.ssid}...")

        # Esperar hasta que el dispositivo se conecte o se agote el tiempo
        start_time = time.time()
        while not wlan.isconnected():
            if time.time() - start_time > timeout:
                print("Error: No se pudo conectar al WiFi dentro del tiempo límite.")
                return False
            time.sleep(1)

        # Una vez conectado, imprime la configuración de la red
        print("Conexión exitosa. Configuración de red:", wlan.ifconfig())
        return True

from machine import SoftI2C, Pin  # Módulo para manejar comunicación SoftI2C y pines
from lib.vl53l0x import VL53L0X  # Biblioteca para manejar el sensor VL53L0X

# Clase para manejar el sensor de distancia VL53L0X
class DistanceSensor:
    def __init__(self, scl_pin=22, sda_pin=21):
        """
        Inicializa el sensor VL53L0X utilizando los pines I2C conectados
        
        """
        # Configura la comunicación I2C con los pines especificados
        self.i2c = SoftI2C(scl=Pin(scl_pin), sda=Pin(sda_pin))
        # Inicializa el sensor VL53L0X utilizando la interfaz I2C
        self.sensor = VL53L0X(self.i2c)

    def get_distance(self):
        """
        Obtiene la distancia medida por el sensor en centímetros.

        :return: Distancia medida en cm o None en caso de error.
        """
        try:
            # Lee la distancia en mm y la convierte a cm
            distance = self.sensor.read() / 10
            return distance
        except Exception as e:
            # Maneja errores durante la lectura y los imprime
            print(f"Error al leer la distancia: {e}")
            return None

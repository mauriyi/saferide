import time
import ujson
from umqtt.simple import MQTTClient
from src.config_manager import ConfigManager
from src.battery_sensor import BatterySensor
from src.distance_sensor import DistanceSensor

class MQTTHandler:
    def __init__(self, sensor_data=None):
        """
        Inicializa el cliente MQTT y los sensores.
        
        Args:
            data_callback (function): Callback para enviar datos de los sensores al programa principal.
            sensor_data (dict): Diccionario para almacenar los datos de los sensores.
        """
        try:
            # Cargar configuración MQTT desde el archivo JSON
            config_manager = ConfigManager()
            self.broker, self.client_id, self.port, self.topic = config_manager.get_mqtt_config()

            # Configuración del cliente MQTT
            self.client = MQTTClient(self.client_id, self.broker, port=self.port)
            self.client.connect()
            print(f"Conectado al broker MQTT: {self.broker}:{self.port}")

            # Inicializar los sensores
            self.battery_sensor = BatterySensor(pin=34)
            self.distance_sensor = DistanceSensor(scl_pin=22, sda_pin=21)
            
            # Almacenar la referencia al objeto SensorData
            if sensor_data is None:
                self.sensor_data = {'battery': None, 'distance': None}  # Inicializa con valores nulos
            else:
                self.sensor_data = sensor_data
              
        except Exception as e:
            print(f"Error durante la inicialización de MQTTHandler: {e}")
            raise

    def leer_sensores(self):
        """
        Obtiene los datos de los sensores: batería y distancia.
        
        Retorna:
            dict: Un diccionario con los datos de batería y distancia.
        """
        try:
            battery_status = self.battery_sensor.get_battery_status()
            distance = self.distance_sensor.get_distance()
            return {
                'battery': battery_status['current'] if battery_status else None,
                'distance': distance
            }
        except Exception as e:
            print(f"Error al leer datos de los sensores: {e}")
            return {'battery': None, 'distance': None}

    def publish_sensor_data(self):
        """
        Lee los sensores, envía los datos al broker MQTT y llama al callback si está configurado.
        """
        try:
            # Leer datos de los sensores
            sensor_data = self.leer_sensores()
            
            # Actualizar los datos en el diccionario de self.sensor_data
            self.sensor_data.update(sensor_data['battery'], sensor_data['distance'])

            # Publicar datos en MQTT
            payload = ujson.dumps(sensor_data)  # Asegúrate de que el payload sea un string JSON
            self.client.publish(self.topic, payload)  # Pasa el topic y el payload correctamente

            print(f"Publicando en el topic {self.topic}")
            print("Datos enviados por MQTT:", sensor_data)
            
        except Exception as e:
            print(f"Error al publicar datos por MQTT: {e}")

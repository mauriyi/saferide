import time
import _thread
import uasyncio as asyncio
from src.wifi_manager import WiFiManager
from src.mqtt_handler import MQTTHandler
from src.telegram_bot import TelegramBotHandler
from src.sensor_data import SensorData  # Importa la clase SensorData

# Función principal de ejecución
async def main():  
    # Configuración WiFi
    wifi = WiFiManager()
    if not wifi.connect():
        print("No se pudo conectar al WiFi. Reiniciando...")
        return
    
    # Crear un objeto compartido de datos
    shared_sensor_data = SensorData()
    
    # Instanciar los manejadores con el objeto compartido
    mqtt_handler = MQTTHandler(sensor_data=shared_sensor_data)
    telegram_bot_handler = TelegramBotHandler(sensor_data=shared_sensor_data)

    # Tarea para ejecutar el bot de Telegram
    async def run_telegram():
        try:
            print("Iniciando el bot de Telegram...")
            await telegram_bot_handler.run()
        except Exception as e:
            print(f"Error en el bot de Telegram: {e}")

    # Tarea para manejar MQTT y publicar datos cada 60 segundos
    async def run_mqtt():
        print("Iniciando el bucle de MQTT...")
        while True:
            try:
                mqtt_handler.publish_sensor_data()
                await asyncio.sleep(60)  # Espera 60 segundos antes de publicar de nuevo
            except Exception as e:
                print(f"Error en el manejo de MQTT: {e}")

    # Ejecutar las tareas en paralelo
    await asyncio.gather(run_telegram(), run_mqtt())

# Ejecutar el ciclo de eventos principal
if __name__ == "__main__":
    try:
        asyncio.run(main())  # Iniciar el bucle de eventos asíncrono
    except Exception as e:
        print(f"Error en el ciclo principal: {e}")


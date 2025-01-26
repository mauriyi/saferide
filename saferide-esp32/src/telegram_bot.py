from lib.utelegram import TelegramBot  # Importa la biblioteca del bot de Telegram
from src.config_manager import ConfigManager
import uasyncio as asyncio

class TelegramBotHandler:
    def __init__(self, sensor_data):
        self.sensor_data = sensor_data
        
        # Cargar configuración de Telegram desde el archivo JSON
        config_manager = ConfigManager()
        self.token = config_manager.get_telegram_config()  # Obtiene el token del bot de Telegram
        
        # Inicializa el bot con el token y el callback para manejar mensajes
        self.bot = TelegramBot(self.token, self.message_callback)

    def get_battery_status(self):
        """Obtiene el estado de la batería desde el contenedor de datos"""
        return self.sensor_data.get()['battery']

    def get_distance(self):
        """Obtiene la distancia desde el contenedor de datos"""
        return self.sensor_data.get()['distance']

    def message_callback(self, bot, msg_type, chat_name, sender_name, chat_id, text, entry):
        """
        Callback para manejar mensajes entrantes del bot.
        """
        print(f"Nuevo mensaje de {sender_name}: {text}")
        text = text.replace("/", "")  # Elimina todas las ocurrencias de "/"
        text = text.lower()  # Convierte el texto del mensaje a minúsculas

        # Lógica de respuesta según el contenido del mensaje
        if text == "inicio":
            """Muestra el menú de opciones al usuario."""
            menu = """\nMenú de opciones:
            1. Estado de la batería: /bateria
            2. Estado de los frenos: /freno
            """
            bot.send(chat_id, menu)
        elif text == "bateria":
            """Obtiene y muestra el estado de la batería."""
            try:
                battery = self.get_battery_status()  # Llamada al método para obtener la batería
                if battery is not None:
                    bot.send(chat_id, f"Corriente medida: {battery:.2f} A")
                else:
                    bot.send(chat_id, "Error: No se pudo obtener la corriente de la batería.")
            except Exception as e:
                bot.send(chat_id, f"Error: {e}")
        elif text == "freno":
            """Obtiene y muestra la distancia medida."""
            try:
                distance = self.get_distance()  # Llamada al método para obtener la distancia
                if distance is not None:
                    bot.send(chat_id, f"Distancia medida: {distance:.2f} cm")
                else:
                    bot.send(chat_id, "Error: No se pudo obtener el desgaste del freno.")
            except Exception as e:
                bot.send(chat_id, f"Error: {e}")        
        else:
            bot.send(chat_id, f"No entendí tu mensaje: {text}. Usa '/inicio' para ver más opciones.")

    async def run(self):
        """
        Ejecuta el bot en un bucle asíncrono.
        """
        try:
            asyncio.create_task(self.bot.run())
            loop = asyncio.get_event_loop()
            loop.run_forever()
        except Exception as e:
            print(f"Error en el bot: {e}")
        finally:
            self.bot.stop()

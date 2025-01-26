from lib.acs712 import ACS712  # Asegúrate de tener la librería ACS712 importada correctamente

class BatterySensor:
    def __init__(self, pin=34):
        """Inicializa el sensor ACS712 en el pin especificado."""    
        # Crea y asigna la instancia del sensor a `self.sensor`
        self.sensor = ACS712(pin=34)

        # Calibra el sensor
        print("Calibrando el sensor...")
        self.sensor.calibrate()  # Realiza la calibración inicial
            
    def get_current(self):
        """Obtiene la corriente medida por el sensor ACS712 en amperios."""
        try:
            # Obtiene la corriente alterna con una frecuencia de 50 Hz
            current = self.sensor.getCurrentAC(freq=50)
            return current
        except Exception as e:
            print(f"Error al leer la corriente: {e}")
            return None

    def get_battery_status(self):
        """Obtiene el estado de la batería (solo corriente)."""
        current = self.get_current()

        if current is not None:
            return {
                'current': current
            }
        else:
            return None

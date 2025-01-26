# Clase para contener los datos de los sensores
class SensorData:
    def __init__(self):
        self.battery = None
        self.distance = None

    def update(self, battery, distance):
        self.battery = battery
        self.distance = distance

    def get(self):
        return {'battery': self.battery, 'distance': self.distance}
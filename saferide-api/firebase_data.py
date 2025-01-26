
import firebase_admin
from firebase_admin import credentials, db, auth
from fastapi import Depends, HTTPException
from datetime import datetime

# Inicializa la aplicación de Firebase si no está ya inicializada
cred = credentials.Certificate("firebase-credentials.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://saferide-firebase-default-rtdb.firebaseio.com/'
    })

class FirebaseData:
    def __init__(self):
        self.ref = db.reference('/data')  # Ruta a tu base de datos en Firebase

    def get_last_record(self):
        """
        Obtiene el último registro de la base de datos.
        """
        records = self.ref.order_by_child('date').limit_to_last(1).get()
        if records:
            # Si hay registros, devuelve el último
            return records
        return None

    def get_records_since(self, since: datetime):
        """
        Obtiene los registros desde una fecha específica.
        """
        try:
            # Convierte 'since' a formato timestamp para compararlo en la base de datos
            since_timestamp = int(since.timestamp())
            
            # Realiza una consulta que devuelva los registros desde el timestamp proporcionado
            records_ref = self.ref.order_by_child('date').start_at(since_timestamp)
            results = records_ref.get()
            
            if results:
                return results
            else:
                return []
        except Exception as e:
            print(f"Error obteniendo registros: {e}")
            return None
        
    def get_all_records(self):
        """
        Obtiene todos los registros de la base de datos.
        """
        try:
            records = self.ref.get()  # Obtiene todos los registros en la ruta especificada
            if records:
                return records
            else:
                return []
        except Exception as e:
            print(f"Error obteniendo todos los registros: {e}")
            return None
        
  
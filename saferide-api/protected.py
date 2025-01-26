from fastapi import APIRouter, HTTPException, Header, Depends
from firebase_admin import auth
from firebase_data import FirebaseData
from datetime import datetime, timedelta

def validate_token(authorization: str = Header(None)):
    """
    Valida el token proporcionado en el encabezado Authorization.
    Devuelve el UID del usuario si el token es válido.
    """
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado o formato incorrecto")

    token = authorization.split(" ")[1]

    try:
        # Verifica el token con Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Token inválido: UID no encontrado")
        return uid

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="El token ha expirado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
    
# Función para determinar el estado de la batería
def estado_bateria(battery_value):
    try:
        if battery_value >= 0.85:
            return "Batería Nueva"
        elif battery_value >= 0.60:
            return "Batería en Buen Estado"
        elif battery_value >= 0.40:
            return "Uso Moderado"
        elif battery_value >= 0.20:
            return "Requiere Cambio Pronto"
        else:
            return "Requiere Cambio"
    except Exception as e:
        raise ValueError(f"Error al calcular el estado de la batería: {str(e)}")

# Función para determinar el estado de la pastilla de freno
def estado_pastilla_freno(grosor_actual):
    try:
        # Definir los umbrales de grosor
        grosor_fabrica = 7  # mm
        grosor_minimo = 2    # mm

        # Evaluar el estado de la pastilla
        if grosor_actual >= grosor_fabrica * 0.85:  # Más del 85% del grosor original
            return "Nueva"
        elif grosor_actual >= grosor_fabrica * 0.70:  # Entre 70% y 85% del grosor original
            return "En Buen Estado"
        elif grosor_actual >= grosor_minimo + 1:  # Entre 1 y 2 mm por encima del mínimo
            return "Uso Moderado"
        elif grosor_actual >= grosor_minimo:  # En el límite mínimo
            return "Requiere Cambio Pronto"
        else:
            return "Requiere Cambio"
    except Exception as e:
        raise ValueError(f"Error al calcular el estado de la pastilla de freno: {str(e)}")

protected_router = APIRouter()

@protected_router.get("/last-record")
def get_last_record(uid: str = Depends(validate_token)):
    """
    Obtiene el último registro de Firebase.
    Ruta protegida por token JWT.
    """
    try:
        firebase_data = FirebaseData()
        last_record = firebase_data.get_last_record()
                
        if last_record:
            last_record_data = next(iter(last_record.values()))  # Esto obtiene el primer (y único) valor
            # Construir un nuevo JSON con los datos originales y los estados calculados
            response = {
                "id": '1',
                "battery": last_record_data["battery"],
                "date": last_record_data["date"],
                "distance": last_record_data["distance"],
                "battery_status": estado_bateria(last_record_data['battery']),
                "battery_percentage": last_record_data['battery'] * 100,
                "brake_status": estado_pastilla_freno(last_record_data['distance'])
            }
            return response
        else:
            raise HTTPException(status_code=404, detail="No se encontraron registros")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el último registro")

@protected_router.get("/last-24-hours")
def get_last_24_hours(uid: str = Depends(validate_token)):
    """
    Obtiene los registros de las últimas 24 horas desde Firebase.
    Ruta protegida por token JWT.
    """
    try:
        since = datetime.now() - timedelta(hours=24)

        # Llama al método de FirebaseData para obtener los registros de las últimas 24 horas
        firebase_data = FirebaseData()
        last_24_hours = firebase_data.get_records_since(since)

        if last_24_hours:
            # Filtrar registros que no tengan valores `None` en ninguno de sus atributos
            filtered_data = [
                {"id": key, **record}
                for key, record in last_24_hours.items()
                if all(value is not None for value in record.values())
            ]
            
            # Verificar si existen registros válidos
            if not filtered_data:
                raise HTTPException(status_code=404, detail="No se encontraron registros válidos en las últimas 24 horas")

            # Construir el nuevo JSON con el estado de batería y frenos
            processed_data = [
                {
                    "id": record['id'],
                    "battery": record['battery'],
                    "date": record['date'],
                    "distance": record['distance'],
                    "battery_status": estado_bateria(record['battery']),
                    "battery_percentage": record['battery'] * 100,  # Asumiendo que 'battery' es un valor entre 0 y 1
                    "brake_status": estado_pastilla_freno(record['distance'])
                }
                for record in filtered_data
            ]

            return processed_data
        else:
            raise HTTPException(status_code=404, detail="No se encontraron registros en las últimas 24 horas")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar los registros de las últimas 24 horas: {str(e)}")

    
@protected_router.get("/all-records")
def get_all_records(uid: str = Depends(validate_token)):
    """
    Obtiene todos los registros de Firebase.
    Filtra los registros que contengan valores `None` en cualquiera de sus atributos,
    y agrega información adicional como el estado de la batería y los frenos.
    """
    try:
        firebase_data = FirebaseData()
        all_records = firebase_data.get_all_records()

        if not all_records:
            raise HTTPException(status_code=404, detail="No se encontraron registros")

        # Filtrar registros que no tengan valores `None` en ningún atributo
        filtered_data = [
            {"id": key, **record}
            for key, record in all_records.items()
            if all(value is not None for value in record.values())
        ]

        if not filtered_data:
            raise HTTPException(status_code=404, detail="No se encontraron registros válidos")

        # Construir el nuevo JSON con el estado de batería y frenos
        processed_data = [
            {
                "id": record['id'],
                "battery": record['battery'],
                "date": record['date'],
                "distance": record['distance'],
                "battery_status": estado_bateria(record['battery']),
                "battery_percentage": record['battery'] * 100,  # Asumiendo que 'battery' es un valor entre 0 y 1
                "brake_status": estado_pastilla_freno(record['distance'])
            }
            for record in filtered_data
        ]

        return processed_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar los registros: {str(e)}")

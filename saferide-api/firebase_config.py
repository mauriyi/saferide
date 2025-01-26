import firebase_admin
from firebase_admin import credentials, firestore

# Ruta a tu archivo de credenciales de Firebase
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)

# Inicializa Firestore
db = firestore.client()

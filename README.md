# SafeRide 🚀  

SafeRide es un sistema integral diseñado para monitorear el estado de componentes críticos de una motocicleta en tiempo real. Este repositorio contiene tres proyectos interconectados que permiten capturar, procesar y visualizar datos.

## 📂 Proyectos en el repositorio  

1. **`saferide-api`**  
   API REST desarrollada en Python con Flask, que utiliza JSON Web Tokens (JWT) para autenticación. Se conecta con Firebase para gestionar los datos enviados por los sensores y brinda acceso seguro a la información desde la web.  

2. **`saferide-esp32`**  
   Proyecto en MicroPython para una tarjeta ESP32 que:  
   - Envía datos vía MQTT desde un sensor de distancia y un sensor ACS712 (amperaje).  
   - Incluye conexión a un bot de Telegram para consultar en tiempo real el estado de los sensores.  

3. **`saferide-web`**  
   Una página web desarrollada en Angular 18 que:  
   - Consume datos desde la API.  
   - Muestra información en gráficos y tablas sobre el estado de la batería y los frenos de la motocicleta.  
   - Proporciona una interfaz interactiva y amigable para usuarios finales.  

---

## ⚙️ Set de Pruebas  

### 🌐 Sitio Web  
Accede al sitio web en el siguiente enlace:  
[SafeRide Web](http://ec2-18-222-21-192.us-east-2.compute.amazonaws.com/)  

- **Usuario:** ejemplo@saferide.com.co  
- **Contraseña:** diplomadoAreandina2025*  

### 🔄 Node-RED Virtualizado  
Acceso al entorno Node-RED virtualizado:  
[SafeRide Node-RED](http://ec2-18-222-21-192.us-east-2.compute.amazonaws.com:1880/)  

- **Usuario:** admin  
- **Contraseña:** diplomadoAreandina2025*  

---

## 🚀 Tecnologías utilizadas  

- **Backend:** Python (Flask), Firebase.  
- **IoT:** MicroPython, MQTT, ESP32, ACS712, VL53L0X.  
- **Frontend:** Angular 18.  
- **Virtualización:** Node-RED, EC2 (AWS).  


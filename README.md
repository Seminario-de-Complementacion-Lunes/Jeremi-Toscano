## Projecto CRUD REACT con EXPRESS

## Empezar en el projecto con 
  ```bash
  npm install 
  ```
en el cd backend y en el cd frontend

## Luego Ejectuar
  ```bash
  node server.js
  ```
en el backend para empezar el servidor , ASEGURARSE QUE EL SERVIDOR USE UN PUERTO LIBRE PARA PODER EJECUTARSE , CREAR EL .env y hacer la conexion es su responsabilidad para que funcione el projecto

  ```bash
  npm start
  ```
en el frontend para empezar el servidor de donde se enviara los datos al backend .

  ```bash
  CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  dni VARCHAR(8) NOT NULL UNIQUE,
  foto MEDIUMBLOB NOT NULL
);
  ```
 en la bd de datos generar el siguiente script para empezar a recibir los datos
## :D        que la pases bien 

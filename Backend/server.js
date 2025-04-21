require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: ( file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes PNG, JPEG o JPG'));
        }
    },
});

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust if frontend runs on a different port

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 3308,
};

app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
    console.log('Received request:', {
        body: req.body,
        file: req.file ? { mimetype: req.file.mimetype, size: req.file.size } : null,
    });

    try {
        const nombre = req.body.nombre?.trim() || '';
        const dni = req.body.dni?.trim() || '';
        const foto = req.file?.buffer;

        if (!nombre || !dni || !foto) {
            console.log('Validation failed:', { nombre, dni, foto: !!foto });
            return res.status(400).json({ error: 'Nombre, DNI y foto son requeridos' });
        }

        if (dni.length !== 8) {
            console.log('DNI length validation failed:', dni);
            return res.status(400).json({ error: 'El DNI debe tener exactamente 8 caracteres' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO usuarios (nombre, dni, foto) VALUES (?, ?, ?)',
            [nombre, dni, foto]
        );
        await connection.end();
        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error('Error:', error);
        if (error.code === 'ER_DATA_TOO_LONG') {
            return res.status(400).json({ error: 'El DNI es demasiado largo (máximo 8 caracteres)' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El DNI ya está registrado' });
        }
        if (error.message.includes('Solo se permiten imágenes')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
});

const port = process.env.PORT || 3118;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
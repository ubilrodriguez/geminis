// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const app = express();

// Middleware para procesar JSON
app.use(express.json());
app.use(express.static('public'));

// Configuración de Gemini AI
const GOOGLE_API_KEY = 'AIzaSyB65EzGZYGYiG0HquIz9by67HWbndRK4VI'; // Reemplaza con tu clave API
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para procesar las consultas
app.post('/consulta', async (req, res) => {
    try {
        const { consulta } = req.body;
        const result = await model.generateContent(consulta);
        const response = await result.response;
        const text = response.text();
        res.json({ respuesta: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Problemas en la consulta' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
console.clear();

import express from 'express';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const cresdeentials = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'coningplay.com-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'coningplay.com-crt.pem')),
    ca: fs.readFileSync(path.join(__dirname, 'ssl', 'coningplay.com-chain.pem')),
};

//cors

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://coningplay.com");
    res.setHeader("Access-Control-Allow-Methods", ['GET', 'POST']);
    res.setHeader("Access-Control-Allow-Credentials", 'true');
    next();
});

app.get('/login', (req, res) => {
    console.log("hola desde el frontend");
    res.send('hola desde el backend');
});

const httpsServer = https.createServer(cresdeentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

const io = new Server(httpsServer);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.emit('message', 'Hello from server!');

    socket.on('message', (data) => {
        console.log('message from client:', data);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});







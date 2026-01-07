const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json()); // Supaya server bisa membaca data JSON dari frontend
app.use(express.static('public')); // Melayani file HTML dari folder public

const DB_PATH = './data/users.json';

// Fungsi bantu untuk membaca data dari file JSON
const readUsers = () => JSON.parse(fs.readFileSync(DB_PATH));

// ROUTE 1: Registrasi User Baru
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "Email sudah ada!" });
    }

    users.push({ email, password });
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
    res.json({ success: true, message: "Berhasil daftar! Silakan login." });
});

// ROUTE 2: Login User
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const userFound = users.find(u => u.email === email && u.password === password);
    if (userFound) {
        res.json({ success: true, message: "Login berhasil!" });
    } else {
        res.status(401).json({ success: false, message: "Email atau password salah!" });
    }
});

app.listen(3000, () => console.log('Server lari di http://localhost:3000'));
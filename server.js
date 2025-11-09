const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.post('/api/contact', (req, res) => {
    // Save contact data to JSON
    const contacts = JSON.parse(fs.readFileSync('./data/contacts.json', 'utf8') || '[]');
    contacts.push(req.body);
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2));
    res.json({ success: true });
});

app.get('/api/flights', (req, res) => {
    const flights = JSON.parse(fs.readFileSync('./data/flights.json', 'utf8'));
    res.json(flights);
});

app.get('/api/hotels', (req, res) => {
    const xml = fs.readFileSync('./data/hotels.xml', 'utf8');
    xml2js.parseString(xml, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
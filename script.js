const http = require('http');
const fs = require('fs');

const port = 4200;

const express = require('express');
const path = require('path');

let app = express();
let publicpath = path.join(__dirname, '\src');

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => [
    fs.readFile('./src/index.html', 'utf8', (err, html) => {
        if(err) {
            res.status(500).send('Pagina non trovata');
        }
        res.send(html);
    })
]);

app.listen(port, () => console.info('App start on http://localhost:4200'));
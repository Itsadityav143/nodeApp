var express = require('express');
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser")
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
let fs = require("fs");
const customCss = fs.readFileSync((process.cwd() + "/swagger.css"), 'utf8');
require("./db");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// let express to use this
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss
}));
const responseHandler = require('./Middlewares/responseHandler')
app.use('/', responseHandler);
const authRoutes = require('./Modules/auth/auth.route').Router
app.use('/auth', authRoutes);

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];


app.get('/adminPanel*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        let url = (req.url.split('?')[0]).replace('/adminPanel', '')
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydii-admin', 'build', url)));
    } else
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydii-admin', 'build', 'index.html')));

});


app.get('/webPanel*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        let url = (req.url.split('?')[0]).replace('/webPanel', '')
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydiirestaurant-web', 'build', url)));
    } else
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydiirestaurant-web', 'build', 'index.html')));

});

app.get('/supermarket*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        let url = (req.url.split('?')[0]).replace('/supermarket', '')
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydiisupermarket-web', 'build', url)));
    } else
        res.sendFile(path.resolve(path.join(__dirname, '..', 'haydiisupermarket-web', 'build', 'index.html')));

});


app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        let url = (req.url.split('?')[0]).replace('/webPanel', '')
        res.sendFile(path.resolve(path.join(__dirname, '..', 'grovtek-landing', url)));
    } else
        res.sendFile(path.resolve(path.join(__dirname, '..', 'grovtek-landing', 'index.html')));
});


app.listen(5000, function () {
    console.log('app listening on port:::', 5000);
});
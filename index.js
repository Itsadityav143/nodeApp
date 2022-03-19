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
const adminBusiness = require('./Modules/admin_business/admin_business.routes').Router
app.use('/admin-business', adminBusiness);
const authRoutes = require('./Modules/auth/auth.route').Router
const regionRoutes = require('./Modules/regions/region.routes').Router
const walletRoutes = require('./Modules/wallet/wallet.routes').Router
const restaurant = require('./Modules/restaurant/restaurant.routes').Router
const user = require('./Modules/user/user.routes').Router
const driver = require('./Modules/driver/driver.routes').Router
const superMarket = require('./Modules/supermarket/supermarket.routes').Router
const store = require('./Modules/store/store.routes').Router

app.use('/store', store);
app.use('/superMarket', superMarket);
app.use('/restaurant', restaurant);
 app.use('/user', user);
app.use('/auth', authRoutes);
app.use('/region', regionRoutes);
app.use('/wallet', walletRoutes);
app.use('/driver', driver);

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


app.listen(3000, function () {
    console.log('app listening on port:::', 3000);
});
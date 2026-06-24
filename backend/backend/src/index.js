const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(require('./routes'));

app.listen(3000, () => {
    console.log('Backend VeriScan rodando na porta 3000');
});
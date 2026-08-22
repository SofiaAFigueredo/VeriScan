const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(require('./routes'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend VeriScan rodando na porta ${PORT}`);
});

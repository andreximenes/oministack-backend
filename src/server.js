const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const routes = require('./routes');
const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(
    'mongodb+srv://ominiuser:ominiuser@cluster0-cj3ll.mongodb.net/oministack?retryWrites=true',
    { userNewUrlParser: true },
    err => {
        if (err) throw err;
        console.log(`Successfully connected to database.`);
    }
)

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    })
});

//Middleware para criar o param io dentro de req, para ser acessivel em qualquer canto da aplicação.
app.use((req, res, next) => {
    req.io = io;
    return next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use('/files/', express.static(path.resolve(__dirname, '..', 'tmp')))

server.listen(process.env.PORT || 3333);
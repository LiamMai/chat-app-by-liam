require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const cors = require('cors')
const socket = require('socket.io')
const bodyParser = require('body-parser');


const cookieParser = require('cookie-parser')

process.on('uncaughtException', error => {
    console.log(`ERROR ${error.stack}`)
    console.log('Shutting down the server due to uncaught exception')
    process.exit(1)
})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting toMongoDB:', err));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});


const app = require('express')();
const http = require('http')
const errorMiddleware = require('./middlewares/errors')


const userRoute = require("./routes/userRoutes")
const friendRoute = require('./routes/friendRoutes')
const messageRoute = require('./routes/messageRoutes')
const conversationRoute = require('./routes/conversationRoutes')

app.use(cors({origin: true, credentials: true}))
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/v1', userRoute);
app.use('/api/v1', friendRoute)
app.use('/api/v1', messageRoute)
app.use('/api/v1', conversationRoute)

//Middleware to handle errors
app.use(errorMiddleware)

const server = http.createServer(app);

const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use((req, res, next) => {
    req.io = io;
    next()
})

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('message', (msg) => {
        console.log('message:', msg);
        io.emit('chat message', msg);
      });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})



//Handle Unhandled Promise rejections
process.on('unhandledRejection', error => {
    console.log(`ERROR ${error.message}`)
    console.log('Shutting down the server due to Unhandled Promise Rejection')
    app.close(() => {
        process.exit(1)
    })
})

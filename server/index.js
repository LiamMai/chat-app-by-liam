require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const cors = require('cors')

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
const errorMiddleware = require('./middlewares/errors')


const userRoute = require("./routes/userRoutes")

app.use(cors())
app.use('/api/v1', userRoute);


//Middleware to handle errors
app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
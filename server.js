import 'dotenv/config';
import express from "express"
import connectDB from './config/db.js';
import authRouter from './router/authRoutes.js';
import bookRouter from './router/bookRoutes.js';
import cors from "cors"
import authorRouter from './router/authorRoutes.js';
import historyRouter from './router/historyRoutes.js';



const app = express()

app.use(express.json());
const corsOption = {
    origin:"http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
    credentials:true,
}

app.use(cors(corsOption))



app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/history', historyRouter);

const PORT = 5000;

connectDB().then(() => {
    app.listen(PORT,() => {
        console.log("Database connected")
        console.log(`server running at http://localhost:${PORT}`);
    })
})

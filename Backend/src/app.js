const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://airesume-ashen-rho.vercel.app'
]

const vercelPreviewPattern = /^https:\/\/airesume-.*\.vercel\.app$/

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser clients and same-origin requests without Origin header.
        if (!origin) {
            return callback(null, true)
        }

        if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}))

//require all the routes here
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

app.get("/", (req, res) => {
    res.send("AI Resume Interview Coach Backend Running ✅");
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});


app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)




module.exports = app
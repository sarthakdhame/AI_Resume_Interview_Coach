const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

//require all the routes here
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

app.get("/", (req, res) => {
    res.send("AI Resume Interview Coach Backend Running ✅");
});

app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)




module.exports = app
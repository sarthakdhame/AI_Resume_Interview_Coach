require('dotenv').config()
const app = require('./src/app')
const connectToDB = require("./src/config/database")

connectToDB()

const cors = require("cors");

app.use(cors({
    origin: "*"
}));


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
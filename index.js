const express = require('express')
const ConnectToMongoose = require('./src/config/DatabaseConnection')
const app = express()
const PORT  = 8000
const authRouter = require('./src/routes/auth.route')
const adminRouter = require('./src/routes/admin.route')
const ticketRouter = require('./src/routes/tickets.route')
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/raise', ticketRouter)
app.use('/api', adminRouter)

function StartServerAndMongoConnection(){
    try {
        ConnectToMongoose()
        app.listen(PORT, () => {
        console.log(`Server started ${PORT}`);

        })
    } catch (error) {
      console.log('Something went wrong while connection');
      throw error
    }
}

StartServerAndMongoConnection()
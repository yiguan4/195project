const express = require('express')
var cors = require('cors')
const app =express()
const port = 5000
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const dbConnection = require('./db')

app.get('/',(req,res) => res.send('caonima123'))


app.use(require('./routes/userRoutes'))
app.use(require('./routes/CarlistRoutes'))
app.use(require('./routes/bookingRoutes'))

app.listen(port,() => console.log('yiyi is in running on port 5000'))
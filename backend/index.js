const express = require('express')
const cors = require('cors')
const port = 3000;
const app = express();
const mainRouter = require('./routes/routes')


app.use(express.json());
app.use(cors()); 
app.use("/api/v1/",mainRouter);


app.listen(port,()=>{
    console.log(`The port is running on ${port}`)
})

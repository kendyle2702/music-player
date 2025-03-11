const path = require('path')
const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 8888

// Page Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// ZingMp3Router
const ZingMp3Router = require("./routers/api/ZingRouter")
app.use("/api/v1", cors(), ZingMp3Router)
// {origin: process.env.URL_ClIENT}

// Page Error
app.get("*", (req, res) => { 
  res.send("Error!")
});

app.listen(port, () => {
  console.log(`Start server listen at http://localhost:${port}`)
});

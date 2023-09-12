const express = require('express')
const os = require('os')

const app = express()

app.use('/', async (req, res) => {
  res.json({
    message: `Hello from ${os.hostname()}`,
    hostname: os.hostname(),
   })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

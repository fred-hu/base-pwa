var express = require('express')
var fs = require('fs')
var https = require('https')
const chalk = require('chalk')
const log = console.log
const app = express()

app.use(express.static(__dirname + '/public'))
app.get('/', function (req, res) {
  res.redirect('index.html')
})
https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
    },
    app
  )
  .listen(3000, function () {
    log(chalk.green('Example app listening on port 3000!\n'))
    log(chalk.blue.underline.bold('https://localhost:3000\n'))
  })

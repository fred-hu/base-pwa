var express = require('express');
const chalk = require('chalk');
const log = console.log;
const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.redirect('index.html');
});
app.listen(3000, function() {
  log(chalk.green('Example app listening on port 3000!\n'));
  log(chalk.blue.underline.bold('http://localhost:3000\n'));
});

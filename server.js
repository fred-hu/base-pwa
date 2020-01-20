var express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.redirect('index.html');
});
app.listen(3000, function() {
  console.log('Example app listening on port 3000!\n');
  console.log('http://localhost:3000');
});

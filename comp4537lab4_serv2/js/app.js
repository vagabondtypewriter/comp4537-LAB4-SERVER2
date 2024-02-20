const utils = require('../modules/utils.js');
const http = require('http');
const url = require('url');
const STRINGSTORE = require('../lang/messages/en/en.js')

http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  res.writeHead(200, {'Content-type' : 'text/html', 'Access-Control-Allow-Origin' : '*'});
  // create html response with blue-colored text
  let htmlResponse;
  if (q.query && q.query.name) {
    htmlResponse = `<div style="color: blue;">${STRINGSTORE.GREETING_MSG.replace('%s', q.query.name)}${utils.getDate()}</div>`;
  }
  else {
    htmlResponse = `<div style="color: blue;">It is now: ${utils.getDate()}</div>`;
    
  }
  res.write(htmlResponse);
  res.end();
}).listen(8888);

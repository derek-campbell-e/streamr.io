module.exports = function Streamer(){
  const common = require('../common');
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  const path = require('path');
  const static = path.join(__dirname, '..', 'www');

  app.use(express.static(static));
  

  let streamr = common.object('streamr');
  streamr.port = 8000;

  let controller = require('./controller')(streamr);
  

  let bind = function(){
    server.listen(streamr.port);
    controller.on('ctrl:message', function(event, command){
      console.log("GOT A MESSAGE");
    });
  };

  let init = function(){
    bind();
    return streamr;
  };

  return init();
};
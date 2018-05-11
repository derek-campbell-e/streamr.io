module.exports = function Controller(){
  const common = require('../../../common');
  const ipc = require('electron').ipcRenderer;
  let controller = common.object('controller', 'renderer');

  let buttons = {};

  controller.buttonClick = function(e){
    let button = $(this);
    let message = button.attr('data-message');
    let args = JSON.parse(button.attr('data-args') || "{}");
    ipc.send('ctrl:message', message, args);
  };

  controller.addButtons = function(){
    let button = `
    <div class='square'>
      <div class='module'>
        <div class='wrapper'>
          <div class='ctrl-btn'></div>
        </div>
      </div>
    </div>
    `;
    for(let i = 0; i < 32; i ++){
      let dom = $(button);
      dom.appendTo('.buttons');
    }
  };

  let bind = function(){
    $(document).on('click', '.ctrl-btn', controller.buttonClick);
  };

  let init = function(){
    bind();
    controller.addButtons();
    return controller;
  };

  return init();
};
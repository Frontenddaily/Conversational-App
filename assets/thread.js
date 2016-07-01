;(function(window, document, $, undefined){
  'use strict';

  function Thread(options){
    this.optionContainer = options.optionContainer;
    this.threadContainer = options.threadContainer;
    this.conversationThread = options.conversationThread;
  }

  Thread.prototype.setOptions = function setOptions(options){
    var
      i = 0,
      item,
      input,
      listItem,
      fragment = document.createDocumentFragment();

    for(i = 0; i < options.length; i++){
      item = options[i];

      listItem = document.createElement('li');

      if(item.input){
        input = document.createElement('input');
        input.classList = 'nameField';
        listItem.appendChild(input);
        listItem.classList += ' has-input';
      }else{
        listItem.innerText = item.message;
      }
      listItem.dataset.tone = item.tone;
      listItem.dataset.direction = item.direction;

      fragment.appendChild(listItem);
    }

    $(this.optionContainer).html(fragment);
  };

  Thread.prototype.addMessage = function addMessage(isSource, message){
    var
      self = this,
      bottom,
      item = document.createElement('div');

    item.classList = (isSource) ? 'source' : 'client' ;
    item.innerText = message;

    $(this.conversationThread).addClass('new');
    $(this.threadContainer)[0].appendChild(item);
    $(this.optionContainer).html('Thinking...');

    setTimeout(function(){
      $(self.conversationThread).removeClass('new');
    }, 500);
  };

  window.Thread = Thread;
})(window, document, jQuery);

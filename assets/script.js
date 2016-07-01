;(function(window, document, $, undefined){
  'use strict';

  // define conditional path

  // Tone is the mood of the user,
  // negative for negative motive and positive for positive motive

  var
    context = {
      tone: 0,
      lastChoice: null,
      collectedInfo: {}
    },
    path = {
      'greeting_question': function(clientChoice){
        return {
          message: 'Hello, how are you?',
          paths: [{
            message: 'Fine, and you?',
            direction: 'express_feeling',
            tone: 0
          }, {
            message: 'Really good, what about you?',
            direction: 'express_feeling',
            tone: 1
          }, {
            message: 'Not good, you?',
            direction: 'express_feeling',
            tone: -1
          }]
        };
      },
      'express_feeling': function(userTone){
        var
          based_on_user_choice = '',
          lead_on_question = 'So hows the weather?',
          paths = [{
            message: 'Its raining :(',
            direction: 'weather',
            tone: -1
          }, {
            message: 'Seems grand',
            direction: 'weather',
            tone: 0
          }, {
            message: 'I think its Sunny',
            direction: 'weather',
            tone: 1
          }];

        if(userTone > 0){
          based_on_user_choice = 'and great to hear your good, ';
        }else if(userTone < 0){
          based_on_user_choice = 'aw im sorry to hear that, ';
          lead_on_question = 'I hope its not raining, is it?';

          paths = [{
            message: 'Yes its raining :(',
            direction: 'weather',
            tone: -1
          }, {
            message: 'No its not',
            direction: 'weather',
            tone: 1
          }];
        }else{
          based_on_user_choice = '';
        }

        return {
          message: 'Im very good, ' + based_on_user_choice + lead_on_question,
          paths: paths
        };
      },
      'weather': function(userTone){
        var
          based_on_user_choice = '',
          lead_on_question = 'Oh almost forgot, whats your name?',
          paths = [{
            message: 'Sorry its a secret',
            direction: 'end',
            tone: -1
          }, {
            message: 'Let me tell you',
            direction: 'name',
            tone: 1
          }];

        if(userTone > 0){
          based_on_user_choice = 'Great to hear, ';
        }else if(userTone < 0){
          based_on_user_choice = 'Oh ok, well thanks for chatting with me';
          lead_on_question = '';

          paths = [{
            message: 'Good bye',
            direction: 'end',
            tone: -1
          }];
        }

        return {
          message: based_on_user_choice + lead_on_question,
          paths: paths
        };
      },
      'name': function(userTone){
        var
          based_on_user_choice = '',
          lead_on_question = 'Please enter it into the input field',
          paths = [{
            input: true,
            direction: 'end',
            tone: 1
          }];

        if(userTone > 0){
          based_on_user_choice = 'Great to hear, ';
        }else if(userTone < 0){
          based_on_user_choice = 'Oh ok, well thanks for chatting with me';
          lead_on_question = '';

          paths = [{
            message: 'Good bye',
            direction: 'end',
            tone: -1
          }];
        }

        return {
          message: based_on_user_choice + lead_on_question,
          paths: paths
        };
      },
      'end': function(userTone){
        var
          based_on_user_choice = '',
          lead_on_question = '',
          paths = [{
            message: 'Knock Knock...',
            direction: 'greeting_question',
            tone: 0
          }];

        if(userTone > 0){
          based_on_user_choice = 'Nice to meet you ' + context.collectedInfo.name + ', Good Bye';
        }else if(userTone < 0){
          based_on_user_choice = 'Ok well i got to go, bye';
        }

        return {
          message: based_on_user_choice + lead_on_question,
          paths: paths
        };
      }
    };

    // Choice

    var thread = new Thread({
      optionContainer: '.conversation-form ul',
      threadContainer: '#target',
      conversationThread: '.conversation-thread'
    }),
    state = true;

    thread.addMessage(true, path.greeting_question().message);
    thread.setOptions(path.greeting_question().paths);
    context.lastChoice = path.greeting_question();

    $('.conversation-form').on('click', 'li:not(.has-input)', function(){
      var
        $self = $(this),
        tone = $self.data('tone'),
        choice = path[$self.data('direction')](tone);

      context.tone = $self.data('tone');
      thread.addMessage(false, _.findWhere(context.lastChoice.paths, { tone: tone }).message);

      context.lastChoice = choice;

      // Onto Robot
      setTimeout(function(){
        thread.addMessage(true, choice.message);

        setTimeout(function(){
          thread.setOptions(choice.paths);
        }, 1000);
      }, 1500);
    });

    $('.conversation-form').on('keydown', 'li.has-input input', function(evt){
      if(evt.keyCode !== 13){
        return true;
      }

      var
        value = $(this).val(),
        $self = $(this),
        $parent = $self.closest('li'),
        tone = $parent.data('tone'),
        choice;

      context.collectedInfo.name = value;

      choice = path[$parent.data('direction')](tone);

      context.tone = tone;
      thread.addMessage(false, value);

      context.lastChoice = choice;

      // Onto Robot
      setTimeout(function(){
        thread.addMessage(true, choice.message);

        setTimeout(function(){
          thread.setOptions(choice.paths);
        }, 1000);
      }, 1500);

    });

})(window, document, jQuery);

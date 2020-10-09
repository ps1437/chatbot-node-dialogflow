var $messages = $('.messages-content');



$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    serverMessage("Hi , &#128567 This is Jaris a Smart Bot !!");
  }, 100);

});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div> ').appendTo($('.mCSB_container')).addClass('new');
  fetchmsg()

  $('.message-input').val(null);
  updateScrollbar();

}

document.getElementById("mymsg").onsubmit = (e) => {
  e.preventDefault()
  insertMessage();
}

function serverMessage(serverResponse) {


  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><i class="fas fa-robot bot-img"></i></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();


  setTimeout(function () {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><i class="fas fa-robot bot-img"></i></figure>' + serverResponse + '</div>').appendTo($('.mCSB_container')).addClass('new');
    updateScrollbar();
  }, 100 + (Math.random() * 20) * 100);

}


function fetchmsg() {

  var url = '/api';

  const data = new URLSearchParams();

  for (const pair of new FormData(document.getElementById("mymsg"))) {
    data.append(pair[0], pair[1]);
  }

  fetch(url, {
    method: 'POST',
    body: data
  }).then(res => res.json())
    .then(response => {
      serverMessage(response.bot);
    })
    .catch(error => console.error('Error h:', error));

}



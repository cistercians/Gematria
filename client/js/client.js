var socket = SockJS('http://localhost:2000/io');
socket.onopen = function(){
  console.log('Client connection opened');
};
socket.onmessage = function(event){
  var data = JSON.parse(event.data);
  if(data.msg == 'calc'){
    var res = data.res;
    var phrase = res.phrase;
    var j = res.j;
    var e = res.e;
    var s = res.s;
    var q = res.q;
    var out = '<tr><td>'+phrase+'</td><td'+of_interest(j)+'>'+j+'</td><td'+of_interest(e)+'>'+e+'</td><td'+of_interest(s)+'>'+s+'</td><td'+of_interest(q)+'>'+q+'</td><td id = "'+phrase+'_td"><button onclick="save_phrase(&apos;'+phrase+'&apos;)">'+'+'+'</button></td></tr>';
    results.innerHTML += out;
    results.style.visibility = 'visible';
  } else if(data.msg == 'res') {
    var res = data.res;
    var phrase = res.phrase;
    var j = res.j;
    var e = res.e;
    var s = res.s;
    var q = res.q;
    var out = '<tr><td>'+phrase+'</td><td'+of_interest(j)+'>'+j+'</td><td'+of_interest(e)+'>'+e+'</td><td'+of_interest(s)+'>'+s+'</td><td'+of_interest(q)+'>'+q+'</td></tr>';
    results.innerHTML += out;
    results.style.visibility = 'visible';
  } else if(data.msg == 'saved'){
    var cell = document.getElementById(data.phrase + '_td');
    cell.remove();
  } else if(data.msg == 'save_reminder'){
    save_button.classList.add('of_interest');
  } else if(data.msg == 'file_saved'){
    save_button.classList.remove('of_interest');
  }
}

var input_phrase = document.getElementById('phrase');
input_phrase.autofocus = true;
var submit_button = document.getElementById('submit');
var results = document.getElementById('results');
submit_button.onclick = function(){
  var input = input_phrase.value.trim();
  socket.send(JSON.stringify({msg:'phrase',phrase:input}));
  input_phrase.value = '';
}
var save_button = document.getElementById('save');
save_button.onclick = function(){
  if(save_button.classList.contains('of_interest')){
    socket.send(JSON.stringify({msg:'save_file'}));
  } else {
    console.log("no changes to save");
  }
}
var random_button = document.getElementById('random');
random_button.onclick = function(){
  socket.send(JSON.stringify({msg:'random'}));
}

input_phrase.addEventListener('keypress',function(event){
  if(event.key === 'Enter' && input_phrase.value != ''){
    submit_button.click();
  }
})

var of_interest = function(data){
  var str = data.toString();
  if(str.length > 1){
    var n = str[0]
    var x = 0;
    for(var i in str){
      if(str[i] != n){
        return ''
      } else {
        x++;
      }
    }
    if(x > 2){
      return ' class="of_interest"'
    } else {
      return ''
    }
  } else {
    return ''
  }
}

var save_phrase = function(phrase){
  socket.send(JSON.stringify({msg:'save',phrase:phrase}));
}

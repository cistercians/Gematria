const fs = require('fs');
const readline = require('readline');

load_db = function(file){
  var db;
  if(fs.existsSync('db.json')){
    db = JSON.parse(fs.readFileSync('db.json','utf8'));
    console.log('loaded database');
    var f = 0;
    for(var i in db){
      f++;
    }
    console.log(f.toString() + " phrases loaded");
  } else {
    db = {}
    fs.writeFile('db.json',JSON.stringify(db), (err) => {
      if(err){
        console.log(err);
      } else {
        console.log('new database created');
      }
    });
  }
  return db
}

import_wordlist = function(file){
  var file = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  });
  file.on('line',function(line){
    save_to_db(line.toUpperCase());
  })
  new_phrases = true;
};

isNumber = function(value){
  for(var i in value){
    if(isNaN(value[i])){
      return false
    }
  }
  return true
}

save_to_db = function(phrase){
  if(!DB[phrase]){
    var res = calculate(phrase);
    DB[phrase] = {
      j:res.j,
      e:res.e,
      s:res.s,
      q:res.q
    }
    new_phrases = true;
    console.log(phrase + ' saved')
  } else {
    console.log(phrase + ' already exists')
  }
}

save_file = function(){
  fs.writeFile('db.json',JSON.stringify(DB), (err) => {
    if(err){
      console.log(err);
    } else {
      console.log('database saved')
    }
  });
}

check_db = function(phrase){
  if(DB[phrase.toUpperCase()]){
    return true
  } else {
    return false
  }
}

search_db = function(num){
  console.log("searching for: " + num);
  var list = [];
  for(var i in DB){
    if(DB[i].j == num || DB[i].e == num || DB[i].s == num || DB[i].q == num){
      list.push(i)
    }
  }
  console.log("found: " + list);
  return list
}

get_random = function(){
  var keys = Object.keys(DB);
  if(keys.length > 0){
    var res = keys[keys.length * Math.random() << 0];
    console.log(res);
    return res
  } else {
    return null
  }
}

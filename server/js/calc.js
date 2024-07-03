calculate = function(phrase){
  var j = 0;
  var e = 0;
  var s = 0;
  var q = 0;
  for(var i in phrase){
    var l = phrase[i].toUpperCase()
    if(l == ' '){
      continue
    } else {
      if(jewish[l]){
        j += jewish[l];
      }
      if(english[l]){
        e += english[l];
      }
      if(simple[l]){
        s += simple[l];
      }
      if(eq[l]){
        q += eq[l];
      }
    }
  }
  return {
    phrase:phrase.toUpperCase(),
    j:j,
    e:e,
    s:s,
    q:q
  }
}

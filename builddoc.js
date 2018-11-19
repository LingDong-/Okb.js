var fs = require("fs");
var Okb = require("./Okb")
var examples = require("./examples")
const { execSync } = require('child_process');

var run = function(id){
  var code = document.getElementById("code-"+id).innerText;
  var header = "var canvas = document.getElementById('canv-"+id+"');\n"
             + "var context = canvas.getContext('2d');\n"
             + "context.fillStyle='white'; context.fillRect(0,0,canvas.width,canvas.height)\n"
  // console.log(header+code)
  try{
    eval(header+code)
  }catch(e){
    try{
      eval(header)
      var es = e.toString();
      var et = es.split(" ");
      var wpl = 2;
      var ln = 0;
      for (var i = 0; i < et.length; i+=wpl){
        ln ++;
        eval("context.fillStyle='black';context.fillText(`"+et.slice(i,i+wpl).join(" ")+"`,0,"+(ln*10)+");")
      }
    }catch(f){
      alert(e);
    }
  }
}

var reset = function(id){
  for (var i = 0; i < 999999; i++){
    window.clearInterval(i);
  }
  setTimeout(()=>(highlight(true)),100);
  setInterval(highlight,1600);
}

var highlight = function(all){
  function getCaretPosition(element, mode) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;

    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      if (mode == "start"){
        preCaretRange.setEnd(range.endContainer, range.endOffset);
      }else{
        preCaretRange.setEnd(range.startContainer, range.startOffset);
      }
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  }

  function setCaretPosition(element,i,j,ie,je){
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(element.childNodes[i], j);
    range.setEnd(element.childNodes[ie], je);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  var codes = document.getElementsByClassName("example-code");

  var keywords = ["break","case","catch","continue","debugger","default","delete","do","else","finally","for","function",
                  "if","in","instanceof","new","return","switch","this","throw","try","typeof","var","void","while","with"]
  keywords = keywords.concat(["canvas","context"])
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890$_"

  for (var i = 0; i < codes.length; i++){
    if ((!all) && document.activeElement != codes[i]){
      continue;
    }
    var c = getCaretPosition(codes[i],"start")+NNL;
    var ce = getCaretPosition(codes[i],"end")+NNL;
    NNL = 0;
    var cc = codes[i].innerText;
    var nc = ""
    for (var j = 0; j < cc.length; j++){
      var matched = false
      for (var k = 0; k < keywords.length; k++){
        matched = true;
        var buf = "";
        for (var l = 0; l < keywords[k].length; l++){
          buf += "<b>"+cc[j+l]+"</b>";
          if (cc[j+l] != keywords[k][l]){
            matched = false;
          }
        }
        if (alpha.includes(cc[j+keywords[k].length]) || alpha.includes(cc[j-1])){
          matched = false;
        }
        if (matched){
          nc += buf;
          j += keywords[k].length-1;
          break;
        }
      }
      if (!matched){
        nc += "<x>"+cc[j]+"</x>"
      }
    }
    codes[i].innerHTML = nc;
    if (document.activeElement == codes[i]){
      var c0 = Math.min(c,ce);
      var c1 = Math.max(c,ce);
      try{
        setCaretPosition(codes[i],c0,0,c1,0);
      }catch(e){
        for (var eee = 0; eee < 10; eee++){
          try{
            codes[i].innerHTML += "<i></i>"
            setCaretPosition(codes[i],c0,0,c1,0);
            break;
          }catch(e){}
        }
      }
    }
  }
}

var forExample = function(f,id){
  var w = 128;
  var result = ""
  var fstr = f.toString();
  var ftitle = fstr.split("\n")[1]
  var fcont = fstr.split("\n").slice(2,-1).join("\n")
  var fcontesc = escape(fcont)
  var name = "code-"+id
  var canvname = "canv-"+id
  result += "<div class='example-cell'>"

  result += "<table style='border-collapse: collapse'><tr>"
  result += "<td><code><b>"+ftitle+"</b></code></td>"
  result += `<td>`
  result += `<span class='example-btn' onclick="reset(); if (this.innerHTML=='[RUN]'){run('`+id+`');this.innerHTML='[STOP]'}else{this.innerHTML='[RUN]'}">[RUN]</span>`

  result += `<span class='example-btn' onclick="document.getElementById('`+name+`').innerHTML=unescape('`+fcontesc+`');reset();">[RESET]</span>`
  result += `</td>\n`
  
  result += "</tr><tr>"
  result += "<td style='padding:0px'><pre id='"+name+"' class='example-code' style='width:512px; height:"+w+"px' contenteditable='true' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' onkeyup='if (event.keyCode==13){console.log(\"++\");NNL+=1}'>\n"+fcont+"\n</pre></td>\n"
  result += "<td style='width:"+w+"px; padding:0px'><canvas id='"+canvname+"' class='example-canv' width='"+w+"' height='"+w+"'></canvas></td>\n"
  result += "</tr></table>"
  result += "</div>"

  result += `<script>run('`+id+`'); setTimeout(reset, 1600)</script>`
  return result;
}

var exampleRequirements = function(){
  var result = ""
  result += "<link rel='stylesheet' href='./style.css'>"
  result += "<script src='./Okb.js'></script>"
  result += "<script>Okb.explode(1);</script>"
  result += "<script>run="+run.toString()+"</script>\n"
  result += "<script>highlight="+highlight.toString()+";NNL=0</script>\n"
  result += "<script>reset="+reset.toString()+";reset()</script>\n"
  return result
}

var generateIndex = function(){
  function resizeIframe(obj){
    console.log(obj.contentWindow.document.body.scrollHeight)
    obj.style.height = obj.contentWindow.document.body.scrollHeight+'px';
    obj.style.width = obj.contentWindow.document.body.scrollWidth+'px';
    window.scrollTo(0,0);
    console.log(obj.style.height);
  }
  function positionIframe(){
    var frame = document.getElementById("example-iframe");
    frame.style.left = Math.max(200,window.innerWidth/2-320)+"px";
    setTimeout(positionIframe,2000)
  }

  var result = ""
  result += "<link rel='stylesheet' href='./style.css'>"
  result+="<script>resizeIframe="+resizeIframe.toString()+"</script>"
  result+="<script>positionIframe="+positionIframe.toString()+"</script>"
  result+="<body>"
  result+="<iframe src='./pages/random.html' frameborder='0' onload='resizeIframe(this)' id='example-iframe'></iframe>"

  result += "<div class='toc-list'>"
  result += "<h2>Okb.js</h2>"
  for (k in examples){
    result += `<div class="toc-btn" onclick="document.getElementById('example-iframe').src='./pages/'+this.innerText+'.html';">`+k+"</div>"
  }
  result += "</div>"

  result += "<script>positionIframe()</script>"
  result+="</body>"
  return result
}

var generateModule = function(k){
  var result = exampleRequirements();
  var id = 1
  result += "<body>"
  result += "<h2>."+k+"</h2>\n"
  for (var i = 0; i < examples[k].length; i++){
    result += forExample(examples[k][i],id)
    id += 1
  }
  result += "<div>Read <a target='_parent' href='../../api/index.html#"+k+"'>API documentation</a></div>"
  result += "</body>"
  return result
}

var generateExampleBook = function(dir){
  if (dir == undefined){dir = "examples"};
  execSync("rm -rf "+dir);
  fs.mkdirSync(dir);
  fs.mkdirSync(dir+'/pages');
  fs.copyFile('Okb.js', dir+'/pages/Okb.js',(err)=>{if(err)console.log(err)});
  fs.copyFile('css/example-index.css', dir+'/style.css',(err)=>{if(err)console.log(err)});
  fs.copyFile('css/example-page.css', dir+'/pages/style.css',(err)=>{if(err)console.log(err)});

  fs.writeFile(dir+'/index.html', generateIndex(), (err)=>{if(err)console.log(err)});
  for (var k in examples){
    fs.writeFile(dir+'/pages/'+k+'.html', generateModule(k), (err)=>{if(err)console.log(err)});
  }
}

generateExampleBook();



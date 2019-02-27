var examples = {
/*/////////////////////////////////////////////////////////////////////////*/
random:[
/***---------------------*/function(){
/* Simplex Noise */
random.simplexSeed((new Date()).getTime());
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height)
  for (var y = 0; y < canvas.height; y+=8){
    for (var x = 0; x < canvas.width; x++){
      var z = random.simplex(x*0.01,y*0.01,t*0.01);
      context.fillStyle="black";
      context.fillRect(x,y-math.map(z,0,1,-64,64),1,1);
    } 
  }
  t ++;
}, 10);
},/*---------------------*/function(){
/* Blue (Poisson-Disk) Noise */
var noise = random.blue({dimension:2, iteration: 30});
var t = 0;
function f(){
  var p = noise();
  context.fillStyle="black";
  context.fillRect(p.x*canvas.width,p.y*canvas.height,2,2);
  t ++;
  if (t < 1000){
    setTimeout(f,10);
  }
}
f()
},/*---------------------*/function(){
/* Plasma (Diamond-Square) Noise */
var noise = random.plasma({n:7,detail:1});
for (var y = 0; y < canvas.height; y++){
  for (var x = 0; x < canvas.width; x++){
    var z = noise(x/canvas.width,y/canvas.height);
    context.fillStyle=color.css(z*255);
    context.fillRect(x,y,1,1);
  } 
}
},/*---------------------*/function(){
/* Loop Noise */
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height)
  for (var i = 0; i < 360; i++){
    var a = i * Math.PI/180;
    var n = random.loopNoise(Math.PI)(a/2,t*0.01);
    var r = math.map (n, 0, 1, canvas.width/5, canvas.width/2);
    var x = canvas.width/2 + r * Math.cos(a);
    var y = canvas.height/2 + r * Math.sin(a);
    context.fillStyle="black";
    context.fillRect(x,y,1,1);
  }
  t ++;
}, 10);
},/*---------------------*/function(){
/* Tile-able Noise */
random.simplexSeed((new Date()).getTime());
var t = 0;
var w = 3;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height)
  for (var y = 0; y < canvas.height; y+=2){
    for (var x = 0; x < canvas.width; x+=2){
      var z = random.tileNoise(w, w)
                  (w*x/canvas.width *1.2+ t*0.1, 
                   w*y/canvas.height*1.2+ t*0.1)
      context.fillStyle=color.css(z*255);
      context.fillRect(x,y,2,2);
    } 
  }
  t ++;
}, 10);
},/*---------------------*/function(){
/* Weighted Randomness */
var t = 0;
function f(){
  var y = random.weighted((x)=>(x*x))
  context.fillStyle="black";
  context.fillRect(
      canvas.width*Math.random(),
      canvas.height*y,2,2);
  t ++;
  if (t < 1000){
    setTimeout(f,10);
  }
}
f()
},/*---------------------*/function(){
/* Fractal Brownian Motion */
random.valueNoiseSeed((new Date()).getTime());
var t = 0;
f = function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height)
  for (var y = 0; y < canvas.height; y+=8){
    for (var x = 0; x < canvas.width; x+=1){
      var z = random.fractal
        (random.valueNoise, {octaves:1+t}) 
        (x*0.04, y*0.04)
      context.fillStyle="black";
      context.fillRect(x,y-math.map(z,0,1,-32,32),1,1);
    } 
  }
  t ++;
  if (t < 10){
    setTimeout(f,100);
  }
}
f();
},
],

/*/////////////////////////////////////////////////////////////////////////*/
geometry:[
/***---------------------*/function(){
/* Point in Polygon? */
var vertices = [[20,20],[80,10],[110,110],[10,60],[50,50]]
graphics.polygon({context: context})(vertices)
var t = 0;
setInterval(function(){
  var p = [Math.random()*canvas.width,
           Math.random()*canvas.height];
  var b = geometry.pointInPolygon(p,vertices);
  context.fillStyle = b?"black":"silver";
  context.fillRect(p.x, p.y, 3, 3);
  t ++;
}, 10);
},/*---------------------*/function(){
/* Triangulate */
var vertices = [[20,20],[80,10],[110,110],[10,60],[50,50],[20,20]]
vertices = geometry.redivide(vertices,20).slice(0,-1);
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height)
  var shifted = []
  for (var i = 0; i < vertices.length; i++){
    shifted.push([
      vertices[i].x + random.perlin(i,t*0.01,1) * 20 - 10,
      vertices[i].y + random.perlin(i,t*0.01,2) * 20 - 10
    ])
  }
  var triangles = geometry.triangulate(shifted);
  for (var i = 0; i < triangles.length; i++){
    graphics.polygon({context:context})(triangles[i])
  }
  t ++;
}, 10);
},/*---------------------*/function(){
/* Line Equation */
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  var p = [
    random.perlin(t*0.005,1) * canvas.width,
    random.perlin(t*0.005,2) * canvas.height
  ];
  var q = [
    random.perlin(t*0.005,3) * canvas.width,
    random.perlin(t*0.005,4) * canvas.height
  ];
  var [a,b,c] = geometry.lineEquation  (p,q);
  var [m,k]   = geometry.slopeIntercept(p,q);
  graphics.polygon({context:context})([p,q]);
  context.fillStyle = "black";
  context.fillText("("+a.toFixed(1)+")x+"
                  +"("+b.toFixed(1)+")y+"
                  +"("+c.toFixed(1)+")=0",0,10);
  context.fillText("y=("+m.toFixed(1)+")x+("+k.toFixed(1)+")",0,25);
  t ++;
}, 10);
},
],

/*/////////////////////////////////////////////////////////////////////////*/
curves:[
/***---------------------*/function(){
/* Variable-Strength Smoothing */
var vertices = [[50,15],[80,10],[110,110],[10,60],[50,50],[20,20],[50,15]]
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  var w = -Math.cos(t*0.04)*2+2.5;
  var smoothed = curves.smoothen(vertices, {weight:w})
  var drawPoly = graphics.polygon({context: context, 
                                   close:false, 
                                   fill:undefined})
  drawPoly(vertices)
  drawPoly(smoothed)
  context.fillText("weight="+w.toFixed(2),0,10);
  t ++;
}, 10);
},/*---------------------*/function(){
/* Generating a Smooth Function from Data Points */
var t = 0;
var n = 5;
var data = []
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  for (var i = 0; i <= n; i++){
    data[i] = [i/n, random.perlin(i*10,t*0.01)];
    context.fillStyle='black';
    context.fillRect(data[i].x*canvas.width-2,
                    (1-data[i].y)*canvas.height-2,5,5);
  }
  var f = curves.fit(data, {smooth:1})
  for (var x = 0; x < canvas.width; x+=5){
    var y = f(x/canvas.width);
    graphics.polygon({context:context, close:false})
                    ([[x,(1-y)*canvas.height],[x,canvas.height]]);
  }
  t ++;
}, 10);
},/*---------------------*/function(){
/* Misc Curves */
var t = 0;
var funcs = {"gaussian":curves.gaussian, 
             "sigmoid":curves.sigmoid, 
             "inverseSigmoid":curves.inverseSigmoid,
             "bean":curves.bean}
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "black"
  for (var k in funcs){
    var textX = t % canvas.width;
    var textY;
    for (var x = 0; x < canvas.width; x++){
      var fx = funcs[k](x/canvas.width);
      var y = (1-fx)*canvas.height;
      if (x == textX){textY = y};
      context.fillRect(x,y,1,1);
    }
    context.fillText(k,textX,textY);
  }
  t ++;
},10);
},
],


/*/////////////////////////////////////////////////////////////////////////*/
graphics:[
/***---------------------*/function(){
/* Organic Brushstrokes */
setInterval(function(){
  graphics.brushstroke(
    {context:context, resample:0,
     color:color.hsv(Math.random()*360,0.6,1), 
    })(curves.smoothen(
      [[Math.random()*canvas.width,
        Math.random()*canvas.height],
       [Math.random()*canvas.width,
        Math.random()*canvas.height],
       [Math.random()*canvas.width,
        Math.random()*canvas.height]],
    ))
},20)
},/*---------------------*/function(){
/* Project Texture onto Quad */
var mouseX = canvas.width;
var mouseY = canvas.height;
var tex = texture.wood({width:128,height:128});
canvas.addEventListener('mousemove', function(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = evt.clientX - rect.left;
  mouseY = evt.clientY - rect.top
}, false);
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  graphics.projectTexture({
      context:  context,
      texture:  tex,
      vertices: [[20,30],[100,10],
                 [mouseX,Math.max(128-mouseX,mouseY)],
                 [0,100]],
      pixelSize:2
  })
},10)
},
],

/*/////////////////////////////////////////////////////////////////////////*/
vector:[
/***---------------------*/function(){
/* Rotating Vectors */
var w = canvas.width/4;
var vertices = [[-w,-w,-w],[-w,w,-w],[w,w,-w],[w,-w,-w],
                [-w,-w,w], [-w,w,w], [w,w,w], [w,-w,w]]
var drawPoly = graphics.polygon({
  context:context,
  fill: undefined,
  offset:[canvas.width/2, canvas.height/2]
})
var t = 0;
setInterval(function(){
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
  for (var i = 0; i < vertices.length; i++){
    vertices[i] = vector.rotateEuler(vertices[i],
                  {x:Math.sin(t*0.1)*0.1,y:0.05,z:0});
  }
  drawPoly(vertices.slice(0,4));
  drawPoly(vertices.slice(4,8));
  drawPoly([vertices[0],vertices[1],vertices[5],vertices[4]]);
  drawPoly([vertices[2],vertices[3],vertices[7],vertices[6]]);
  t ++;
},10)
},
],

/*/////////////////////////////////////////////////////////////////////////*/
texture:[
/***---------------------*/function(){
/* Tile-able Wood Texture */
var tex = texture.wood({
  width: canvas.width,
  height:canvas.height,
  tile:  true,
});
var t = 0;
setInterval(function(){
  for (var y = 0; y < canvas.height; y++){
    for (var x = 0; x < canvas.width; x++){
      context.fillStyle = color.css(tex[y][x]);
      context.fillRect((x+t*2)%canvas.width,
                       (y+t*2)%canvas.height,1,1);
    }
  }
  t ++;
},20)
},/*---------------------*/function(){
/* Rice Paper Texture */
var tex = texture.ricePaper({
  width: canvas.width,
  height:canvas.height,
});
for (var y = 0; y < canvas.height; y++){
  for (var x = 0; x < canvas.width; x++){
    context.fillStyle = color.css(tex[y][x]);
    context.fillRect(x,y,1,1);
  }
}
},/*---------------------*/function(){
/* Tile-able Knit-like Patterns */
var tex = texture.knitPattern({
  width: canvas.width /3,
  height:canvas.height/3,
});
for (var y = 0; y < canvas.height; y++){
  for (var x = 0; x < canvas.width; x++){
    context.fillStyle = color.css(
      tex[y%tex.length][x%tex[0].length]
    );
    context.fillRect(x,y,1,1);
  }
}
},


],



}




module.exports = examples;
function updateTestArea(){
  testArea.clear();
  truss.render();
}

var events = {
  dragging:false,
  rotating:false,
  label: document.getElementById("mouseLabel"),
  keyDown: function(e){
    switch (e.code){
      case "BracketLeft":
        if (e.ctrlKey){
          truss.reorder(truss.sticks.length-1);
        }
        else {
          truss.reorder(truss.selected+1);
        }
        break;
      case "BracketRight":
        if (e.ctrlKey){
          truss.reorder(0);
        }
        else {
          truss.reorder(truss.selected-1);
        }
        break;
      case "Delete":
        truss.remove(truss.selected);
        break;
      case "KeyQ":
        truss.sticks[truss.selected].rad -= 10/180*Math.PI;
        break;
      case "KeyE":
        truss.sticks[truss.selected].rad += 10/180*Math.PI;
        break;
      case "KeyW":
        truss.sticks[truss.selected].y -= 5;
        break;
      case "KeyS":
        truss.sticks[truss.selected].y += 5;
        break;
      case "KeyA":
        truss.sticks[truss.selected].x -= 5;
        break;
      case "KeyD":
        truss.sticks[truss.selected].x += 5;
        break;
      case "Equal":
        var stick = truss.sticks[truss.selected];
        truss.add(stick.x+15, stick.y-15, 0)
        break;
      case "Minus":
        if (e.ctrlKey){
          truss.clear();
        }
        else {
          truss.remove(this.selected);
        }
        break;
    }
  },
  keyUp: function(e){

  },
  mouseWheel: function(e){
    //console.log(e);
  },
  mouseDown: function(e){
    // Check if a stick has been selected
    for ( var i in truss.sticks ){
      var stick = truss.sticks[i];
      var coor = truss.rotate(-stick.rad, [{x:e.layerX-stick.x,y:e.layerY-stick.y}])[0];
      if ((coor.x > -50 && coor.x < 50)&&(coor.y > -5 && coor.y < 5)){
        truss.selected = i;
        break;
      }


    }
    this.dragging = true;
  },
  mouseMove: function(e){
    if (this.dragging){
      this.label.innerText = "x = "+Math.ceil(e.layerX / 5) * 5+", y = "+Math.ceil(e.layerY / 5) * 5;
      this.label.style.left = e.layerX +50;
      this.label.style.top = e.layerY-50;
      this.label.style.padding = "5px";
      this.label.style.border = "2px outset black";
      truss.move(e.layerX,e.layerY);
    }
    else{

    }
  },
  mouseUp: function(e){
    this.dragging = false;
    this.label.innerText = "";
    this.label.style.padding = "0px";
    this.label.style.border = "";

  }
}

var testArea = {
  canvas: document.getElementById('canvas'),
  ctx: this.canvas.getContext('2d'),
  drawGrid:function(){
    var ctx = this.canvas.getContext('2d');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    // Draw vertical lines
    ctx.beginPath();
    for (var x = 0; x < canvas.width; x+=10){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    ctx.strokeStyle = 'lightcyan';
    ctx.stroke();
    // Draw horizontal lines
    ctx.beginPath();
    for (var y = 0; y < this.canvas.width; y+=10){
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
    }
    ctx.strokeStyle = 'lightcyan';
    ctx.stroke();
    // Draw table tops
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = "DarkGoldenRod";
    var tableBot = this.canvas.height-120;
    var tableLen = (this.canvas.width - 500)/2;
    ctx.fillRect(0,tableBot,tableLen,35);
    ctx.fillRect(this.canvas.width-tableLen,tableBot,this.canvas.width,35);
    ctx.rect(0,tableBot,tableLen,35);
    ctx.rect(this.canvas.width-tableLen,tableBot,tableLen,35);
    ctx.stroke();
    // Draw Y axis
    ctx.beginPath();
    ctx.moveTo(10,this.canvas.height-10);
    ctx.lineTo(10, this.canvas.height-60);
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("y", 5, this.canvas.height-68);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    // Draw X axis
    ctx.beginPath();
    ctx.moveTo(10,this.canvas.height-10);
    ctx.lineTo(60, this.canvas.height-10);
    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText("x", 68,this.canvas.height-5);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  },
  start: function(){
    this.canvas.width = 800;
    this.canvas.height = 400;
    this.interval = setInterval(updateTestArea, 20);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.drawGrid();
    document.getElementById('addStick').onclick = function(){
      truss.add(400,350,0);
    };
    document.getElementById('clearSticks').onclick = function(){
      truss.clear();
    };
    document.getElementById('helpButton').onclick = function(){
      testArea.toggleGuide();
    };
    document.getElementById('loadBridge').onclick = function(){
      truss.load();
    };
    document.getElementById('saveBridge').onclick = function(){
      truss.save();
    };
    document.getElementById('canvas').addEventListener('mousedown',function(e){
      events.mouseDown(e);
    });
    document.getElementById('canvas').addEventListener('mousemove',function(e){
      events.mouseMove(e);
    });
    document.getElementById('canvas').addEventListener('mouseup',function(e){
      events.mouseUp(e);
    });
    document.getElementById('canvas').addEventListener('wheel',function(e){
      events.mouseWheel(e);
    });
    document.getElementById('canvas').addEventListener('keydown',function(e){
      events.keyDown(e);
    });

  },
  toggleGuide: function(){

    if ( document.getElementById('guide').style.display === "block"){
      document.getElementById('helpButton').innerHTML = "Show Guide";
      document.getElementById('guide').style.display = "none";
    }
    else {
      document.getElementById('helpButton').innerHTML = "Hide Guide";
      document.getElementById('guide').style.display = "block";
    }
  },
  clear: function(){
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawGrid();
  }
}

var truss = {
  selected:0,
  sticks: [],
  sticksLeft: 50,
  points: [
        {x:50,y:5},
        {x:-50,y:5},
        {x:-50,y:0},
        {x:50,y:-5},
        {x:50,y:0}
  ],
  move: function(x,y) {
    this.sticks[this.selected].x = Math.ceil(x / 5) * 5;
    this.sticks[this.selected].y = Math.ceil(y / 5) * 5;
  },
  add: function (x, y, deg){
    this.selected = this.sticks.length
    this.sticksLeft--;
    this.sticks.push({
      x:x,
      y:y,
      rad:deg * Math.PI / 180
    });
  },
  remove: function (i){
    this.sticksLeft++;
    this.sticks.splice(i,1);
  },
  render: function () {
    //console.table(this.sticks);
    document.getElementById("stickCount").innerHTML = this.sticksLeft+" Sticks Left";
    for (var i in this.sticks){
      this.draw(i);
      this.crossover(i);
    }
  },
  crossover: function (i){
    var stick = truss.sticks[i];

    for (var j in this.sticks){

    }
  },
  reorder: function(to){
    if (this.sticks.length == 0){
      return;
    }
    else if (to < 0){
      to = 0;
    }
    else if (to > this.sticks.length-1){
      to = this.sticks.length-1;
    }
    var stick = this.sticks[this.selected];
    this.sticks.splice(this.selected,1);
    this.sticks.splice(to, 0, stick);
    this.selected = to;
  },
  clear: function () {
    this.sticks = [];
    this.sticksLeft = 50;
  },
  draw: function (i) {
    var stick = this.sticks[i];
    var points = this.rotate(stick.rad);
    var ctx = testArea.ctx;
    // Convert aginle into radians and store arc angles
    var ang1 = Math.PI/2+stick.rad;
    var ang2 = Math.PI*3/2+stick.rad;
    ctx.beginPath();
    ctx.moveTo(points[0].x + stick.x, points[0].y + stick.y);
    ctx.lineTo(points[1].x + stick.x, points[1].y + stick.y);
    ctx.arc(points[2].x + stick.x, points[2].y + stick.y, 5, ang1, ang2);
    ctx.lineTo(points[3].x + stick.x, points[3].y + stick.y);
    ctx.arc(points[4].x + stick.x, points[4].y + stick.y, 5, ang2, ang1);
    ctx.strokeStyle = (i == this.selected) ? 'red' : 'black';
    ctx.fillStyle = 'bisque';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  },
  rotate:function(rad, points=this.points){
    // Create array for rotation
    var rotatedPoints = [];
    for (var i in points){
      var x = points[i].x;
      var y = points[i].y;
      rotatedPoints.push({
        x:x*Math.cos(rad)-y*Math.sin(rad),
        y:x*Math.sin(rad)+y*Math.cos(rad)
      });
    }
    return rotatedPoints;
  },
  save:function(){
    var data = JSON.stringify(this.sticks);
    var blob = new Blob( [data] , {
      type:'application/octet-stream'
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement( 'a' );
    link.setAttribute('href', url);
    link.setAttribute('download', 'bridge.json');
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
  },
  load: function(){
    var load = document.createElement( 'input' );
    load.addEventListener('change', function(){
      var fname = load.files[0].name;
      var data = $.getJSON(fname, function(){
        console.log(data);
      });
    });
    load.setAttribute("type", "file");
    load.setAttribute("accept", ".json")
    load.style.display = "none";
    load.click();
  }
}

testArea.start();

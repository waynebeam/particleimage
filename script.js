let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let image = document.getElementById('image');


let coordinates = [];
let particles = [];
let animating = false;
let scatter = false;

let button = document.getElementById("button");
button.addEventListener('click', ()=>{
  toggle();  
})
canvas.addEventListener('click', ()=>{
  toggle();  
})

class Particle{
  constructor(x, y){
    this.pos = {x: Math.floor(Math.random()*canvas.width), y: Math.floor(Math.random()*canvas.height)};
    this.dest = {x: x, y: y};
    this.finalDest = {...this.dest};
    this.radius = 2;
  }
  draw(){
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(this.pos.x,this.pos.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
  }

  update(){
    let dx = this.dest.x - this.pos.x;
    let dy = this.dest.y - this.pos.y;
    if(Math.abs(dx) > 5){
      this.pos.x += dx/10;
    } else{ this.pos.x = this.dest.x};
    
    if(Math.abs(dy) > 5){
      this.pos.y += dy/10;
    } else{ this.pos.y = this.dest.y};
    
  }
}

function processImage(){

  ctx.drawImage(image,0,0, 100,100);
  let imageData = ctx.getImageData(0,0,100,100);
  ctx.clearRect(0,0,canvas.width, canvas.height);
  
  let threshold = 150;
  for (let i=0; i<imageData.data.length; i+=4)
    {
      let r = imageData.data[i];
      let g = imageData.data[i+1];
      let b = imageData.data[i+2];
      let a = imageData.data[i+3];
      if(r<threshold && g<threshold && b<threshold && a>0)
        {
          let idx = i/4;
          let y = Math.floor(idx/imageData.width);
          let x = idx % imageData.width;
          coordinates.push({x: x, y: y});
        }
    }
}

function drawDots(){
  let scale = 3;
  let offset = 15;
  coordinates.forEach(coordinate => {
    let x = coordinate.x * scale + offset;
    let y = coordinate.y * scale + offset;
    particles.push(new Particle(x, y));
  })
}

function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  for(let i=0; i<particles.length; i++){
    particles[i].draw();
    if(animating){
      particles[i].update();
    }
  }
  requestAnimationFrame(animate);
}

function toggle(){
  if(!animating)
  {
    animating = true;
    button.innerHTML = "Scramble!";
    return;
  }
  if(!scatter){
    for(let i=0; i<particles.length; i++){
      particles[i].dest.x = Math.floor(Math.random()*canvas.width);
      particles[i].dest.y = Math.floor(Math.random()*canvas.height);
    }
    scatter = true;
    button.innerHTML = "Draw!";
    return
  }
  else{
    scatter = false;
    button.innerHTML = "Scramble!";
     for(let i=0; i<particles.length; i++){
      particles[i].dest.x = particles[i].finalDest.x;
      particles[i].dest.y = particles[i].finalDest.y;
    }
  }
}

window.onload = function(){ 
  processImage();
  drawDots();
  animate();
};

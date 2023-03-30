function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const canvas_story = document.getElementById('story');
const ctx_story = canvas_story.getContext('2d');

width = canvas_story.width = window.innerWidth;
height = canvas_story.height = window.innerHeight;


canvas_story.style.background = properties.black;

class Border {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  draw() {
    for(let j = 0; j < 3; j++){
      ctx_story.beginPath();
        
      ctx_story.rect(properties.blocksize*j, j*properties.blocksize, width-2*j*properties.blocksize, properties.blocksize);
      ctx_story.rect(properties.blocksize*j, height - properties.blocksize - j*properties.blocksize, width-2*j*properties.blocksize, properties.blocksize);
        
      ctx_story.closePath();
      ctx_story.fillStyle = properties.gradient[(j+1)*25];
      ctx_story.fill();
    }
    for(let j = 0; j < 3; j++){
      ctx_story.beginPath();
        
      ctx_story.rect(j*properties.blocksize, j*properties.blocksize, properties.blocksize, height-2*j*properties.blocksize);
      ctx_story.rect(width - properties.blocksize - j*properties.blocksize, j*properties.blocksize, properties.blocksize, height-2*j*properties.blocksize);

      ctx_story.closePath();
      ctx_story.fillStyle = properties.gradient[(j+1)*25];
      ctx_story.fill();
    }
  }
}

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.posx = x;
    this.posy = y;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.velocity = 0.1;
    this.image = 'player';
    this.dir = properties.down;
  }
  update() {
    let x = this.x;
    let y = this.y;
    if(this.moveUp) this.y -= this.velocity;
    if(this.moveDown) this.y += this.velocity;
    for(let a in solids_arr){
      if(solids_arr[a].checkRect(this.x, this.y, this.width, this.height)){
        this.y = y;
      }
    }
    if(this.moveLeft) this.x -= this.velocity;
    if(this.moveRight) this.x += this.velocity;
    for(let a in solids_arr){
      if(solids_arr[a].checkRect(this.x, this.y, this.width, this.height)){
        this.x = x;
      }
    }
    if(!(this.moveRight || this.moveLeft || this.moveUp || this.moveDown)){
      if(this.dir == properties.down){
        this.image = 'player_down1';
      }
      if(this.dir == properties.up){
        this.image = 'player_up1';
      }
      if(this.dir == properties.right){
        this.image = 'player_right1';
      }
      if(this.dir == properties.left){
        this.image = 'player_left1';
      }
      this.anim_step = 0;
    }else{
      if(this.moveDown){
        this.image = 'player_down' + this.anim_step%4;
        this.anim_step++;
        this.dir = properties.down;
        return;
      }
      if(this.moveUp){
        this.image = 'player_up' + this.anim_step%4;
        this.anim_step++;
        this.dir = properties.up;
        return;
      }
      if(this.moveRight){
        this.image = 'player_right' + this.anim_step%4;
        this.anim_step++;
        this.dir = properties.right;
        return;
      }
      if(this.moveLeft){
        this.image = 'player_left' + this.anim_step%4;
        this.anim_step++;
        this.dir = properties.left;
        return; 
      }
    }
  }
  draw() {
    this.update();
    var img = document.getElementById(this.image);
    ctx_story.drawImage(img, this.posx*rpg_blocksize, this.posy*rpg_blocksize, this.width, this.height);
    
  }
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = 'grass';
  }
  draw(){
    var img = document.getElementById('block');
    ctx_story.drawImage(img, this.x*rpg_blocksize, this.y*rpg_blocksize, rpg_blocksize, rpg_blocksize); 
  }
}

class SolidObject {
  constructor(x, y, width, height, cx, cy) {
    this.x = x;
    this.y = y;
    this.posx = x;
    this.posy = y;
    this.cx = cx;
    this.cy = cy;
    this.width = width;
    this.height = height;
  }
  checkRect(x, y, width, height) {
    return !( this.y > y + (height/rpg_blocksize) || this.y + (this.height/rpg_blocksize) < y
     || this.x + (this.width/rpg_blocksize) < x || this.x > x + (width/rpg_blocksize));
  }
  update(x, y) {
    this.posx -= x - this.cx;
    this.posy -= y - this.cy;
    this.cx = x;
    this.cy = y;   
  }
  draw() {
    var img = document.getElementById('solid');
    ctx_story.drawImage(img, this.posx*rpg_blocksize, this.posy*rpg_blocksize, this.width, this.height);     
  }
}

// a = this a.y = this.y a.y1 = this.y + this.height
// b = other b.y = y b.y1 = y + height

class Map {
  constructor(width, height, cx, cy) {
    this.width = width;
    this.height = height;
    this.center_x = cx;
    this.center_y = cy;
    this.blocks = [];
    let half_w = this.width/2 | 0;
    let half_h = this.height/2 | 0;
    for(let i = -half_w;i<half_w;i++){
      this.blocks.push([]);
      for(let j = -half_h;j<half_h;j++){
        this.blocks[i + half_w].push(new Block(this.center_x+i, this.center_y+j));
      }
    }
  }

  update(cx, cy) {
    let dx = cx - this.center_x;
    let dy = cy - this.center_y;
    let half_w = this.width/2 | 0;
    let half_h = this.height/2 | 0;
    for(let i = -half_w;i<half_w;i++){
      for(let j = -half_h;j<half_h;j++){
        this.blocks[i + half_w][j + half_h].x -= dx;
        this.blocks[i + half_w][j + half_h].y -= dy; 
      }
    }
    this.center_x = cx;
    this.center_y = cy;
  }

  draw() {
    let half_w = this.width/2 | 0;
    let half_h = this.height/2 | 0;
    for(let i = -half_w;i<half_w;i++){
      for(let j = -half_h;j<half_h;j++){
        this.blocks[i + half_w][j + half_h].draw();
      }
    }
  }
}

init_rpg();
function init_rpg() {
  solids_arr = [];
  rpg_blocksize = 80;
  border = new Border(width, height);
  player = new Player(width/(2*rpg_blocksize) | 0, height/(2*rpg_blocksize) | 0, 55, 80);
  for(let i = 0;i<20;i++){
    solids_arr.push(new SolidObject(i+1, 1, rpg_blocksize, rpg_blocksize, player.x, player.y));
    if(i!=5)
    solids_arr.push(new SolidObject(i+1, 20, rpg_blocksize, rpg_blocksize, player.x, player.y));
  }
  for(let i = 1;i<19;i++){
    solids_arr.push(new SolidObject(1, i + 1, rpg_blocksize, rpg_blocksize, player.x, player.y));
    solids_arr.push(new SolidObject(20, i + 1, rpg_blocksize, rpg_blocksize, player.x, player.y));
  }
  map = new Map(100, 100, player.x, player.y); 
}

window.addEventListener("keydown", playerStartMove);
window.addEventListener("keyup", playerStopMove);

loop_story();
async function loop_story() {
  rpg_blocksize = 80;
  ctx_story.clearRect(0, 0, width, height);
  map.update(player.x, player.y);
  map.draw();
  player.draw();
  for(let i in solids_arr){
    solids_arr[i].update(player.x, player.y);
    solids_arr[i].draw();
  }
  border.draw();
  await sleep(25);
  requestAnimationFrame(loop_story);
}

function playerStopMove(e) {
  switch(e.code) {
    case "KeyW":
      player.moveUp = false;
      break;
    case "KeyS":
      player.moveDown = false;
      break;
    case "KeyA":
      player.moveLeft = false;
      break;
    case "KeyD":
      player.moveRight = false;
  }
}

function playerStartMove(e) {
  switch(e.code) {
    case "KeyW":
      player.moveUp = true;
      break;
    case "KeyS":
      player.moveDown = true;
      break;
    case "KeyA":
      player.moveLeft = true;
      break;
    case "KeyD":
      player.moveRight = true;
  }
}

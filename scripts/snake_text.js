properties.blocksize = 20;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const canvas_snake_text = document.getElementById('snake_text');
const ctx_snake_text = canvas_snake_text.getContext('2d');

width = canvas_snake_text.width = window.innerWidth;
height = canvas_snake_text.height = window.innerHeight - navBar.clientHeight;

canvas_snake_text.style.marginTop = navBar.clientHeight + "px";
canvas_snake_text.style.background = properties.black;


class Coord {
  constructor(x, y) {
    this.x = x % maxX;
    this.y = y % maxY;
    this.color = properties.pink;
  }
}

class Snake {
  constructor(direction, velocity, array) {
    this.snake = Array.from(array);
    this.length = length;
    this.dir = direction;
    this.velocity = velocity;
  }
  updateHead() {
    if(this.dir == properties.up){
      this.snake[0].y -= this.velocity;
    }
    if(this.dir == properties.down){
      this.snake[0].y += this.velocity;
    }
    if(this.dir == properties.left){
      this.snake[0].x -= this.velocity;
    }
    if(this.dir == properties.right){
      this.snake[0].x += this.velocity;
    }
    if(this.snake[0].x < 0) this.snake[0].x += maxX;
    if(this.snake[0].y < 0) this.snake[0].y += maxY;
    this.snake[0].x %= maxX;
    this.snake[0].y %= maxY;
    if(this.snake[0].x == 0) this.snake[0].x = maxX; 
  }
  updateTail() {
    for(let i = this.snake.length - 1;i > 0;i--){
      this.snake[i].x = this.snake[i - 1].x;
      this.snake[i].y = this.snake[i - 1].y;
    }
  }
  update() {
    this.updateTail();
    this.updateHead();
    this.draw();
  }
  draw() {
    for(let i = this.snake.length - 1;i >= 0;i--){
      ctx_snake_text.beginPath();
      ctx_snake_text.rect((this.snake[i].x-1)*properties.blocksize, this.snake[i].y*properties.blocksize, properties.blocksize, properties.blocksize);
      ctx_snake_text.closePath();
      ctx_snake_text.fillStyle = this.snake[i].color;
      ctx_snake_text.fill();
    }
  }
  async drawD() {
    var steps = [10, 10, 6, 1,
                 1, 1, 1, 6,
                 1, 1, 1, 1, 
                 4, 8, 2, 1, 
                 1, 4, 1, 1, 
                 2, 2, 8, 9,
                 2, 2, 2, 2,
                 2, 5, 2, 9,
                 6, 9, 2, 7,
                 2, 2, 2, 2,
                 2, 5, 6, 3,
                 3, 2, 3, 6,
                 5, 2, 3, 2,
                 3, 6, 3, maxY-12,
                 5, 2];
    var dirs = [properties.right, properties.up, properties.right, properties.down, 
                properties.right, properties.down, properties.right, properties.down, 
                properties.left, properties.down, properties.left, properties.down,
                properties.left, properties.up, properties.right, properties.down,
                properties.right, properties.down, properties.left, properties.down,
                properties.left, properties.down, properties.right, properties.up,
                properties.right, properties.down, properties.left, properties.down,
                properties.right, properties.down, properties.right, properties.up,
                properties.right, properties.down, properties.left, properties.up,
                properties.left, properties.down, properties.right, properties.down,
                properties.left, properties.down, properties.right, properties.up,
                properties.right, properties.up, properties.left, properties.up,
                properties.right, properties.down, properties.left, properties.down,
                properties.right, properties.down, properties.left, properties.down,
                properties.right, properties.down];
    var start = new Coord(this.snake[0].x, this.snake[0].y);
    for(let i = 0;i<steps.length;i++){
      this.dir = dirs[i];
      var goal = new Coord(0, 0);
      goal.x = this.snake[0].x;
      goal.y = this.snake[0].y;
      if(dirs[i] == properties.up){
        goal.y -= steps[i];
      }
      if(dirs[i] == properties.down){
        goal.y += steps[i];
      }
      if(dirs[i] == properties.left){
        goal.x -= steps[i];
      }
      if(dirs[i] == properties.right){
        goal.x += steps[i];
      }
      if(i == 0){
        goal.x = ((maxX - 28)/2 | 0);
        if(goal.x == 0) goal.x += 1;
      }
      if(goal.x < 0){
        goal.x += maxX;
      }
      if(goal.y < 0){
        goal.y += maxY;
      }
      goal.x %= maxX;
      goal.y %= maxY;
      if(goal.x == 0) goal.x = maxX;
      while(this.snake[0].x != goal.x || this.snake[0].y != goal.y){
        await sleep(1);
      }

    }
  }
}

init_snake_text();
function init_snake_text() {

  properties.blocksize = 20;
  if(width < 800) properties.blocksize = 15;
  if(width < 600) properties.blocksize = 10;

  maxX = (width/properties.blocksize | 0) + 1;
  maxY = (height/properties.blocksize | 0) + 1;

  let length = maxX + 120;
  arr = [];

  let iter = 1;
  let j = 0;
  for(let i = 0; i < length; i++){
    arr.push(new Coord((- i), (maxY/2 | 0)));
    arr[i].color = properties.gradient[j];
    if(i >= maxX && j < 120){
      j++;
    }
  }
  s = new Snake(properties.right, 1, arr);

}

//window.addEventListener("keydown", snakeMove);

loop_snake_text();
async function loop_snake_text() {
  ctx_snake_text.clearRect(0, 0, width, height);
  s.update();
  await sleep(100);
  requestAnimationFrame(loop_snake_text);
}

dias();
async function dias() {
  var goal = new Coord();
  goal.x = 1;
  goal.y = (maxY/2 | 0);
  while(goal.y < 0) goal.y += maxY;
  while(goal.x < 0) goal.x += maxX;
  goal.x %= maxX;
  goal.y %= maxY;
      
  while(s.snake[0].x != goal.x){
    await sleep(1);
  }
  while(true){
    await s.drawD();
    while(s.snake[0].y != goal.y){
      await sleep(1);
    }
  }
}

// function snakeMove(e) {
//   switch(e.code) {
//     case "ArrowUp":
//       s.dir = properties.up;
//       break;
//     case "ArrowDown":
//       s.dir = properties.down;
//       break;
//     case "ArrowLeft":
//       s.dir = properties.left;
//       break;
//     case "ArrowRight":
//       s.dir = properties.right;
//       break;
//     case "KeyD":
//       s.drawD();
//       break;
//   }
// }

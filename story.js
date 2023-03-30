const canvas_story = document.getElementById('story');
const ctx_story = canvas_story.getContext('2d');

width = canvas_story.width = window.innerWidth;
height = canvas_story.height = window.innerHeight - navBar.clientHeight;


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

border = new Border(width, height);

loop_story();
function loop_story() {
  border.draw();
  requestAnimationFrame(loop_story);
}

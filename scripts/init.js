var width;
var height;

document.querySelectorAll('a[href^="#"').forEach(link => {

    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);

        const topOffset = document.querySelector('.navbar').offsetHeight;
         
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

window.onresize = function() {
  width = canvas_snake_text.width = canvas_story.width = window.innerWidth;
  height = canvas_snake_text.height = canvas_story.height = window.innerHeight - navBar.clientHeight;
  canvas_snake_text.style.marginTop = navBar.clientHeight + "px";
  init_snake_text();
  dias();
}

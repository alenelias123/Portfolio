// Typewriter Effect for Skills Page
const words = ["Web Developer", "Cybersecurity Enthusiast", "Creative Designer"];
let i = 0, j = 0, currentWord = "", isDeleting = false;
const typewriter = document.getElementById("typewriter");

function type() {
  currentWord = words[i];
  typewriter.textContent = isDeleting 
    ? currentWord.substring(0, j--) 
    : currentWord.substring(0, j++);

  if (!isDeleting && j === currentWord.length + 1) {
    isDeleting = true;
    setTimeout(type, 1000); // pause before backspacing
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % words.length;
    setTimeout(type, 200);
  } else {
    setTimeout(type, isDeleting ? 100 : 200);
  }
}
type();

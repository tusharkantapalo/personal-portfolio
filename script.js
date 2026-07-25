function toggleAbout() {
  const moreText = document.getElementById("aboutMore");
  const btn = document.getElementById("aboutBtn");

  if (moreText.style.display === "block") {
    moreText.style.display = "none";
    btn.innerText = "Read More";
  } else {
    moreText.style.display = "block";
    btn.innerText = "Read Less";
  }
}

function toggleProject() {
  const moreText = document.getElementById("projectMore");
  const btn = document.getElementById("projectBtn");

  if (moreText.style.display === "block") {
    moreText.style.display = "none";
    btn.innerText = "Read More";
  } else {
    moreText.style.display = "block";
    btn.innerText = "Read Less";
  }
}

function toggleEducation() {
  const moreText = document.getElementById("eduMore");
  const btn = document.getElementById("eduBtn");

  if (moreText.style.display === "block") {
    moreText.style.display = "none";
    btn.innerText = "Read More";
  } else {
    moreText.style.display = "block";
    btn.innerText = "Read Less";
  }
}

/* Scroll reveal animation */
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => observer.observe(el));

/* Hero scroll effect */
const hero = document.querySelector(".hero");
const imageShape = document.querySelector(".image-shape");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 30) {
    hero.classList.add("scrolled");
  } else {
    hero.classList.remove("scrolled");
  }

  if (imageShape) {
    const move = Math.min(scrollY * 0.08, 25);
    imageShape.style.transform = `translateY(${-move}px) scale(${1 - Math.min(scrollY * 0.00025, 0.05)})`;
  }
});
/* =========================================================
   1. BACKGROUND FRAME SCROLL ANIMATION SYSTEM
   ========================================================= */
const totalFrames = 603;                     // frame_00000 to frame_00602
const frameFolder = 'scroll_animation';      // Frame folder name
const framePrefix = 'frame_';                // Frame file prefix
const frameExtension = '.jpg';               // JPG extension
const padDigits = 5;                         // 5 digits padding

const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

const images = [];
const videoFrames = { currentFrame: 0 };

function getFramePath(index) {
  const paddedIndex = index.toString().padStart(padDigits, '0');
  return `./${frameFolder}/${framePrefix}${paddedIndex}${frameExtension}`;
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);

  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    img,
    0, 0, img.width, img.height,
    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
  );
}

function preloadImages() {
  for (let i = 0; i < totalFrames; i++) {
    const img = new Image();
    img.src = getFramePath(i);

    if (i === 0) {
      img.onload = () => drawFrame(0);
    }
    images.push(img);
  }
}

function updateFrameOnScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  const scrollFraction = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  const frameIndex = Math.floor(scrollFraction * (totalFrames - 1));

  if (frameIndex !== videoFrames.currentFrame) {
    videoFrames.currentFrame = frameIndex;
    requestAnimationFrame(() => drawFrame(frameIndex));
  }
}

preloadImages();

/* =========================================================
   2. EXISTING PORTFOLIO FUNCTIONALITY
   ========================================================= */

/* Toggle functions for expand/collapse cards */
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

/* Scroll reveal animation for Section Cards */
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));

/* Smooth Photo Transition & Dynamic Transparency Effect */
const floatingPhoto = document.getElementById("floating-photo");
const sectionAnchors = Array.from(document.querySelectorAll(".photo-anchor"));
const heroImageContainer = document.querySelector(".hero-right");
const allCards = Array.from(document.querySelectorAll(".card"));

function updateFloatingPhotoPosition() {
  if (!floatingPhoto || sectionAnchors.length === 0) return;

  const scrollY = window.scrollY;

  // 1. Hide floating photo at the top so Hero photo renders naturally
  if (scrollY < 50) {
    floatingPhoto.classList.remove("visible");
    allCards.forEach((card) => (card.style.opacity = "1"));
    return;
  }

  floatingPhoto.classList.add("visible");

  // 2. Build list of ALL target anchors including the Hero image container
  const heroRect = heroImageContainer ? heroImageContainer.getBoundingClientRect() : null;
  const allTargets = [];

  if (heroRect) {
    allTargets.push({
      x: heroRect.left + (heroRect.width - 320) / 2,
      y: heroRect.top,
      centerY: heroRect.top + heroRect.height / 2,
    });
  }

  sectionAnchors.forEach((anchor) => {
    const rect = anchor.getBoundingClientRect();
    allTargets.push({
      x: rect.left,
      y: rect.top,
      centerY: rect.top + rect.height / 2,
    });
  });

  const viewportCenterY = window.innerHeight / 2;

  // 3. Find active segment between targets
  let activeIndex = 0;
  for (let i = 0; i < allTargets.length - 1; i++) {
    if (viewportCenterY >= allTargets[i].centerY) {
      activeIndex = i;
    }
  }

  const startTarget = allTargets[activeIndex];
  const endTarget = allTargets[activeIndex + 1];

  let currentX, currentY;

  if (endTarget) {
    const distance = endTarget.centerY - startTarget.centerY;
    const progress = Math.min(
      Math.max((viewportCenterY - startTarget.centerY) / distance, 0),
      1
    );

    currentX = startTarget.x + (endTarget.x - startTarget.x) * progress;
    currentY = startTarget.y + (endTarget.y - startTarget.y) * progress;
  } else {
    currentX = startTarget.x;
    currentY = startTarget.y;
  }

  // Position floating photo
  floatingPhoto.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

  // 4. Overlap & Card Transparency Logic
  const photoRect = {
    left: currentX,
    right: currentX + 320,
    top: currentY,
    bottom: currentY + 400,
  };

  allCards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();

    const isOverlapping =
      photoRect.right > cardRect.left &&
      photoRect.left < cardRect.right &&
      photoRect.bottom > cardRect.top &&
      photoRect.top < cardRect.bottom;

    if (isOverlapping) {
      const photoCenterY = photoRect.top + 200;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const maxDistance = (cardRect.height + 400) / 2;
      const actualDistance = Math.abs(photoCenterY - cardCenterY);

      const overlapRatio = Math.max(0, 1 - actualDistance / maxDistance);
      const targetOpacity = 1 - overlapRatio * 0.55;

      card.style.opacity = targetOpacity.toFixed(2);
    } else {
      card.style.opacity = "1";
    }
  });
}

/* Combined Scroll Handler for Canvas & Floating Photo */
let isTicking = false;
window.addEventListener("scroll", () => {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateFrameOnScroll();
      updateFloatingPhotoPosition();
      isTicking = false;
    });
    isTicking = true;
  }
});

window.addEventListener("resize", () => {
  drawFrame(videoFrames.currentFrame);
  updateFloatingPhotoPosition();
});

window.addEventListener("load", updateFloatingPhotoPosition);

/* NAVBAR SMOOTH SCROLL */
document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 80;

      let targetPosition;

      if (targetId === "#home") {
        targetPosition = 0;
      } else {
        const rect = targetElement.getBoundingClientRect();
        targetPosition = window.scrollY + rect.top - navbarHeight - 20;
      }

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      let scrollInterval = setInterval(() => {
        updateFloatingPhotoPosition();
        updateFrameOnScroll();
      }, 16);

      setTimeout(() => {
        clearInterval(scrollInterval);
        updateFloatingPhotoPosition();
        updateFrameOnScroll();
      }, 850);
    }
  });
});
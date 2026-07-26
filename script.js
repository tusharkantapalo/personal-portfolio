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

/* Throttle Scroll Handler for Smooth Performance */
let isTicking = false;
window.addEventListener("scroll", () => {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateFloatingPhotoPosition();
      isTicking = false;
    });
    isTicking = true;
  }
});

window.addEventListener("resize", updateFloatingPhotoPosition);
window.addEventListener("load", updateFloatingPhotoPosition);

/* PERFECT NAVBAR SMOOTH SCROLL & EXACT SECTION ALIGNMENT FIX */
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
        // Hero / Home section goes straight to top
        targetPosition = 0;
      } else {
        // Measure exact card/section offset relative to current scroll
        const rect = targetElement.getBoundingClientRect();
        
        // Align section top nicely below the sticky navbar with standard padding
        targetPosition = window.scrollY + rect.top - navbarHeight - 20;
      }

      // Smooth scroll to calculated section position
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      // Continuously recalculate photo position during scroll animation
      let scrollInterval = setInterval(() => {
        updateFloatingPhotoPosition();
      }, 16);

      // Final alignment check when scrolling stops
      setTimeout(() => {
        clearInterval(scrollInterval);
        updateFloatingPhotoPosition();
      }, 850);
    }
  });
});
/**
 * Bimro Tile - Home Page JavaScript
 * Depends on js/main.js being loaded first.
 */

document.addEventListener("DOMContentLoaded", function () {
  initHeroSlider();
  initBrandsCarousel();
});

/**
 * Hero slider: autoplay with crossfade, dot navigation, pauses on hover/hidden tab/out of view
 */
function initHeroSlider() {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.parentElement.querySelectorAll(".hero-dot"));
  if (slides.length < 2) return;

  let current = slides.findIndex(function (s) {
    return s.classList.contains("active");
  });
  if (current < 0) current = 0;
  let timer = null;
  let isInView = true;

  function goTo(index) {
    slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }

  function start() {
    stop();
    if (!isInView || document.hidden) return;
    timer = setInterval(next, 5000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      goTo(index);
      start();
    });
  });

  if (window.matchMedia("(hover: hover)").matches) {
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  var wasOutOfView = false;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        var entering = entries[0].isIntersecting;
        if (entering && wasOutOfView) {
          next();
        }
        wasOutOfView = !entering;
        isInView = entering;
        entering ? start() : stop();
      },
      { threshold: 0.2 }
    );
    observer.observe(slider);
  } else {
    start();
  }
}

/**
 * Brands carousel: infinite-loop clone-and-jump, pause on hover, prev/next arrows
 */
function initBrandsCarousel() {
  const wrapper = document.querySelector(".brands-wrapper");
  const track = document.querySelector(".brands-track");
  if (!wrapper || !track) return;

  const prevBtn = document.querySelector(".brands-prev");
  const nextBtn = document.querySelector(".brands-next");
  const originalItems = Array.from(track.children);
  if (originalItems.length === 0) return;

  // Clone the full set once on each side so the track can scroll seamlessly
  originalItems.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });
  originalItems
    .slice()
    .reverse()
    .forEach(function (item) {
      track.insertBefore(item.cloneNode(true), track.firstChild);
    });

  let itemWidth = 0;
  let position = 0;
  let autoplay = null;

  function measure() {
    itemWidth = track.children[0].getBoundingClientRect().width;
    position = itemWidth * originalItems.length;
    track.style.transform = "translateX(" + -position + "px)";
  }

  function step(direction) {
    track.style.transition = "transform 0.5s ease";
    position += direction * itemWidth;
    track.style.transform = "translateX(" + -position + "px)";
  }

  track.addEventListener("transitionend", function () {
    const min = itemWidth * originalItems.length * 0.5;
    const max = itemWidth * originalItems.length * 1.5;
    if (position <= min || position >= max) {
      track.style.transition = "none";
      position = itemWidth * originalItems.length;
      track.style.transform = "translateX(" + -position + "px)";
    }
  });

  function play() {
    stop();
    autoplay = setInterval(function () {
      step(1);
    }, 3000);
  }

  function stop() {
    if (autoplay) clearInterval(autoplay);
    autoplay = null;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      step(-1);
      play();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      step(1);
      play();
    });
  }
  wrapper.addEventListener("mouseenter", stop);
  wrapper.addEventListener("mouseleave", play);

  window.addEventListener("resize", measure);
  measure();
  play();
}

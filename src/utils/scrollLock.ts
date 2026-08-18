import { smoother } from "../components/Navbar";

export function lockPageScroll() {
  document.documentElement.classList.add("scroll-locked");
  document.body.classList.add("scroll-locked");

  if (smoother) {
    smoother.paused(true);
  }
}

export function unlockPageScroll() {
  document.documentElement.classList.remove("scroll-locked");
  document.body.classList.remove("scroll-locked");

  if (smoother) {
    smoother.paused(false);
  }
}

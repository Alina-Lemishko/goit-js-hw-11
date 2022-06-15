import getRefs from "./getRefs";
const refs = getRefs();
// Next we want to create a function that will be called when that element is intersected
export function callback(entries, observer) {
  // The callback will return an array of entries, even if you are only observing a single item
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Show button
      refs.scrollToTopBtn.classList.add("showBtn");
    } else {
      // Hide button
      refs.scrollToTopBtn.classList.remove("showBtn");
    }
  });
}

export function scrollToTop() {
  refs.rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



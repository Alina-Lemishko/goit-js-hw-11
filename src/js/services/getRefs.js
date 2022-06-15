export default function getRefs() {
  return {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    buttonLoadMore: document.querySelector('.load-more'),
    photoСard: document.querySelector('.photo-card'),
    searchBtn: document.querySelector('.search_btn'),
    loader: document.querySelector('.js-loader'),
    paginationContainer: document.querySelector('#tui-pagination-container'),
    target: document.querySelector("footer"),
    scrollToTopBtn: document.querySelector(".scrollToTopBtn"),
    rootElement: document.documentElement,
  }
}
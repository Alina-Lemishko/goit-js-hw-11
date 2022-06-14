// Imports
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import SearchPicsService from "./js/services/searchPicsApi";
import getRefs from "./js/services/getRefs";
import { renderMarkup } from "./js/renderMarkup";
import { LoadMoreBtn } from "./js/services/loadMoreBtn";

const searchPicsService = new SearchPicsService();
const refs = getRefs();
let gallery = null;

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  className: 'is-hidden',
  isHide: true,
  callback: () => loadPictures().catch(err => console.log(err))
})

// Listeners
refs.searchForm.addEventListener('submit', onSearch);
refs.searchForm.addEventListener('input', onInput);
refs.gallery.addEventListener('click', onClick)

refs.searchBtn.disabled = true;

function onClick(e) {
  e.preventDefault()
}
// Function on Input change
function onInput(e) {
  let inputValue = e.target.value;
  
  if (inputValue.length >= 1) {
    refs.searchBtn.disabled = false;
  }
}

// Function on Search
function onSearch(e) {
  e.preventDefault()
  refs.gallery.innerHTML = '';
  
  searchPicsService.query = e.currentTarget.elements.searchQuery.value.trim();
  
  if (searchPicsService.query === '') {
    return Notiflix.Notify.warning('Please enter a keyword to search.');
  }
  searchPicsService.resetPage();
  loadPictures();
  // const infiniteScroll = new IntersectionObserver(handleIntersecting, options);
  // infiniteScroll.observe(refs.loader);
}

// Function for loading pictures
export async function loadPictures() {
  const { hits, hasNextPage } = await searchPicsService.fetchPics();
  loadMoreBtn.show();
  
  refs.buttonLoadMore.disabled = false;
  
  if (hasNextPage) {
    loadMoreBtn.hide();
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  
  renderMarkup(hits);
  gallery = new SimpleLightbox('.photo-card a');
}

//Infinity scroll function

// Options anf function for infinity scroll
  // const options = {
  //   root: null,
  //   rootMargin: '0px',
  //   threshold: 0.5,
  // };

  // function handleIntersecting(entries, observer) {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       searchPicsService.fetchPics().then(({ hits, hasNextPage }) => {
    
  //         if (hasNextPage) {
  //           observer.unobserve(entry.target);
  //           Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  //         }
    
  //         renderMarkup(hits);
  //       })
  //     }
  //   })
  //   }
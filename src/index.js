// Imports
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import SearchPicsService from "./js/services/searchPicsApi";
import getRefs from "./js/services/getRefs";
import { renderMarkup } from "./js/renderMarkup";
// import { LoadMoreBtn } from "./js/services/loadMoreBtn";
import { VisibleComponent } from './js/components/visibleComponent';

const searchPicsService = new SearchPicsService();
const refs = getRefs();
let gallery = null;

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.load-more',
//   className: 'is-hidden',
//   isHide: true,
//   callback: async () => {
//     try {
//       const loadingData = loadPictures();
//       const refreshGallery = await gallery.destroy()
//       return;
//     } catch (error) {
//       console.log(error)
//     }
//   }
// })


const pagination = new Pagination(refs.paginationContainer, {
    totalItems: 0,
    itemsPerPage: 40,
    visiblePages: 5
});

const paginationWrapper = new VisibleComponent({
  selector: '.pagination-wrapper',
  className: 'is-hidden',
  isHide: true,
})

paginationWrapper.hide();

// Listeners
refs.searchForm.addEventListener('submit', onSearch);
refs.searchForm.addEventListener('input', onInput);
pagination.on('afterMove', movePagination); // Listener for pagination

refs.searchBtn.disabled = true;

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
  
  if (!searchPicsService.query) {
    Notiflix.Notify.warning('Please enter a keyword to search.');
    return;
  }

  searchPicsService.resetPage();
  loadPictures();
  
  // const infiniteScroll = new IntersectionObserver(handleIntersecting, options);
  // infiniteScroll.observe(refs.loader);
}

// Function for loading pictures
export async function loadPictures() {
  const { hits, totalHits, hasNextPage } = await searchPicsService.fetchPics();
  // loadMoreBtn.show();
  // loadMoreBtn.hide();

  // refs.buttonLoadMore.disabled = false;

  if (totalHits === 0 || hits.length === 0) {
    paginationWrapper.hide();
  }

  paginationWrapper.show();
  pagination.reset(totalHits);
  
  if (hasNextPage) {
    // loadMoreBtn.hide();
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  
  renderMarkup(hits);
  gallery = new SimpleLightbox('.photo-card a', {overlayOpacity: 0.8, captionPosition: 'bottom', captionType: 'attr', captionDelay: 250 });
}

async function movePagination(event) {
  try {
    searchPicsService.pageQuery = event.page;
    refs.gallery.innerHTML = '';

    const { hits } = await searchPicsService.fetchPics();
    renderMarkup(hits);

    gallery = new SimpleLightbox('.photo-card a', {overlayOpacity: 0.8, captionPosition: 'bottom', captionType: 'attr', captionDelay: 250 });
  } catch (error) {
    Notiflix.Notify.failure(error.message)
  }
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
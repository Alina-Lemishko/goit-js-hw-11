import axios from 'axios';
import Notiflix from 'notiflix';
import getRefs from './getRefs';

const refs = getRefs()
const API_KEY = '27935706-58376e41d3c547772de5a9830';
axios.defaults.baseURL = 'https://pixabay.com/api';


export default class SearchPicsService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPage = 0;
    this.params = new URLSearchParams({
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
    })
  }
  
  async fetchPics() {
    try {
      const response = await axios.get(`/?${this.params}&q=${this.searchQuery}&page=${this.page}`);
      const { hits, totalHits } = response.data;
      
      this.totalPage = Math.ceil(totalHits / this.perPage);

      if (hits.length === 0) {
        refs.gallery.innerHTML = '';
        refs.buttonLoadMore.disabled = true;
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
        return;
      }

      if (this.page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
      }

      this.incrementPage();

      return {
        hits,
        hasNextPage: this.page > this.totalPage,
      }

    } catch (error) {
      console.log('error', error.message)
    }
  }
  
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

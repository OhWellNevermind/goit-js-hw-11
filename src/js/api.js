import axios from 'axios';
import Notiflix from 'notiflix';
import { elements } from './htmlElements';

const API_KEY = '38376053-36f58a073519ff95a963b2d32';
const BASE_URL = 'https://pixabay.com/api/';
const IMG_COUNT = 40;

async function fetchImages(url) {
  try {
    const response = axios.get(url);
    const data = (await response).data;

    if (!data.hits.length) {
      elements.gallery.innerHTML = '';
      elements.loadBtn.classList.add('hidden');
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return { data: data.hits, totalHits: data.totalHits };
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function generatePixabayURL(query, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: IMG_COUNT,
    page,
  });
  return `${BASE_URL}?${params}`;
}

export { fetchImages, generatePixabayURL, IMG_COUNT };

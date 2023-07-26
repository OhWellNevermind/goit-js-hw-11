import axios from 'axios';
import Notiflix from 'notiflix';
import { elements } from './htmlElements';

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

export { fetchImages };

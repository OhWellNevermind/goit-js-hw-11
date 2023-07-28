import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createMarkUp } from './js/markup';
import { elements } from './js/htmlElements';

const API_KEY = '38376053-36f58a073519ff95a963b2d32';
const BASE_URL = 'https://pixabay.com/api/';
const IMG_COUNT = 40;
let page = 0;
elements.form.addEventListener('submit', hadleSubmit);
elements.loadBtn.addEventListener('click', handleLoadClick);

function handleLoadClick() {
  const userQuery = elements.input.value;
  const url = generatePixabayURL(userQuery);
  page += 1;
  fetchImages(url)
    .then(({ data, totalHits }) => {
      if (Math.ceil(page > totalHits / IMG_COUNT)) {
        elements.loadBtn.classList.add('hidden');
      }
      return data.map(image => {
        return {
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
          tags: image.tags,
          likes: image.likes,
          views: image.views,
          comments: image.comments,
          downloads: image.downloads,
        };
      });
    })
    .then(images => {
      const html = createMarkUp(images);
      elements.gallery.insertAdjacentHTML('beforeend', html);

      elements.lightbox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    });
}

function generatePixabayURL(query) {
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

function hadleSubmit(event) {
  event.preventDefault();
  page = 1;
  const userQuery = elements.input.value;
  if (!userQuery.trim()) {
    Notiflix.Notify.failure('Please enter something!');
    elements.gallery.innerHTML = '';
    return;
  }
  const url = generatePixabayURL(userQuery);
  fetchImages(url)
    .then(({ data, totalHits }) => {
      if (Math.ceil(page < totalHits / IMG_COUNT)) {
        elements.loadBtn.classList.remove('hidden');
      }

      Notiflix.Notify.success(`We found total ${totalHits} images!`);
      return data.map(image => {
        return {
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
          tags: image.tags,
          likes: image.likes,
          views: image.views,
          comments: image.comments,
          downloads: image.downloads,
        };
      });
    })
    .then(images => {
      const html = createMarkUp(images);

      elements.gallery.innerHTML = '';
      elements.gallery.insertAdjacentHTML('beforeend', html);

      elements.lightbox.refresh();
    })
    .catch(error => {
      return;
    });
  page = 2;
}

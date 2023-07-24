import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const API_KEY = '38376053-36f58a073519ff95a963b2d32';
const BASE_URL = 'https://pixabay.com/api/';
const IMG_COUNT = 40;
let page = 0;

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.form-input'),
  loadBtn: document.querySelector('.load-more'),
};

elements.form.addEventListener('submit', hadleSubmit);
elements.loadBtn.addEventListener('click', handleLoadClick);
let lightbox = new SimpleLightbox('.gallery a');
function handleLoadClick() {
  const userQuery = elements.input.value;
  const url = generatePixabayURL(userQuery);
  console.log(url);
  page += 1;
  fetchImages(url)
    .then(data => {
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

      Notiflix.Notify.success(`Here is your images! Find the best one;)`);
      elements.gallery.insertAdjacentHTML('beforeend', html);

      lightbox = lightbox.refresh();
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
  const url = generatePixabayURL(userQuery);
  fetchImages(url)
    .then(data => {
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

      Notiflix.Notify.success(`Here is your images! Find the best one;)`);
      elements.gallery.innerHTML = '';
      elements.gallery.insertAdjacentHTML('beforeend', html);

      lightbox = lightbox.refresh();
    });
  page = 2;
  elements.loadBtn.classList.remove('hidden');
}

async function fetchImages(url) {
  try {
    const response = axios.get(url);
    const data = (await response).data;
    if (!data.hits.length) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return data.hits;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function createMarkUp(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <li class="photo-card">
              <a class="gallery__link" href="${largeImageURL}">
                  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
              </a>
              <div class="info">
                  <p class="info-item">
                  <b>Likes: </b>${likes}
                  </p>
                  <p class="info-item">
                  <b>Views: </b>${views}
                  </p>
                  <p class="info-item">
                  <b>Comments: </b>${comments}
                  </p>
                  <p class="info-item">
                  <b>Downloads: </b>${downloads}
                  </p>
              </div>
            </li>`;
      }
    )
    .join('');
}

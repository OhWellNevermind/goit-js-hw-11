import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const API_KEY = '38376053-36f58a073519ff95a963b2d32';
const BASE_URL = 'https://pixabay.com/api/';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.form-input'),
};

elements.form.addEventListener('submit', async event => {
  event.preventDefault();
  const userQuery = elements.input.value;
  const params = {
    key: API_KEY,
    q: userQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  };
  const paramsString = new URLSearchParams(params).toString();
  console.log(paramsString);
  const url = `${BASE_URL}?${paramsString}`;
  await fetchImages(url)
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
      const lightbox = new SimpleLightbox('.gallery a');
      let infScroll = new InfiniteScroll('.container', {
        path: '`https://pixabay.com/api/?key=38376053-36f58a073519ff95a963b2d32&q=${userQuery}&image_type=photo&orientation=horizontal&safesearch=true`',
      });
      infScroll.loadNextPage();
    });
});

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

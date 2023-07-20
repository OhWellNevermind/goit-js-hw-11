import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '38376053-36f58a073519ff95a963b2d32';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.form-input'),
};

elements.form.addEventListener('submit', event => {
  event.preventDefault();
  const userQuery = elements.input.value;
  const url = `https://pixabay.com/api/?key=38376053-36f58a073519ff95a963b2d32&q=${userQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
  const images = fetchImages(url)
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
      images
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
            <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
            </div>`;
          }
        )
        .join();
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

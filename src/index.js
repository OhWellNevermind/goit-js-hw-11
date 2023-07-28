import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, generatePixabayURL, IMG_COUNT } from './js/api';
import { createMarkUp } from './js/markup';
import { elements } from './js/htmlElements';

let page = 0;
elements.form.addEventListener('submit', hadleSubmit);
elements.loadBtn.addEventListener('click', handleLoadClick);

function handleLoadClick() {
  const userQuery = elements.input.value;
  page += 1;
  const url = generatePixabayURL(userQuery, page);
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

function hadleSubmit(event) {
  event.preventDefault();
  page = 1;
  const userQuery = elements.input.value;
  if (!userQuery.trim()) {
    Notiflix.Notify.failure('Please enter something!');
    elements.gallery.innerHTML = '';
    return;
  }
  const url = generatePixabayURL(userQuery, page);
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

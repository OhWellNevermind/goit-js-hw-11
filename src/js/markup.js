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
            <div class="photo-card-div">
<div class="img-back">
                 <a class="gallery__link" href="${largeImageURL}">
                      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                  </a>
</div>
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
              </div>
            </li>`;
      }
    )
    .join('');
}

export { createMarkUp };

'use strict';

function Image (imageItem) {
  this.name = imageItem.title;
  this.image_url = imageItem.image_url;
  this.description = imageItem.description;
  this.keyword = imageItem.keyword;
  this.count = imageItem.horns;
}

Image.allImages = [];

Image.prototype.render = function () {
  $('main').append('<section class="clone"><section>');
  const $imageClone = $('section[class="clone"]');
  const $imageHtml = $('#photo-template').html();
  $imageClone.html($imageHtml);

  $imageClone.find('h2').text(this.name);
  $imageClone.find('img').attr('src', this.image_url);
  $imageClone.find('p').text(this.description);
  $imageClone.removeClass('clone');
  $imageClone.addClass(this.keyword);
}

Image.readJson = () => {
  $.get('data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item));
      })
    })
    .then(Image.loadImage);
}

Image.loadImage = () => {
  Image.allImages.forEach(item => item.render());
}

$(() => Image.readJson());

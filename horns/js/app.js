'use strict';

function Image (imageItem) {
  this.name = imageItem.title;
  this.image_url = imageItem.image_url;
  this.description = imageItem.description;
  this.keyword = imageItem.keyword;
  this.count = imageItem.horns;
}

Image.allImages = [];
Image.allKeywords = [];

Image.prototype.render = function () {
  const $template = $('#photo-template').html();
  const source = Handlebars.compile($template);
  return source(this);
}

Image.readJson = (file) => {
  $.get(file, 'json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item));
      })
      Image.allImages.sort(Image.compareNames);
    })
    .then(Image.loadImage)
    .then(Image.keywordExtractor)
    .then(Image.populateDropDown);
}

Image.loadImage = () => {
  Image.allImages.forEach(item => $('#photo').append(item.render()));
}

Image.keywordExtractor = () => {
  Image.allImages.forEach(element => {
    if (Image.allKeywords.indexOf(element.keyword) === -1){
      Image.allKeywords.push(element.keyword);
    }
    Image.allKeywords.sort();
  })
}

Image.populateDropDown = () => {
  Image.allKeywords.forEach(element => {
    $('select').append(`<option value="${element}">${element}</option>`);
  })
}

Image.reset = () => {
  $('#photo').html('');
  $('select').html('<option value="default">Filter by Keyword</option>');
  Image.allImages = [];
  Image.allKeywords = []
}

Image.compareNames = (a, b) => {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

Image.compareHorns = (a, b) => {
  if (a.count < b.count)
    return -1;
  if (a.count > b.count)
    return 1;
  return 0;
}

//EVENT LISTENERS
$(() => Image.readJson('data/page-1.json'));

$('select').on('change', () => {
  let $input = $('select').val();
  Image.allKeywords.forEach(element => {
    if (element === $input){
      $(`.${$input}`).show();
    } else if ($input === 'default'){
      $(`.${element}`).show();
    } else {
      $(`.${element}`).hide();
    }
  })
});

$('.page-links').on('click', () => {
  console.log(event.target.id);
  if (event.target.id === 'p2'){
    Image.reset();
    Image.readJson('data/page-2.json');
  } else if (event.target.id === 'p1'){
    Image.reset();
    Image.readJson('data/page-1.json')
  } else if (event.target.id === 'horns'){
    $('#photo').html('');
    Image.allImages.sort(Image.compareHorns);
    Image.loadImage();
  } else {
    $('#photo').html('');
    Image.allImages.sort(Image.compareNames);
    Image.loadImage();
  }
});

$('#search').on('keypress',() =>{
  let $search = $('input').val();

  Image.allImages.forEach(element => {
    if (element.name.match($search) !== null || element.keyword.match($search) !== null){
      $(`.${element.keyword}`).show();
    } else {
      $(`.${element.keyword}`).hide();
    }
  })
});

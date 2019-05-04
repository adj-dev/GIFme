const topics = [
  'awesome',
  'funny',
  'dogs',
  'cats',
  'pie',
  'happy',
  'sad',
  'turtle',
  'horse',
  'snowboarding',
  'sitcom'
]

function populateButtons() {
  for (const topic of topics) {
    let btn = $('<button>');
    btn.addClass('topic')
    btn.text(topic);
    $('.topics').append(btn);
  }
}

function fetchGIFS() {
  const topic = $(this).text();

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=sJgUHeIfp2hdiI5tURDzwlVLFT6PM9lH&limit=10`,
    "method": "GET",
    "headers": {}
  }

  $.ajax(settings).then(function (response) {
    let data = response.data;
    let gifs = [];
    for (const item of data) {
      gifs.push({
        gifSource: item.images.original.url,
        imgSource: item.images.original_still.url,
      });
    }
    renderGIFS(gifs);
  });
}

function renderGIFS(gifs) {
  $('.gif-container').empty();
  for (const gif of gifs) {
    let img = $('<img>');
    img.addClass('gif');
    img.attr({ "src": gif.imgSource, "data-gif": gif.gifSource, "data-img": gif.imgSource, "data-state": "still" });
    $('.gif-container').append(img);
  }
}

function toggleGIF() {
  const gif = $(this);
  if (gif.attr('data-state') === 'still') {
    gif.attr('src', gif.attr('data-gif'));
    gif.attr('data-state', 'animated');
  } else {
    gif.attr('src', gif.attr('data-img'));
    gif.attr('data-state', 'still');
  }
}

// On load
$(function () {
  // Populate buttons from topics
  populateButtons();

  // Button click handler --> GIF click handler
  $(document).on('click', '.topic', fetchGIFS).on('click', '.gif', toggleGIF);
});
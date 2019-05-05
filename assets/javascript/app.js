const topics = [
  'awesome',
  'funny',
  'dogs',
  'cats',
  'pie',
  'turtle',
  'horse',
  'snowboarding',
  'sitcom'
]

function populateButtons() {
  $('.buttons').empty();

  for (const topic of topics) {
    let btn = $('<button>');
    let i = $('<i>');
    btn.addClass('topic');
    i.addClass('fas fa-times');
    btn.text(topic);
    btn.append(i);
    $('.buttons').append(btn);
  }
}

function addButton() {
  let newTopic = $('input').val();
  if (newTopic) {
    topics.push(newTopic.toLowerCase());
    populateButtons();
  }
  $('input').val('');
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
        gifSource: item.images.fixed_height.url,
        imgSource: item.images.fixed_height_still.url,
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

  // Handle clicks
  $(document)
    .on('click', '.topic', fetchGIFS) // Handle topic buttons
    .on('click', '.gif', toggleGIF) // Handle GIFs
    .on('click', '.add-button', addButton) // Handle "add button" button

  // Handle input upon keydown of Enter key
  $('input').keydown((e) => {
    if (e.which === 13) {
      addButton();
    }
  });
});
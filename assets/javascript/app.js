const topics = [
  'awesome',
  'funny',
  'dogs',
  'cats'
]

function populateButtons() {
  $('.buttons').empty();

  for (const topic of topics) {
    let div = $('<div>');
    div.addClass('button');
    let btn = $('<button>');
    let i = $('<i>');
    btn.addClass('topic');
    i.addClass('fas fa-times');
    btn.text(topic);
    div.append(btn).append(i);
    $('.buttons').prepend(div);
  }
}

function addButton() {
  let newTopic = $('input').val().toLowerCase();
  let duplicate = false;
  if (newTopic) {
    for (let topic of topics) {
      if (topic === newTopic) {
        duplicate = true;
      }
    }
    if (!duplicate) {
      topics.push(newTopic);
      populateButtons();
      fetchGIFS(newTopic, false);
    }
  }
  $('input').val('');
}

function removeButton() {
  let topic = $(this).parent().text();
  for (let i = 0; i < topics.length; i++) {
    if (topics[i] === topic) {
      topics.splice(i, 1);
      i--;
    }
  };
  populateButtons();
}

let recentTopic;
let offset = 0;

function fetchGIFS(e, arg) {
  let topic;

  if (typeof e === 'string') {
    topic = e;
  } else {
    topic = $(e).text().trim();
  }

  if (topic == 'MORE') {
    topic = recentTopic;
  }


  if (topic === recentTopic) {
    offset += 10;
  } else {
    offset = 0;
  }

  recentTopic = topic;

  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.giphy.com/v1/gifs/search?q=${topic}&offset=${offset}&api_key=sJgUHeIfp2hdiI5tURDzwlVLFT6PM9lH&limit=10&rating=pg`,
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
    if (!arg) {
      renderGIFS(gifs, false);
    } else {
      renderGIFS(gifs, true);
    }
  });
}

function renderGIFS(gifs, repeat) {
  if (!repeat) {
    $('.gif-container').empty();
  }

  for (const gif of gifs) {
    let img = $('<img>');
    img.addClass('gif');
    img.attr({ "src": gif.imgSource, "data-gif": gif.gifSource, "data-img": gif.imgSource, "data-state": "still" });
    $('.gif-container').append(img);
  }

  // Reveal "load more gifs" button
  $('.add-gifs').css('display', 'flex');
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

let toggled = false;

function toggleButtonColor() {
  let parentElement = $(this).parent();
  let button = parentElement.children('.topic');
  if (!toggled) {
    button.css({ 'background-color': 'rgb(38, 201, 193)' });
    toggled = true;
  } else {
    button.css({ 'background-color': 'rgb(96, 226, 165)' });
    toggled = false;
  }
};

// On load
$(function () {
  // Populate buttons from topics
  populateButtons();

  // Handle clicks
  $(document)
    .on('click', '.topic', e => {
      fetchGIFS(e.target, false);
    }) // Handle topic buttons
    .on('click', '.gif', toggleGIF) // Handle GIFs
    .on('click', '.add-button', addButton) // Handle "add button" button
    .on('click', '.button i', removeButton) // Handle "remove button" 
    .on('click', '.more', e => {
      fetchGIFS($(e.target), true);
    });

  // Sticky menu
  let headerHeight = $('.header').outerHeight(true);
  $(window).scroll(() => {
    if ($(this).scrollTop() > headerHeight) {
      $('.menu').addClass('sticky');
      $('.gif-container').addClass('increased-margin');
    } else {
      $('.menu').removeClass('sticky');
      $('.gif-container').removeClass('increased-margin');
    }
  });

  // Handle input upon keydown of Enter key
  $('input').keydown(e => {
    if (e.which === 13) {
      addButton();
    }
  });
});

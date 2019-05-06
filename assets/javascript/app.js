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
  let newTopic = $('input').val();
  if (newTopic) {
    topics.push(newTopic.toLowerCase());
    populateButtons();
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
    .on('click', '.topic', fetchGIFS) // Handle topic buttons
    .on('click', '.gif', toggleGIF) // Handle GIFs
    .on('click', '.add-button', addButton) // Handle "add button" button
    .on('click', '.button i', removeButton); // Handle "remove button" 

  // Handle input upon keydown of Enter key
  $('input').keydown(e => {
    if (e.which === 13) {
      addButton();
    }
  });
});










// //  EXPERIMENTAL SHHTUF BELOW!!!! WATCH YOUR STEP

// function getButtonsTotalWidth() {
//   let allButtons = [...$('.button')];
//   console.log(allButtons);
//   let totalWidth = 0;

//   allButtons.forEach(button => {
//     totalWidth += $(button).outerWidth(true);
//   });

//   console.log(totalWidth);
// }

//   // Started messing with horizontal scrolling feature - to use this again throw it back into the document.ready function
//   $(window).resize(e => {
//     let divWidth = $('.buttons').outerWidth();
//     console.log(divWidth);

//   });


//   getButtonsTotalWidth();
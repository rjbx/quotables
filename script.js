/* 
This page uses code from the codepen at
https://codepen.io/freeCodeCamp/pen/qRZeGZ
attributed to Gabriel Nunes with modification by Todd Chaffee to use Camper gist for JSON Quote data.
*/
let quotesData;

function inIframe() {try {return window.self !== window.top;} catch (e) {return true;}}

var currentQuote = '',currentAuthor = '';
function openURL(url) {
  window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}

function loadQuoteData() {
  return $.ajax({
    headers: {
      Accept: "application/json" },

    url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
    success: function (jsonQuotes) {
      if (typeof jsonQuotes === 'string') {
        quotesData = sanitizeQuoteData(JSON.parse(jsonQuotes).quotes);
      }
    } });

}

function sanitizeQuoteData(data) {
  newData = [];
  data.map((value, index, array) => {
    let author = value.author.replace(/^(\W)[^\w]*/, '');
    let nocaseAuthor = new RegExp(author, "i");
    let quote = [value.quote];
    data[index].author = author;
    if (newData.findIndex(a => nocaseAuthor.test(a.author)) == -1) {
      newData.push({ author: author, quote: [quote] });
    } else {
      let i = newData.findIndex(a => nocaseAuthor.test(a.author));
      newData[i].quote.push(quote);
    }
  });
  newData.sort((a, b) => a.author.localeCompare(b.author));
  return newData;
}

function loadAuthorMenu() {
  let options = [
  "<option value='author-default'>the winds of chance</option>",
  ...quotesData.map((value, index, array) => {
    let info = value.quote.length > 1 ?
    " (" + value.quote.length + ")" : '';
    let html =
    "<option class='author-option' value='author-" + index + "'>" +
    value.author + info + "</option>";
    return html;
  })];

  $('#author-select').html(options);
}

function loadQuoteDisplay(data) {
  console.log(data.quote);
  let currentQuote = data.quote[
  Math.floor(Math.random() * data.quote.length)];

  console.log(currentQuote);
  let currentAuthor = data.author;

  if (inIframe())
  {
    $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
  }

  $('#text').text(currentQuote);
  $('#author').html(currentAuthor);
}

function getRandomQuote() {
  return quotesData[Math.floor(Math.random() * quotesData.length)];
}

$(document).ready(function () {
  loadQuoteData().then(() => {
    loadAuthorMenu();
    loadQuoteDisplay(getRandomQuote());
  });

  $('#author-select').on('change', () => {
    let val = $('#author-select option:selected').val();
    let index = parseInt(val.match(/\d+/g));
    let data = quotesData[index];
    console.log(data);
    loadQuoteDisplay(data);
  });

  $('#new-quote').on('click', () => {
    $('#author-select').val('author-default');
    loadQuoteDisplay(getRandomQuote());
  });

  $('#tweet-quote').on('click', function () {
    if (!inIframe()) {
      openURL('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
    }
  });
});
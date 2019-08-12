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

function fetchQuoteData() {
  return $.ajax({
    headers: {
      Accept: "application/json" },

    url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
    success: function (jsonQuotes) {
      if (typeof jsonQuotes === 'string') {
        quotesData = JSON.parse(jsonQuotes);
      }
    } });

}

function loadAuthorMenu() {
  let authorOptions = ["<option value='author-default' hidden selected disabled>any author</option>", ...quotesData.quotes.map((value, index, array) => "<option value='author" + index + "'>" + value.author + "</option>")];
  $('#author-select').html(authorOptions);
}

function loadQuoteDisplay(quoteData) {
  console.log(quoteData);
  currentQuote = quoteData.quote;
  currentAuthor = quoteData.author;

  if (inIframe())
  {
    $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
  }

  $('#text').text(quoteData.quote);
  $('#author').html(quoteData.author);
}

function getRandomQuote() {
  return quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
}

function getAuthorQuote(author) {
  console.log(author);
  let authorQuotes = quotesData.quotes.filter((value, index, array) => author == value.author);
  let authorQuote = authorQuotes[Math.floor(Math.random() * authorQuotes.length)];
  console.log(authorQuote);
  return authorQuote;
}

$(document).ready(function () {
  fetchQuoteData().then(() => {
    loadAuthorMenu();
    loadQuoteDisplay(getRandomQuote());
  });

  $('#author-select').on('change', () => {
    let author = $('#author-select option:selected').text();
    loadQuoteDisplay(
    getAuthorQuote(author));

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
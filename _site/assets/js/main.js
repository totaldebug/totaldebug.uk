/**
 * Main JS file for theme behaviours
 */

// Responsive video embeds
var videoEmbeds = [
  'iframe[src*="youtube.com"]',
  'iframe[src*="vimeo.com"]'
];
reframe(videoEmbeds.join(','));

// Mobile menu
var menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function(e){
    document.body.classList.toggle('menu--opened');
    e.preventDefault();
  },false);
  document.body.classList.remove('menu--opened');
}

// Back to top
document.querySelector('#to-top').addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('#page').scrollIntoView({ behavior: 'smooth' });
});

$(document).on('ready', function(){
  loadSearch()
})

function loadSearch(){
  idx = lunr(function(){
    this.field('id')
    this.field('title', { boost: 10 })
    this.field('summary')
  })

  $.getJSON('/content.json', function(data){
    window.searchData = data
    $.each(data, function(index, entry){
      idx.add($.extend({"id": index}, entry))
    })
  })

  $('#search').on('click', function(){
    $('.searchForm').toggleClass('show')
  })

  $('#searchForm').on('submit', function(e){
    e.preventDefault()

    results = idx.search($('#searchField').val())

    $('#content').html('<h1>Search Results (' + results.length + ')</h1>')
    $('#content').append('<ul id="searchResults"></ul>')

    $.each(results, function(index, result){
      entry = window.searchData[result.ref]
      $('#searchResults').append('<li><a href="' + entry.url + '">' + entry.title + '</li>')
    })
  })
}

(function () {
  var coleccion = new URLSearchParams(location.search).get('coleccion');
  location.replace(coleccion === 'me' ? 'me-collection.html' : 'pdm-collection.html');
})();

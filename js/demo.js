$(document).ready(function () {
  $('.ui.dropdown').dropdown();
  $('.ui.checkbox').checkbox();
  $('.ui.accordion').accordion({
    collapsible: false
  });
  $('.ui.rating').rating();

  $('#logs').sticky({
    context: '#logs-context',
    offset: 64,
    bottomOffset: 64
  });

  var map = L.map('map-example').setView([42.3601, -71.0589], 13);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
});

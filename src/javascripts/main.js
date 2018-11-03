function initializeMap () {
  console.log('initializeMap');
  var myLatlng = new google.maps.LatLng(45.772836, 4.862455)
  var mapOptions = {
    zoom: 16,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
  new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Yuzu tech.\n06 73 91 04 45'
  })
}

var initializeMenu = function () {
  console.log('initializeMenu');
// Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        var target = el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeMenu()
});

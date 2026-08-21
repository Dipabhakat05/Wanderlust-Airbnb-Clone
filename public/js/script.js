'use strict';

if (document.getElementById('map') && typeof coordinates !== 'undefined') {
  // GeoJSON uses [longitude, latitude]; Leaflet requires [latitude, longitude]
  const lng = coordinates[0];
  const lat = coordinates[1];

  // 1. Initialize Map
  const map = L.map('map').setView([lat, lng], 13);

  // 2. Add OpenStreetMap Tile Layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // 3. Add Marker for listing coordinates
  const marker = L.marker([lat, lng]).addTo(map);

  // 4. Add Listing Popup
  marker.bindPopup(`
    <div style="font-size: 14px;">
      <b>${listing.title}</b>
      <p style="margin: 4px 0 0 0;">${listing.location}</p>
      <small style="color: gray;">Exact location provided after booking.</small>
    </div>
  `).openPopup();
}


(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
Browser 
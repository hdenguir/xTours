/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaGFmMmNvbSIsImEiOiJjazFrcjAweTAxMG54M2twZzJtamYyZ2w4In0.pFQ7CtYOjlocHanmXXFajQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/haf2com/ck1kr6f120aew1cmkni35i5kl',
    scrollZoom: false,
    //center: [34.111745, -89.113491],
    //zoom: 10,
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

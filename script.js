document.addEventListener('DOMContentLoaded', () => {
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

  const mapContainer = document.getElementById('map-container');
  if (mapContainer) {
    const map = new maplibregl.Map({
      container: 'map-container',
      style: { version: 8, sources: { 'osm-tiles': { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© OpenStreetMap' } }, layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }] },
      center: [34.9015, 32.1055], zoom: 13.5
    });
    map.addControl(new maplibregl.NavigationControl());
    new maplibregl.Marker({ color: '#0284C7' }).setLngLat([34.9015, 32.1055]).addTo(map);
  }

  const lookupForm = document.getElementById('plate-lookup-form');
  if (lookupForm) {
    lookupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const plate = document.getElementById('plate-input').value.replace(/\D/g, '');
      const loading = document.getElementById('lookup-loading');
      const resultCont = document.getElementById('lookup-result');
      const errorCont = document.getElementById('lookup-error');
      loading.classList.remove('hidden');
      resultCont.classList.add('hidden');
      errorCont.classList.add('hidden');

      try {
        const res = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&filters=${encodeURIComponent(JSON.stringify({ mispar_rechev: parseInt(plate, 10) }))}`);
        const data = await res.json();
        if (data.result.records.length > 0) {
          const record = data.result.records[0];
          document.getElementById('car-title').textContent = `${record.tozeret_nm} ${record.kinuy_mishari}`;
          document.getElementById('car-year').textContent = record.shnat_yitzur;
          document.getElementById('car-color').textContent = record.tzeva_rechev;
          document.getElementById('car-test-expiry').textContent = record.tokef_dt;
          resultCont.classList.remove('hidden');
        } else {
          throw new Error('הרכב לא נמצא במאגר.');
        }
      } catch (err) {
        errorCont.textContent = err.message;
        errorCont.classList.remove('hidden');
      } finally {
        loading.classList.add('hidden');
      }
    });
  }
});
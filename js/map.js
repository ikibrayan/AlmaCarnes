function initMap() {
  const defaultCoords = { lat: 4.711, lng: -74.0721 }; // Bogotá, por ejemplo

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: defaultCoords,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#1b1f34" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#1b1f34" }] },
    ]
  });

  const marker = new google.maps.Marker({
    position: defaultCoords,
    map: map,
    title: "Tu ubicación"
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        marker.setPosition(pos);
      },
      () => console.warn("No se pudo obtener la ubicación.")
    );
  } else {
    console.warn("Navegador no soporta geolocalización.");
  }
}

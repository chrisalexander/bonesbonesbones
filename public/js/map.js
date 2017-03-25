function Map() {
    var map = undefined;
    var auth = undefined;

    this.init = () => {
        map = new google.maps.Map(document.querySelector("#map"), {
            center: { lat: 51.318998, lng: -0.678466 },
            zoom: 12,
            scrollwheel: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: true,
            fullscreenControl: false
        });

        auth = new Auth();
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(auth.getContainer());
    };
}

var map = new Map();
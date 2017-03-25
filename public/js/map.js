function Map() {
    var defaultLocation = { lat: 51.512416, lng: -0.114123};

    var map = undefined;
    var auth = undefined;

    var updateLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => handleLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () =>  handleLocationError("Geo API errored")
            );
        } else {
            handleLocationError("Geo API not supported");
        }
    }
    var handleLocation = (loc) => {
        map.setCenter(loc);
        map.setZoom(14);
    };
    var handleLocationError = (error) => console.error(error);

    this.init = () => {
        map = new google.maps.Map(document.querySelector("#map"), {
            center: defaultLocation,
            zoom: 11,
            scrollwheel: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            scaleControl: true,
            fullscreenControl: false,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "transit",
                    "stylers": [{ "visibility": "off" }]
                }
            ]
        });

        auth = new Auth();
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(auth.getContainer());

        updateLocation();
    };
}

var map = new Map();
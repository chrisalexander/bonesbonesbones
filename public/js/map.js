function Map() {
    var defaultLocation = { lat: 51.512416, lng: -0.114123};

    var map = undefined;
    var placeService = undefined;
    var auth = undefined;
    var add = undefined;
    var details = undefined;
    var currentInfoWindow = undefined;

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

    var getCurrentRadius = () => {
        var bounds = map.getBounds();
        var center = map.getCenter();
        if (bounds && center) {
            var ne = bounds.getNorthEast();
            return google.maps.geometry.spherical.computeDistanceBetween(center, ne);
        }

        return 1000;
    };

    var nearbyPlaceMarkers = [];
    this.showNearbyPlaces = searchTerm => {
        removeNearbyPlaces();
        placeService.nearbySearch({ keyword: searchTerm, location: map.getCenter(), radius: getCurrentRadius(), type: "point_of_interest" }, handleNearbyPlaces);
    };
    var handleNearbyPlaces = (results, status) => {
        results.map(r => {
            var marker = new google.maps.Marker({
                position: { lat: r.geometry.location.lat(), lng: r.geometry.location.lng() },
                map: map,
                title: r.name,
                source: r,
                icon: {
                    url: r.icon,
                    scaledSize: new google.maps.Size(20, 20),
                    origin: new google.maps.Point(0, 0)
                }
            });
            marker.addListener("click", () => markerClicked(marker));
            nearbyPlaceMarkers.push(marker);
        });
    };
    var removeNearbyPlaces = () => {
        nearbyPlaceMarkers.map(m => m.setMap(null));
        nearbyPlaceMarkers = [];
    };
    var markerClicked = marker => {
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }

        currentInfoWindow = new google.maps.InfoWindow({
            content: marker.source.name + "<br /><a href=\"#\" onclick=\"map.infoWindowLinkClicked()\">See details &raquo;</a>"
        });
        currentInfoWindow.open(map, marker);
    };

    this.infoWindowLinkClicked = () => {
        showDetails(currentInfoWindow.anchor.source.place_id, currentInfoWindow.anchor.source);
        currentInfoWindow.close();
    };

    var showDetails = (placeId, cachedPlaceObject) => details.show(placeId, cachedPlaceObject);

    var currentBoundsTimeout = undefined;
    var boundsChanged = () => {
        if (currentBoundsTimeout) {
            window.clearTimeout(currentBoundsTimeout);
        }

        currentBoundsTimeout = window.setTimeout(handleBoundsChanged, 1000);
    };
    var handleBoundsChanged = () => {
        currentBoundsTimeout = false;

        if (add.adding()) {
            add.search();
        }
    };

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

        placeService = new google.maps.places.PlacesService(map);

        map.addListener("bounds_changed", boundsChanged);

        auth = new Auth();
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(auth.getContainer());

        add = new Add(auth, this);
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(add.getContainer());

        details = new Details();
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(details.getContainer());

        updateLocation();
    };
}

var map = new Map();
function Map() {
    var defaultLocation = { lat: 51.512416, lng: -0.114123};

    var map = null;
    var placeService = null;
    var auth = null;
    var add = null;
    var details = null;
    var currentInfoWindow = null;

    this.getContainer = () => document.querySelector("#map");

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
    this.showNearbyPlaces = searchTerm => placeService.nearbySearch({ keyword: searchTerm, location: map.getCenter(), radius: getCurrentRadius(), type: "point_of_interest" }, handleNearbyPlaces);
    var handleNearbyPlaces = (results, status) => {
        results.map(r => {
            if (nearbyPlaceMarkers.some(m => m.source.place_id == r.place_id)) {
                return;
            }

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

        for (var i = nearbyPlaceMarkers.length - 1; i >= 0; i--) {
            if (!results.some(r => r.place_id == nearbyPlaceMarkers[i].source.place_id)) {
                nearbyPlaceMarkers[i].setMap(null);
                nearbyPlaceMarkers.splice(i, 1);
            }
        }
    };
    var markerClicked = marker => {
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }

        currentInfoWindow = new google.maps.InfoWindow({
            content: marker.source.name + "<br /><a href=\"#\" onclick=\"map.infoWindowLinkClicked()\">&laquo; See details</a>"
        });
        currentInfoWindow.open(map, marker);
    };

    this.infoWindowLinkClicked = () => {
        showDetails(currentInfoWindow.anchor.source.place_id, currentInfoWindow.anchor.source);
        currentInfoWindow.close();
    };

    var showDetails = (placeId, cachedPlaceObject) => {
        details.show(placeId, cachedPlaceObject);
        showDetailsPane();
    };

    var currentBoundsTimeout = null;
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

    var showDetailsPane = () => this.getContainer().classList.add("showdetails");
    var hideDetailsPane = () => this.getContainer().classList.remove("showdetails");

    this.getGoogleDetails = (placeId, callback) => placeService.getDetails({ placeId: placeId }, callback);

    this.init = () => {
        map = new google.maps.Map(this.getContainer(), {
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
        map.addListener("click", hideDetailsPane);

        auth = new Auth();
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(auth.getContainer());

        add = new Add(auth, this);
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(add.getContainer());

        details = new Details(this);
        details.showDetails.subscribe(v => v ? showDetailsPane() : hideDetailsPane());

        updateLocation();
    };
}

var map = new Map();
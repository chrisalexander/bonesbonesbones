function Map() {
    this.init = () => {
        new google.maps.Map(document.querySelector("#map"), {
            center: { lat: 51.318998, lng: -0.678466 },
            scrollwheel: false,
            zoom: 12
        });
    };
}

var map = new Map();
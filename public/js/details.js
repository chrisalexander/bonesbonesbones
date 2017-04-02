function Details(mapModel) {
    var map = mapModel;

    this.getContainer = () => document.querySelector("#details");

    this.showDetails = ko.observable(false);
    this.heading = ko.observable(false);
    this.googleDetails = ko.observable(false);

    this.show = (placeId, cachedPlaceObject) => {
        googleDetails(false);
        map.getGoogleDetails(placeId, handleGoogleDetails);

        var headingDetails = {};

        if (cachedPlaceObject) {
            headingDetails.name = cachedPlaceObject.name;
            headingDetails.vicinity = cachedPlaceObject.vicinity;
            
            if (cachedPlaceObject.photos && cachedPlaceObject.photos.length > 0) {
                headingDetails.image = cachedPlaceObject.photos[0].getUrl({ maxWidth: 1000 });
                headingDetails.imageAttr = cachedPlaceObject.photos[0].html_attributions[0];
            }
        }

        this.showDetails(true);
        this.heading(headingDetails);
    }
    
    var handleGoogleDetails = (place, status) => {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            return;
        }

        this.googleDetails(place);
        console.log(place);
    };

    this.getPhoneNumber = () => this.googleDetails() && this.googleDetails().international_phone_number ? 'tel:' + this.googleDetails().international_phone_number : null;

    this.hide = () => this.showDetails(false);

    (() => {
        ko.applyBindings(this, this.getContainer());
    })();
}
function Details() {

    this.getContainer = () => document.querySelector("#details");

    this.hasDetails = ko.observable(false);

    this.show = (placeId, cachedPlaceObject) => {
        console.log(placeId, cachedPlaceObject);

        this.hasDetails(true);
    }

    (() => {
        ko.applyBindings(this, this.getContainer());
    })();
}
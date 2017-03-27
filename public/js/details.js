function Details() {

    this.getContainer = () => document.querySelector("#details");

    this.details = ko.observable(false);
    this.showDetails = ko.observable(false);

    this.show = (placeId, cachedPlaceObject) => {
        console.log(placeId, cachedPlaceObject);

        this.details({});
        this.showDetails(true);
    }

    this.hide = () => this.showDetails(false);

    (() => {
        ko.applyBindings(this, this.getContainer());
    })();
}
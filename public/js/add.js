function Add(authModel, mapModel) {
    var auth = authModel;
    var map = mapModel;

    this.getContainer = () => document.querySelector("#add");

    this.add = () => {
        map.showNearbyPlaces();
        this.adding(true);
        this.searchTerm("");

        if (!config.isMobile) {
            focusSearchBox();
        }
    }
    this.adding = ko.observable(false);

    this.search = () => map.showNearbyPlaces(this.searchTerm());
    this.searchTerm = ko.observable("");
    var focusSearchBox = () => this.getContainer().querySelector(".searchbox").focus();

    (() => {
        ko.applyBindings(this, this.getContainer());
    })();
}
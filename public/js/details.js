function Details() {

    this.getContainer = () => document.querySelector("#details");

    this.show = (placeId, cachedPlaceObject) => {
        console.log(placeId, cachedPlaceObject);
    }
}
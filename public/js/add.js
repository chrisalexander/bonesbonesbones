function Add(authModel) {
    var auth = authModel;

    this.getContainer = () => document.querySelector("#add");

    this.add = () => console.log(auth.hasUser() && auth.user());

    (() => {
        ko.applyBindings(this, this.getContainer());
    })();
}
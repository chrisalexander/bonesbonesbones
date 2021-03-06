function Auth() {
    var authProvider = new firebase.auth.GoogleAuthProvider();

    var signInWithRedirect = () => firebase.auth().signInWithRedirect(authProvider);
    var signInWithPopup = () => firebase.auth().signInWithPopup(authProvider).then(handleSignIn).catch(handleSignInError);
    var signInForDevice = config.current.forceLoginRedirect || config.isMobile ? signInWithRedirect : signInWithPopup;

    var handleSignIn = (result) => {
        this.user(result.user ? { "name": result.user.displayName, "image": result.user.photoURL } : false);
        this.hasUser(true);
    };
    var handleSignInError = (error) => console.error(error);

    var signOut = () => firebase.auth().signOut().then(handleSignOut).catch(handleSignOutError);

    var handleSignOut = () => this.user(false);
    var handleSignOutError = (error) => console.error(error);

    this.getContainer = () => document.querySelector("#auth");

    this.signIn = signInForDevice;
    this.signOut = signOut;

    this.user = ko.observable(false);
    this.hasUser = ko.observable(false);

    (() => {
        firebase.auth().getRedirectResult().then(handleSignIn).catch(handleSignInError);
        ko.applyBindings(this, this.getContainer());
    })();
}
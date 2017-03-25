var signInForDevice = function() {
    var mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    mobile ? signInWithRedirect() : signInWithPopup();
};

var signInWithRedirect = function() {
    firebase.auth().signInWithRedirect(getAuthProvider());
};

var signInWithPopup = function() {
    firebase.auth().signInWithPopup(getAuthProvider()).then(handleSignIn).catch(handleSignInError);
};

var getAuthProvider = function() {
    return new firebase.auth.GoogleAuthProvider();
};

var handleSignIn = function(result) {
    var user = result.user;
    console.log(user);
};

var handleSignInError = function(error) {
    console.error(error);
};

var initAuth = function() {
    firebase.auth().getRedirectResult().then(handleSignIn).catch(handleSignInError);
    document.querySelector("#signin").onclick = signInForDevice;
};
initAuth();
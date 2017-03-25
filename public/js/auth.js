function Auth() {
    var signInWithRedirect = () => firebase.auth().signInWithRedirect(authProvider);

    var signInWithPopup = () => firebase.auth().signInWithPopup(authProvider).then(handleSignIn).catch(handleSignInError);

    var signInForDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? signInWithRedirect : signInWithPopup;

    var authProvider = new firebase.auth.GoogleAuthProvider();

    var handleSignIn = (result) => console.log(result);

    var handleSignInError = (error) => console.error(error);

    (() => {
        firebase.auth().getRedirectResult().then(handleSignIn).catch(handleSignInError);
        document.querySelector("#signin").onclick = signInForDevice;
    })();
}

var auth = new Auth();
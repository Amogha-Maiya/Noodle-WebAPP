const firebaseConfig = {
    apiKey: "AIzaSyA4UM2dcK9v4LIuL6Kl2cZuq8_P025TeuY",
    authDomain: "noodle-2ce75.firebaseapp.com",
    projectId: "noodle-2ce75",
    storageBucket: "noodle-2ce75.appspot.com",
    messagingSenderId: "1093481198996",
    appId: "1:1093481198996:web:46d1d088a3f3f62b9acb81",
    measurementId: "G-4WTN3P0BC8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// let's code 
var datab = firebase.database().ref('data');

function UserRegister() {
    var email = document.getElementById('eemail').value;
    var password = document.getElementById('lpassword').value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {

    }).catch(function(error) {
        var errorcode = error.code;
        var errormsg = error.message;
    });
}
const auth = firebase.auth();

function SignIn() {
    var email = document.getElementById('eemail').value;
    var password = document.getElementById('lpassword').value;
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => alert(e.msg));
    window.open("index.html", "_self");
}
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    var userInfo = datab.push();
    userInfo.set({
        name: getId('fname'),
        email: getId('eemail'),
        usn: getId('usnno'),
        password: getId('lpassword')
    });
    alert("Successfully Signed Up");
    window.location.replace("index.html");
    console.log("sent");
    document.getElementById('form').reset();
});

function getId(id) {
    return document.getElementById(id).value;
}
var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyBVBxfc1lIRrRz_9oheBI8_VVoAdLefjKM",
  authDomain: "xmulus.firebaseapp.com",
  databaseURL: "https://xmulus.firebaseio.com",
  storageBucket: "xmulus.appspot.com",
  messagingSenderId: "896430175064"
};
firebase.initializeApp(config);

const auth = firebase.auth();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', lbtn: true, footer_content: true });
});

router.get('/Login', function(req, res, next) {
  res.render('login', { title: 'Login', lbtn: false, footer_content: true });
});

router.get('/Register', function(req, res, next) {
  res.render('login', { title: 'Register', lbtn: false, footer_content: true });
});

router.post('/Login/Submit', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch(function(e){
    console.log(e.message)
  });
});

router.post('/Register/Submit', function(req, res, next){
  var fname = req.body.fname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var gender = req.body.gender;
  var dob = req.body.dob;
  var bio = req.body.bio;

  if (password === cpassword) {
    const promise = auth.createUserWithEmailAndPassword(email, password);
    var user = {};
    user.name = fname;
    user.email = email;
    user.profile_picture = "";
    user.gender = gender;
    user.date_of_birth = dob;
    user.bio = bio;
    var dbRef = firebase.database().ref('users').push(user);

    promise.catch(function(e){
      console.log(e.message)
    });
  }
});

firebase.auth().onAuthStateChanged(function(firebaseUser){
  if(firebaseUser){
    res.redirect("/Dashboard/");
  } else{
    console.log("Not logged in!");
  }
});

module.exports = router;

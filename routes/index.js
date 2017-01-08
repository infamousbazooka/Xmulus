var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var request = require("request");

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

router.post('/', function(req, res, next){
  res.redirect('/');
});

router.get('/Login', function(req, res, next) {
  res.render('login', { title: 'Login', lbtn: false, footer_content: true, msg: "" });
});

router.get('/Register', function(req, res, next) {
  res.render('login', { title: 'Register', lbtn: false, footer_content: true });
});

router.get('/Dashboard/Watchlist', function(req, res, next) {
  res.render('dashboard', { title: 'Watchlist', lbtn: false, footer_content: true });
});



router.get('/Movie/Details/:movieId', function(req, res, next) {
  var details_results = {};
  var options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId,
    qs: {
      language: 'en-US',
      api_key: 'fa1ad33c2c7b13939445ce18e5209ee0'
    },
    body: '{}'
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    details_results = JSON.parse(body);
    res.render('dashboard', {
      title: details_results.original_title + " - Xmulus Dashboard",
      lbtn: false,
      email: req.user.email,
      footer_content: false,
      details: details_results
    });
  });

});

router.post('/Login', function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  auth.signInWithEmailAndPassword(email, password)
  .then(function (user) {
    res.redirect('/Dashboard');
  }).catch(function (err){
    console.log("Error New", err);
    res.render('login', { title: "Login", lbtn: false, footer_content: true, msg: "Invalid Credentials"});
  })

});
firebase.auth().onAuthStateChanged(function(firebaseUser){
  if(firebaseUser){
    console.log("Here i am: " + firebaseUser.email);
  } else{
    console.log("Not logged in!");
  }
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

module.exports = router;

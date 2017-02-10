var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var request = require("request");
var async = require('async');

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

router.get('/Dashboard/Movies', function(req, res, next) {
  res.render('dashboard', { title: 'Movies', email: req.user.email, lbtn: false, footer_content: true });
});

router.get('/Dashboard/Watchlist', function(req, res, next) {
  firebase.database().ref('watchlists').on('child_added', function(snapshot){
    var newPost = snapshot.val();
  });
  res.render('dashboard', { title: 'Watchlist', email: req.user.email, lbtn: false, footer_content: true });
});

router.post('/Dashboard/Watchlist/:movieId', function(req, res, next){
  console.log("Got ID: ", req.user.email);
  firebase.database().ref('users').on('child_added', function(snapshot){
    var newPost = snapshot.val();
    if (newPost.email = req.user.email) {
      var movie = req.params.movieId;
      console.log(newPost.email, " = ", req.user.email);
      console.log(snapshot.key);
      var dbRef = firebase.database().ref('watchlists').child(snapshot.key).push(movie);
    }
  });
  res.redirect('/Dashboard');
});


router.get('/Dashboard/Movies/:movieId', function(req, res, next) {

  function getDetails(mainCb){
    async.parallel({
      details: function(cb){
        var options_details = {
          method: 'GET',
          url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId,
          qs: {
            language: 'en-US',
            api_key: 'fa1ad33c2c7b13939445ce18e5209ee0'
          },
          body: '{}'
        };
        request(options_details, function(error, response, body){
          if(error) return cb(error);
          cb(null, JSON.parse(body));
        });
      },
      reviews: function(cb){
        var options_reviews = {
          method: 'GET',
          url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId + '/reviews',
          qs:{
            page: '1',
            language: 'en-US',
            api_key: 'fa1ad33c2c7b13939445ce18e5209ee0'
          },
          body: '{}'
        };
        request(options_reviews, function(error, response, body){
          if(error) return cb(error);
          cb(null, JSON.parse(body));
        });
      }
    },
    function(err, result){
      mainCb(err, result);
    });
  }


  getDetails(function (err, result) {
    if(err) {
      //show error page
      res.status(500).send({
        message: "Internal Server Error: Please contact Vassudevs."
      });
    } else {
      res.render('dashboard', {
        title: result.details.original_title + " - Xmulus Dashboard",
        lbtn: false,
        email: req.user.email,
        footer_content: false,
        details: result.details,
        reviews: result.reviews.results
      });
    }

  });





  // var details_results = {};
  // var options = {
  //   method: 'GET',
  //   url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId,
  //   qs: {
  //     language: 'en-US',
  //     api_key: 'fa1ad33c2c7b13939445ce18e5209ee0'
  //   },
  //   body: '{}'
  // };
  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);
  //   details_results = JSON.parse(body);
  //   res.render('dashboard', {
  //     title: details_results.original_title + " - Xmulus Dashboard",
  //     lbtn: false,
  //     email: req.user.email,
  //     footer_content: false,
  //     details: details_results
  //   });
  // });
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
    });
});
firebase.auth().onAuthStateChanged(function(firebaseUser){
  if(firebaseUser){
    console.log("Here i am: " + firebaseUser.email);

  } else{
    console.log("Not logged in!");
  }
});

router.post('/Register', function(req, res, next){
  var fname = req.body.fname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var gender = req.body.gender;
  var dob = req.body.dob;
  var bio = req.body.bio;
  var profile_picture = req.body.profile_picture;

  if (password === cpassword) {
    const promise = auth.createUserWithEmailAndPassword(email, password);
    var user = {};
    user.name = fname;
    user.email = email;
    user.profile_picture = "";
    user.gender = gender;
    user.date_of_birth = dob;
    user.bio = bio;

    //Get File
//     var file = profile_picture;
//
//     //Create Storage reference
//     var storageRef = firebase.storage().ref();
//     var mountainImagesRef = storageRef.child('profiles/' + email + '.jpg');
//
//     //Upload file
//     // var task = mountainImagesRef.put(file);
//     mountainImagesRef.put(file).then(function(snapshot) {
//   console.log('Uploaded a blob or file!');
// });

    // task.on('state_changed',
    //   function progress(snapshot){
    //     var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) / 100;
    //     console.log(percentage);
    //   },
    //   function error(err){
    //
    //   },
    //   function complete(){
    //     console.log("Complete");
    //     const promise = auth.createUserWithEmailAndPassword(email, password);
    //     var dbRef = firebase.database().ref('users').push(user);
    //   }
    // );
    var dbRef = firebase.database().ref('users').push(user);
    promise.catch(function(e){
      console.log(e.message);
      return;
    });
    res.redirect('/Dashboard');
  }
});

module.exports = router;

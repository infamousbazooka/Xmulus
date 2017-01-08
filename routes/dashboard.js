var request = require("request");
var firebase = require('firebase');
var async = require('async');

function getDashboard (mainCb) {
  async.parallel({
    popular : function (cb) {
      var options_popular = { method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular',
        qs: {
          page: '1',
          language: 'en-US',
          api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
          body: '{}'
        };
      request(options_popular, function (error, response, body) {
        if (error) return cb(error);
        cb(null, JSON.parse(body))
      });
    },
    rated : function (cb) {
      var options_rated = { method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/top_rated',
        qs: {
          page: '1',
          language: 'en-US',
          api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
          body: '{}'
        };
        request(options_rated, function (error, response, body) {
          if (error) return cb(error);
          cb(null, JSON.parse(body))
        });
    },
    upcoming : function (cb) {
      var options_upcoming = { method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/upcoming',
        qs: {
          language: 'en-US',
          api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
          body: '{}'
        };
        request(options_upcoming, function (error, response, body) {
          if (error) return cb(error);
          cb(null, JSON.parse(body))
        });
    }
  }, function (err, result) {
    mainCb(err, result)
  })
}



exports.list = function(req, res){

      getDashboard(function (err, result) {
        if(err) {
          //show error page
          res.status(500).send({
            message: "Internal Server Error: Please contact Sanket."
          });
        } else {
          res.render('dashboard', {
            title: 'Dashboard',
            email: req.user.email,
            lbtn: false,
            footer_content: false,
            popular: result.popular.results,
            rated: result.rated.results,
            upcoming: result.upcoming.results
          });
        }

      })

};

// Watchlist

exports.watchlist = function(req, res){
  res.render('dashboard', {
    title: 'Watchlist',
    lbtn: false,
    footer_content: false
  });
};

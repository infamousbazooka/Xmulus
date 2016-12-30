var request = require("request");

var popular = rated = upcoming = {};

var options = { method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/popular',
  qs: {
    page: '1',
    language: 'en-US',
    api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
    body: '{}'
  };
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  popular = JSON.parse(body);
});

var options_rated = { method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/top_rated',
  qs: {
    page: '1',
    language: 'en-US',
    api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
    body: '{}'
  };
request(options_rated, function (error, response, body) {
  if (error) throw new Error(error);
  rated = JSON.parse(body);
});

var options_upcoming = { method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/upcoming',
  qs: {
    language: 'en-US',
    api_key: 'fa1ad33c2c7b13939445ce18e5209ee0' },
    body: '{}'
  };
request(options_upcoming, function (error, response, body) {
  if (error) throw new Error(error);
  upcoming = JSON.parse(body);
});

exports.list = function(req, res){
  res.render('dashboard', {
    title: 'Dashboard',
    lbtn: false,
    footer_content: false,
    popular: popular.results,
    rated: rated.results,
    upcoming: upcoming.results
  });
};

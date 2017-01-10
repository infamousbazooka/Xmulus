$(document).ready(function() {
  $('select').material_select();
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  $(".button-collapse").sideNav();
  $('.main').css('width', $(window).width() - $('.side-nav').width());
  $('.list_slider li').css('width', $('.main').width()/4);
  $('.list_slider ul').css('width', $('.main').width()*5 + 80);
  $('#viewer').css('height', $('#viewer').width());
});

$('#searchform').submit(function(e){
    var url = "https://api.themoviedb.org/3/search/movie?api_key=fa1ad33c2c7b13939445ce18e5209ee0&language=en-US&query="
    + $('#search').val() + "&page=1&include_adult=false";

    $.ajax({
      type: 'GET',
      url: url,
      success: function(data){
        for (var i = 0; i < data.results.length; i++) {
          console.log(backdrop);
          if (data.results[i].backdrop_path) {
            var backdrop = 'https://image.tmdb.org/t/p/w500/' + data.results[i].backdrop_path;
          } else{
            backdrop = '/images/backdrop.jpg';
          }
          $('#searchlist').append('<li class="col s4"><div class="card"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' + backdrop
          +'"></div><div class="card-content"><h6 class="card-title activator grey-text text-darken-4">'
          + data.results[i].title + '<i class="material-icons right">more_vert</i></h6><p><a href="/Dashboard/Movies/'
          + data.results[i].id
          + '">Check this Movie</a></p></div><div class="card-reveal"><span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span><p>'
          + data.results[i].overview + '</p></div></div></li>');
        }
      }
    });
    e.preventDefault();
});


$("#profile_picture").change(function(e) {
  for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

        var file = e.originalEvent.srcElement.files[i];

        var img = document.getElementById("viewer");
        var reader = new FileReader();
        reader.onloadend = function() {
             img.src = reader.result;
        }
        reader.readAsDataURL(file);
    }
});

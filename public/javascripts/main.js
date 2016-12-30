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
});

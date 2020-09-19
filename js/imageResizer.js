$(document).ready(function(){

    $(".img-circle-custom").css("height", $(".img-circle-custom").width());

    $( window ).resize(function() {
        $(".img-circle-custom").css("height", $(".img-circle-custom").width());
        console.log($(".img-circle-custom").width());

      });
   
 
 });
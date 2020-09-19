$(function () {
    $(document).scroll(function () {
      var $nav = $(".navbar-custom-style");
      if ($(window).width() > 767)
      {
    
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    
      }
    
    });
  });


  $(window).on("load", function () {
    $(".all-pets-img").height( $('.all-pets-img').width());
});

$(window).on("resize", function () {
  $(".all-pets-img").height( $('.all-pets-img').width());
});


$(window).on("load", function () {
  $(".pet-img-container").height( $('.pet-img-container').width());
});

$(window).on("resize", function () {
$(".pet-img-container").height( $('.pet-img-container').width());
});

$(window).on("load", function () {
  $(".pet-img").height( $('.pet-img').width());
});

$(window).on("resize", function () {
  $(".inner-container").height( $('.inner-container').width());
  });

$(window).on("resize", function () {
$(".pet-img").height( $('.inner-container').width());
});
$(window).on("load", function () {
  $(".pet-img").height( $('.inner-container').width());
  });


function populateMaxAgeDD(number)
{
  var maxAge = document.getElementById('maxAge');
  maxAge.innerHTML = ""
  for (var i = (parseInt(number.value) + 1); i <= 10; i++)
  {
    var option = document.createElement('option');
    option.setAttribute('value', i);
    option.innerHTML = i + " years"
    maxAge.appendChild(option)
  }
  maxAge.lastChild.innerHTML = "10+ years"
  maxAge.lastChild.setAttribute('selected', true);
}

   

$(document).ready(function selSlider()
{
	var slider = document.getElementById('slider');
	console.log("Test!");

	noUiSlider.create(slider, {
	start: [3, 8],
	snap: true,
	range: {
		'min': 0,
		'10%': 1,
		'20%': 2,
		'30%': 3,
		'40%': 4,
		'50%': 5,
		'60%': 6,
		'70%': 7,
		'80%': 8,
		'90%': 9,
		'max': 10,
		
		}
		});
		var snapValues = [
	document.getElementById('slider-lower'),
	document.getElementById('slider-upper')
];
	slider.noUiSlider.on('update', function( values, handle ) {
	var sliderValues = values;
	console.log(values[0] + " " + values[1]);
	$("#slider-min-val").val(values[0]);
	$("#slider-max-val").val(values[1]);
	(values[handle] == 10) ?
	snapValues[handle].innerHTML = Math.round(values[handle]) + "+ years" :
	snapValues[handle].innerHTML = Math.round(values[handle]) + " years"; 

	});



});









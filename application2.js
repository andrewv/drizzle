var Location = {}; //global object

$(document).ready(function() {
	$('#getLocation').on('click',function(){ 
		if (navigator.geolocation) {
			var timeoutVal = 10 * 1000 * 1000;
				navigator.geolocation.getCurrentPosition(
				displayPosition, 
				displayError,
				{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
				);
		}
			else {
				alert("Geolocation is not supported by this browser");
<<<<<<< HEAD
				}
		});
		
	function displayError(error) {
		var errors = { 
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
			};
		alert("Error: " + errors[error.code]);
		}
 
		function displayPosition(position) {
			alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
			Location.latitude = position.coords.latitude;
			Location.longitude = position.coords.longitude;
			var forecastAPI = "eb7c3e22432c13886bbc7894291be3bb" 
			var JSONURL = "https://api.forecast.io/forecast/" + forecastAPI + "/" + Location.latitude + "," + Location.longitude + "?units=si";
			console.log(JSONURL);
		

			$.ajax({
				url: JSONURL,
				data: {'units':'si'},
				dataType: "jsonp",
				jsonp : "callback",
				jsonpCallback: "parseData",
				success: function(data){
					parseData(data);
				}
			});
			});	
		 //closes onclick
    
    function parseData(rtdata){
		
		console.log("hello");
				var userHeight = ($('#userHeight').val()); 
				var userWeight = ($('#userWeight').val()); 
				var userBMI = userWeight/((userHeight/100)^2)
					console.log("User BMI" + userBMI);
				var userBMIOffset = (25 - userBMI)/5; //user BMI offset .. positive values underweight, negative values overweight
					console.log("user bmi offset " + userBMIOffset);
					
				/***GETS USER GENDER ***/
				if (document.getElementById('userMale').checked) {
					var userGender = "0"
						console.log("male");
				} else {
				if (document.getElementById('userFemale').checked) {
					var userGender = "1.5" //gender temperature offset
						console.log("Female");
					}
=======
>>>>>>> master
				}
		}); 
		
	function displayError(error) {
		var errors = { 
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
			};
		alert("Error: " + errors[error.code]);
		}
 
		function displayPosition(position) {
			alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
			Location.latitude = position.coords.latitude;
			Location.longitude = position.coords.longitude;
			var forecastAPI = "eb7c3e22432c13886bbc7894291be3bb" 
			var JSONURL = "https://api.forecast.io/forecast/" + forecastAPI + "/" + Location.latitude + "," + Location.longitude + "?units=si";
			console.log(JSONURL);
		

<<<<<<< HEAD
				$("#resultDiv").html("<p>" + (roundedUserApparentTemp) + "C</p>");
				
				
				//*** CLOTHING *** Name of item, CLO value, Layer value //
				var maleClothing = [
				[["T-Shirt"],0.09,1],
				[["Light short sleeve shirt"],0.14,1],
				[["Light long sleeve shirt"],0.22,1],
				[["Heavy short sleeve shirt"],0.25,1],
				[["Heavy long sleeve shirt"],0.29,1],
				[["Light sweater"],0.20,2],
				[["Heavy sweater"],0.37,2],
				[["Light jacket"],0.22,3],
				[["Heavy jacket"],0.49,3]
				];
				
				var targetCLOValue = -(0.04*userApparentTemp)+1.13
				
				console.log(targetCLOValue);

		
		
			};
		
		
			//$.getJSON("TODAY.json", function(jsonData) {  ///**gets the JSON***
	
				/***GET USER INPUT **/
						//	}); //closes jsonDATA funciton
 

=======
			$.ajax({
				url: JSONURL,
				data: {'units':'si'},
				dataType: "jsonp",
				jsonp : "callback",
				jsonpCallback: "parseData",
				success: function(data){
					parseData(data);
				}
			});
		 //closes onclick
    
    function parseData(rtdata){
		
		console.log("hello");
				
		
		
			};
		
});		
			//$.getJSON("TODAY.json", function(jsonData) {  ///**gets the JSON***
	
				/***GET USER INPUT **/
						//	}); //closes jsonDATA funciton
 

>>>>>>> master
	//closes doc.ready

	

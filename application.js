var Location = {}; //global object

$(document).ready(function() {
	$('#getLocation').on('click',function(){ 

	/***START GEOLOCATION **/

    if (geoPosition.init()) { //Initialises the geoPosition javascript file
    	geoPosition.getCurrentPosition(findPosition, handle_error);
    }

		function findPosition(position) { //function to find the position of the user
        	Location.latitude = position.coords.latitude; //gets latitude
			Location.longitude = position.coords.longitude; //gets longitude
			console.log(Location.latitude);
			console.log(Location.longitude);

		}
		
		function handle_error(err) {
        	alert(err.code);
			if (err.code == 1) {
            // user said no!
			}
		}

if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(findPosition, handle_error);
    } else {
        error('not supported');
    } 
    
	/**GET JSON DATA**/


    
		var forecastAPI = "eb7c3e22432c13886bbc7894291be3bb" 
		var JSONURL = "https://api.forecast.io/forecast/" + forecastAPI + "/" + Location.latitude + "," + Location.longitude + "?units=si&callback=?";
		console.log(JSONURL);
			$.getJSON("TODAY.json", function(jsonData) { 
	
				/***GET USER INPUT **/
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
				}
		
				/***GETS AGE ***/
				var userAge = ($("#userAge").val());
					console.log("age is" + userAge);
	
				/***TEMPERATURE NOW ***/
	
				var currentTemp = jsonData["currently"]["temperature"];
					console.log("Current Temperature " + currentTemp);
				var currentWind = jsonData["currently"]["windSpeed"];
					console.log("Current Wind " + currentWind);
				var currentRH = jsonData["currently"]["humidity"];
					console.log("Current RH " + currentRH);
				/**Finds water vapour pressure from relative humidity and current temperature**/
				var currentVapourPressure = currentRH * 6.105 * (Math.E^((17.27*currentTemp)/(237.7+currentTemp)));
					console.log("vapour " + currentVapourPressure);
				/**Finds apparent 'feels like' temperature' from the above data**/
				var currentApparentTemp = (currentTemp + (0.33 * currentVapourPressure) - (0.70 * currentWind) - 4);
					console.log("Apparent Temperature " + currentApparentTemp);
		
				/*** ADJUSTING APPARENT TEMPERATURE ACCORDING TO BODY BASED ON VERY LOOSE UNSCIENTIFIC OBSERVATIONS ***/
		
				var userApparentTemp = currentApparentTemp - userGender; //makes it colder for women
					console.log("after gender" + userApparentTemp);

				userApparentTemp = userApparentTemp - userBMIOffset; //higher BMI retains temperatures more
					console.log("after BMI" + userApparentTemp);
			
				var roundedUserApparentTemp = Math.round(userApparentTemp * 10)/10;

				$("#resultDiv").html("<p>" + (roundedUserApparentTemp) + "C</p>");
				
				
			}); //closes jsonDATA funciton
		

    
}); //closes onclick
});		//closes doc.ready

	

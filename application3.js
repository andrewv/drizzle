var Location = {}; //global object

$(document).ready(function() { 

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
				}
		
		
	function displayError(error) {
		var errors = { 
			1: 'The location request was denied',
			2: 'Position unavailable',
			3: 'Request timeout'
			};
		alert("Error: " + errors[error.code]);
		}
 
		function displayPosition(position) {
			Location.latitude = position.coords.latitude;
			Location.longitude = position.coords.longitude;   
			var forecastAPI = "eb7c3e22432c13886bbc7894291be3bb" 
			var JSONURL = "https://api.forecast.io/forecast/" + forecastAPI + "/" + Location.latitude + "," + Location.longitude;
			console.log(JSONURL);
	$('#getLocation').on('click', function(){
        $.ajax({
           url: JSONURL, //URL of JSON
           data: {'units':'si'}, // to add at end of URL
           dataType: "jsonp", //Data type (JSONP)
           jsonp : "callback", //Calls the function
           jsonpCallback: "parseData", //name of function
           success: function(data){
               parseData(data); //runs this function
			   }
		});
	});
    
    function parseData(rtdata){ //MAIN FUNCTION
    
		/*LOAD VARIABLES*/
		
			/*CURRENT DETAILS*/
		    var currentTemp = Math.round((rtdata["currently"]["temperature"])*10)/10;
		    	console.log("Current Temperature " + currentTemp);
		    
		    var currentWind = Math.round((rtdata["currently"]["windSpeed"])*10)/10;
					console.log("Current Wind " + currentWind);
			
			var currentRH = rtdata["currently"]["humidity"];
					console.log("Current RH " + currentRH);
					
			var nextForecast = rtdata["hourly"]["summary"];
			
			
			var currentRain = rtdata["currently"]["precipIntensity"];
			
					/*USER DETAILS*/
				
				    var userHeight = ($('#userHeight').val()); 
					var userWeight = ($('#userWeight').val()); 
					var userBMI = userWeight/((userHeight/100)^2)
						console.log("User BMI" + userBMI);
					var userBMIOffset = (25 - userBMI)/5; //user BMI offset .. positive values underweight, negative values overweight
						console.log("user bmi offset " + userBMIOffset);
					
				/***GETS USER GENDER ***/
				if (document.getElementById('userGender').value == "male") {
					var userGender = "0"
						console.log("male");
				} else {
				if (document.getElementById('userGender').value == "female") {
					var userGender = "1.5" //gender temperature offset
						console.log("Female");
					}
				}
			
					
			/* NEXT 48 HOURS */
			
			var nextTemp = new Array;
			var nextTempLow = rtdata["hourly"]["data"][0]["temperature"]; //sets the lowest temp to the first data point
			var nextTempMax = rtdata["hourly"]["data"][0]["temperature"]; //sets the lowest temp to the first data point

			for (var i=0;i<23;i++)
				{ 
					nextTemp[i] = rtdata["hourly"]["data"][i]["temperature"];
					if (nextTemp[i]<nextTempLow) {
						nextTempLow = nextTemp[i];
					}
					if (nextTemp[i]>nextTempMax) {
						nextTempMax = nextTemp[i];
					} 
					console.log(nextTemp[i]);
				}
				
			
				/*LOADING WIND SPEED */
			
			var nextWind = new Array;	
				
			for (var i=0;i<23;i++)
				{ 
					nextWind[i] = rtdata["hourly"]["data"][i]["windSpeed"];
				}	
				
			/*LOADING HUMIDITY */
			
			var nextRH = new Array;	
				
			for (var i=0;i<23;i++)
				{ 
					nextRH[i] = rtdata["hourly"]["data"][i]["humidity"];
				}		
				
			/* CALCULATING USER TEMP FOR NEXT 24 HOURS */
			
			var nextUserTemp = new Array;	
				
			for (var i=0;i<23;i++)
				{ 
					var nextVapourPressure = nextRH[i] * 6.105 * (Math.E^((17.27*nextTemp[i])/(237.7+nextTemp[i])));
					console.log("next vapour" + nextVapourPressure);
					var nextApparentTemp = (nextTemp[i] + (0.33 * nextVapourPressure) - (0.70 * nextWind[i]) - 4);	
					console.log("next apparent" + nextApparentTemp);
					nextUserTemp[i] = ((nextApparentTemp - userGender) - userBMIOffset);
					console.log("next user" + i + "   " + nextUserTemp[i]);
					if (nextUserTemp[i]<nextTempLow) {
						nextTempLow = nextUserTemp[i];
					}
					if (nextUserTemp[i]>nextTempMax) {
						nextTempMax = nextUserTemp[i];
					} 
					
				}		
			
			nextTempMax = nextTempMax + 1; //breathing room
			nextTempLow = nextTempLow - 1;
					
			
			var nextTime = new Array;
			for (var i=0;i<23;i++)
				{
				var nextUnixDate = rtdata["hourly"]["data"][i]["time"];	 //gets the UNIX date
				console.log(nextUnixDate);
				var date = new Date(nextUnixDate*1000); //converts to Date object
				/*If result is on the hour, changes the minutes to "00" instead of "0" */
				 var hours = date.getHours();
				  var minutes = date.getMinutes();
				  var ampm = hours >= 12 ? 'pm' : 'am';
				  hours = hours % 12;
				  hours = hours ? hours : 12; // the hour '0' should be '12'
				  minutes = minutes < 10 ? '0'+minutes : minutes;
				  var strTime = hours + ':' + minutes + ' ' + ampm;
				nextTime[i] = strTime; //gets the time
				}
			
			var nextRain = new Array;
			for (var i=0;i<48;i++)
				{ 
					if (rtdata["hourly"]["data"][i]["precipProbability"]) {
						nextRain[i] = (rtdata["hourly"]["data"][i]["precipProbability"])*100;
					console.log(nextRain[i]);
						
					} else {
					nextRain[i] = 0
						console.log(nextRain[i]);
					}
				}
				
		
		
				/***GETS AGE ***/
				var userAge = ($("#userAge").val());
					console.log("age is" + userAge);

		/* CHARTING	*/	
		var lineChartData = {
			labels : nextTime,
			datasets : [
				{
					fillColor : "rgba(76,77,78,0)",
					strokeColor : "rgba(13,114,181,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : nextTemp,
				},
				{
					fillColor : "rgba(151,187,205,0)",
					strokeColor : "#ff3800",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : nextUserTemp,
				}
			] 
		}

	var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData,{
			scaleShowGridLines : false,
			scaleOverride : true,
			//** Required if scaleOverride is true **
			//Number - The number of steps in a hard coded scale
			scaleSteps : (nextTempMax - nextTempLow),
			//Number - The value jump in the hard coded scale
			scaleStepWidth : 1,
			//Number - The scale starting value
			scaleStartValue : nextTempLow,
			datasetStrokeWidth : 12,
			bezierCurve: false,
			pointDot : false,
			scaleFontFamily : "'Lato'",
			});
			
			/**Finds water vapour pressure from relative humidity and current temperature**/
				var currentVapourPressure = currentRH * 6.105 * (Math.E^((17.27*currentTemp)/(237.7+currentTemp)));
					console.log("vapour " + currentVapourPressure);
				/**Finds apparent 'feels like' temperature' from the above data**/
				var currentApparentTemp = (currentTemp + (0.33 * currentVapourPressure) - (0.70 * currentWind) - 4);
					console.log("Apparent Temperature " + currentApparentTemp);
		
				/*** ADJUSTING APPARENT TEMPERATURE ACCORDING TO USER AGE, HEIGHT, WEIGHT & GENDER***/
		
				var userApparentTemp = currentApparentTemp - userGender; //makes it colder for women
				console.log("after gender" + userApparentTemp);

				userApparentTemp = userApparentTemp - userBMIOffset; //higher BMI retains temperatures more
					console.log("after BMI" + userApparentTemp);
			
				var roundedUserApparentTemp = Math.round(userApparentTemp * 10)/10;
				
				/*CLOTHING */
				var targetCLOValue = -(0.04*userApparentTemp)+1.13
				
				if (targetCLOValue >= 0.11) {
					var clothingMSG1 = "Smile - it's t-shirt weather!"
				}
				
				if (targetCLOValue >= 0.11 && targetCLOValue <= 0.2) {
					var clothingMSG1 = "You shouldn't need a jacket or sweater"
				}
				
				if (targetCLOValue >= 0.2 && targetCLOValue <= 0.4) {
					var clothingMSG1 = "You'll need a light jacket or sweater"
				}
				
				if (targetCLOValue >= 0.4 && targetCLOValue <= 0.5) {
					var clothingMSG1 = "You'll need a jacket or sweater"
				}
				
				if (targetCLOValue >= 0.5 && targetCLOValue <= 0.7) {
					var clothingMSG1 = "You'll need a heavy jacket or sweater"
				}
				
				if (targetCLOValue >= 0.7 && targetCLOValue <= 1.0) {
					var clothingMSG1 = "Layer up! You'll need a jacket and a sweater"
				}
				
				if (targetCLOValue >= 1.0) {
					var clothingMSG1 = "It's cold! You'll need a heavy jacket and a heavy sweater!"
				}

	
				/***TEMPERATURE NOW HTML INSERTION ***/
					
					$('#currentTemp').html("<h2 class = 'temp'>" + currentTemp + "</h2>");

					$('#currentWind').html("<h2 class = 'temp'>" + currentWind + "</h2>");
				
					$('#currentRH').html("<h2 class = 'temp'>" + (currentRH)*100 + "%</h2>");
					
					$('#clothingMSG1').html("<h3 class = 'temp-rain'>" + clothingMSG1 + "</h3>");
					
					$('#nextForecast').html("<h3 class = 'temp-rain'>" + nextForecast + "</h3>");

					$('#roundedUserApparentTemp').html("<h2 class = 'temp'>" + roundedUserApparentTemp + "</h2>");
					
					

				
				
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

				
				
				
			}	

    }
    
});	//closes doc.ready


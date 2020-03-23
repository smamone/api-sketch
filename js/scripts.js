// JavaScript

$(document).ready(function(){
    
    var newLocation = "";
    
    if (navigator.geolocation){
        
        console.log(navigator.geolocation);
        
        function success(pos){
            
            console.log(pos);
            
            var coords = pos.coords;
            
            console.log("my current position is: ");
            console.log("lat: " + coords.latitude);
            console.log("long: " + coords.longitude);
            console.log("more or less: " + coords.accuracy + "m away.");
            
            // set string for location based on Dark Sky API format
            newLocation = coords.latitude + "," + coords.longitude;
            
            // set string to get location name based on Open Cage API format
            var latLongName = coords.latitude + "+" + coords.longitude;
            var locationPhoto = "";
            
            // call function to get weather data from API
            getWeatherData(newLocation);
            
            // call function to get location name from API
            getLocationName(latLongName);
            
            // call function to get location img from API
            getLocationImg(locationPhoto);
            
        }
        
        function error(err){
            
            console.log(err);
            
            // default location is Canberra lat long
            var defaultLocation = "-35.28346,149.12807";
            
            getWeatherData(defaultLocation);
            
        }
        
        // trigger the browser prompt
        navigator.geolocation.getCurrentPosition(success, error);
        
    }
    
}); // document ready close


// --- FUNCTIONS --- //

// FUNCTION to get location name from OPEN CAGE API
function getLocationName(latLongCoords){
    
    // my Open Cage Data API key
    var keyOpenCage = "135d8af66fb04c9bac0092208a55e2a7";

    // Open Cage Data API call
    var geocodeURL = "https://api.opencagedata.com/geocode/v1/json?q=" + latLongCoords + "&key=" + keyOpenCage;
    
    // make request to server using Open Cage API call
    $.getJSON(geocodeURL, function(locationData){
        
        console.log(locationData.results[0]);
        
        var locationComponent = locationData.results[0].components;
        var locString = locationComponent.suburb + ", " + locationComponent.state_code;
        var location = document.getElementById("#location");

        // LOCATION
        // get location and add to html tag
        $("#location").append(locString);
        
        console.log(locString);
        
    });
    
}

// FUNCTION to load data from DARK SKY API
function getWeatherData(currentLocation){
    
    // my Dark Sky API key
    var keyDarkSky = "008bf272749fe7c833b4606af967ab5e";

    // Dark Sky API call
    var urlDarkSky = "https://api.darksky.net/forecast/" + keyDarkSky + "/" + currentLocation + "?units=auto&callback=?";

    var term = document.getElementById("term");

    // make request to server using Dark Sky API call
    $.getJSON(urlDarkSky, function(data) {

        console.log(data); // show API data

        var now = new Date(data.currently.time * 1000); // get current time and mulitply by 1000 for milliseconds
        var timer = setInterval(updateTimeTemp, 10000); // call updateTimeTemp every minute
        var temp = data.currently.temperature; // get current temperature
        var maxTemp = data.daily.data[0].temperatureMax; // get max temperature for today

        // show current data
        console.log(timer);
        console.log(maxTemp);

        // TEMPERATURE
        // set the span in the h2 tag
        $("#currentMaxTemp span").html(maxTemp.toFixed(1)); // round to 1 decimal place
        $("#currentMaxTemp").css("color", "#d90f0f"); // set text color

        // DESCRIPTION
        // get summary and add to html tag
        $("#desc").html(data.currently.summary);

        // TIME
        // get current time and convert to 12-hour format, hours and minutes
        function updateTimeTemp(){
            
            console.log(now);
            console.log(temp);
            
            // TIME
            // get current time and add to html tag
            $("#time span").html(now.toLocaleTimeString(navigator.language, {
                hour12: true,
                hour: 'numeric',
                minute: 'numeric'
            }));

            // DATE
            // get current date and add to html tag
            $("#date span").html(now.toDateString());
            
            // TEMP
            // get current temp and add to html tag
            $("#temp span").html(temp.toFixed(1)); // round to 1 decimal place
            
        }

        // HUMIDITY
        // get humdity and add to html tag
        $("#humidity span").html(data.currently.humidity);

        // WIND SPEED
        // get wind speed and add to html tag
        $("#wind span").html(data.currently.windSpeed);

        // UV INDEX
        // get uv index and add to html tag
        $("#uv span").html(data.currently.uvIndex);


    // FUNCTION to determine the DESCRIPTION to display based on the current temperature
        
        tempDesc(); // call the function
        
        function tempDesc(){
            
            if (temp >= 40) { // 40 or above

                $("#temp").css("color", "#9e0b00"); // change text color to dark red

            } else if (temp >= 35 && temp <= 39.9) { // between 35-39

                $("#temp").css("color", "#ff0000"); // change text color to red

            } else if (temp >= 30 && temp <= 34.9) { // between 30-34

                $("#temp").css("color", "#ff6a00"); // change text color to orange

            } else if (temp >= 25 && temp <= 29.9) { // between 25-29

                $("#temp").css("color", "#ffd500"); // change text color to sunny yellow

            } else if (temp >= 20 && temp <= 24.9) { // between 20-24

                $("#temp").css("color", "#fff200"); // change text color to yellow

            } else if (temp >= 15 && temp <= 19.9) { // between 15-19

                $("#temp").css("color", "#91ff00"); // change text color to green

            } else if (temp >= 10 && temp <= 14.9) { // between 10-14

                $("#temp").css("color", "#00ffb7"); // change text color to warm green

            } else if (temp >= 0 && temp <= 9.9) { // between 0-9

                $("#temp").css("color", "#00a6ff"); // change text color to blue

            } else { //below 0

                $("#temp").css("color", "#00e1ff"); // change text color to ice blue

            }; // if statement close
            
        }; // tempDesc function close
        

    // FUNCTION to determine the ICON to display based on the current temperature
        
        var sky = document.getElementById("currently");
        var weatherIcon = document.getElementById("tempIcon");

        var currentIcon = data.currently.icon; // get current temperature icon
        var defaultIcon = document.getElementById("defaultIcon");

        console.log(currentIcon); // show current icon
        
        tempIcon(); // call the function
        
        function tempIcon(){

            if (currentIcon == "clear-day") { // clear day

                $(sunny).css("display", "block"); // show "sunny" icon and description
                $(sky).css("background-color", "#24afff"); // change background color to blue
                $(weatherIcon).html("<img src='/images/sun.png'>"); // set background image

            } else if (currentIcon == "clear-night") { // clear night

                $(night).css("display", "block"); // show "night" icon and description
                $(sky).css("background-color", "#00173D"); // change background color to dark blue
                $(weatherIcon).html("<img src='/images/moon.png'>"); // set background image

            } else if (currentIcon == "rain") { // rain

                $(rain).css("display", "block"); // show "rain" icon and description
                $(sky).css("background-color", "#a3a3a3"); // change background color to grey
                $(weatherIcon).html("<img src='/images/rain.png'>"); // set background image

            } else if (currentIcon == "snow") { // snow

                $(snowfall).css("display", "block"); // show "snowfall" icon and description
                $(sky).css("background-color", "#a3a3a3"); // change background color to grey
                $(weatherIcon).html("<img src='/images/snow.png'>"); // set background image

            } else if (currentIcon == "sleet") { // sleet

                $(sleet).css("display", "block"); // show "sleet" icon and description
                $(sky).css("background-color", "darkgrey"); // change background color to dark grey
                $(weatherIcon).html("<img src='/images/sleet.png'>"); // set background image

            } else if (currentIcon == "wind") { // wind

                $(windy).css("display", "block"); // show "windy" icon and description
                $(sky).css("background-color", "purple"); // change background color to purple
                $(weatherIcon).html("<img src='/images/wind.png'>"); // set background image

            } else if (currentIcon == "fog") { // foggy

                $(foggy).css("display", "block"); // show "foggy" icon and description
                $(sky).css("background-color", "#a3a3a3"); // change background color to gray
                $(weatherIcon).html("<img src='/images/fog.png'>"); // set background image

            } else if (currentIcon == "cloudy" || currentIcon == "partly-cloudy-day") { // cloudy or partly cloudy

                $(cloudy).css("display", "block"); // show "cloudy" icon and description
                $(sky).css("background-color", "#4d4d4d"); // change background color to grey
                $(weatherIcon).html("<img src='/images/cloud.png'>"); // set background image

            } else if (currentIcon == "partly-cloudy-night") { // partly cloudy night

                $(cloudyNight).css("display", "block"); // show "partly cloudy night" icon and description
                $(sky).css("background-color", "#0b155e"); // change background color to dark blue
                $(weatherIcon).html("<img src='/images/cloudnight.png'>"); // set background image

            } else { // below 0

                $(sunny).css("display", "block"); //show sun icon and description

            }; // if statement close
            
        }; // tempIcon function close

    // FUNCTION to determine the GREETING to display based on the current time

        var hours = new Date().getHours();
        
        timeGreeting(); // call the timeGreeting function
        
        function timeGreeting(){

            if (hours >= 0 && hours < 12){ // between 5am and 11:59am

                $("#greeting span").html("Good morning!"); // show "Good morning"

            } else if (hours >= 12 && hours < 17){ // between 12pm and 4:59pm

                $("#greeting span").html("Good afternoon!"); // show "Good afternoon"

            } else if (hours >= 17 && hours < 20){ // between 5pm and 7:59pm

                $("#greeting span").html("Good evening!"); // show "Good evening"

            } else { // between 8pm and 4:59am

                $("#greeting span").html("Good night!"); // show "Good night"

            }; // if statement close
            
        }; // timeGreeting function close

    // FUNCTION to determine the FUTURE TEMPS to display based on the current temperature

        // loop through the data and add it to the ul
        // new li for each new item - starting tomorrow, therefore i = 1
        for (var i = 1; i < data.daily.data.length; i++){
            
            console.log(data.daily.data[i]);

            var future = data.daily.data[i]; // the data for one day in the forecast
            var list = $("<li>");
            var date = new Date(future.time*1000).toDateString(); // get future dates and convert to date string
            var weekday = date.split(" "); // split future date string into array
            
            var calDay = new Array(7); // weekday array
            calDay[0] = "Sunday";
            calDay[1] = "Monday";
            calDay[2] = "Tuesday";
            calDay[3] = "Wednesday";
            calDay[4] = "Thursday";
            calDay[5] = "Friday";
            calDay[6] = "Saturday";

            list.append("<li class='day'>" + weekday[0] + "</li>"); // append weekday only
            list.append("<li class='futureIcon'><img class='futureImg'>" + "<p class='iconText'>" + future.icon + "</p>" + "</li>");
            list.append("<li class='minTemp'>" + Math.round(future.temperatureMin) + "<sup>&degC</sup></li>");
            list.append("<li class='maxTemp'>" + Math.round(future.temperatureMax) + "<sup>&degC</sup></li>");

            // append the li info to the ul
            $("#futureDays").append(list);
            
        }; // for loop close


        // loop to check each iconText element
        for (var i = 1; i < data.daily.data.length; i++){
            
            console.log(data.daily.data[i].icon);

            var future = data.daily.future[i].icon; // the data for one day in the forecast
            var futureIconImg = document.getElementsByClassName("futureImg");
            var futureSummary = document.getElementsByClassName("iconText");
            
            // if any of the elements of futureTempIcon array meet the condition
            if (future == "clear-day") { // clear day

                $(futureIconImg).attr("src", "/images/sun.png"); // set icon

            } else if (future == "clear-night") { // clear night

                $(futureIconImg).attr("src", "/images/moon.png"); // set icon

            } else if (future == "rain") { // rain

                $(futureIconImg).attr("src", "/images/rain.png"); // set icon

            } else if (future == "snow") { // snow

                $(futureIconImg).attr("src", "/images/snow.png"); // set icon

            } else if (future == "sleet") { // sleet

                $(futureIconImg).attr("src", "/images/sleet.png"); // set icon

            } else if (future == "wind") { // wind

                $(futureIconImg).attr("src", "/images/wind.png"); // set icon

            } else if (future == "fog") { // foggy

                $(futureIconImg).attr("src", "/images/fog.png"); // set icon

            } else if (future == "cloudy" || future == "partly-cloudy-day") { // cloudy or partly cloudy

                $(futureIconImg).attr("src", "/images/cloud.png"); // set icon

            } else if (future == "partly-cloudy-night") { // partly cloudy night

                $(futureIconImg).attr("src", "/images/cloudnight.png"); // set icon

            } else {

                $(futureIconImg).attr("src", "/images/sun.png"); // set icon

            }; // if statement close

        }; // for loop close

    }); // getJSON close

} // getWeatherData function close
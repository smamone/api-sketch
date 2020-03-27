// JavaScript

$(document).ready(function () {

    var newLocation = "";

    if (navigator.geolocation) {

        function success(pos) {

            var coords = pos.coords;

            // set string for location based on Dark Sky API format
            newLocation = coords.latitude + "," + coords.longitude;

            // set string to get location name based on Open Cage API format
            var latLongName = coords.latitude + "+" + coords.longitude;

            // call function to get weather data from API
            getWeatherData(newLocation);

            // call function to get location name from API
            getLocationName(latLongName);

        } // close success function

        function error(err) {

            console.log(err);

            // default location is Canberra lat long
            var defaultLocation = "-35.28346,149.12807";

            getWeatherData(defaultLocation);

        } // close error function

        // trigger the browser prompt
        navigator.geolocation.getCurrentPosition(success, error);

    } // close if statement

}); // close document ready


// --- FUNCTIONS --- //

// FUNCTION to get location name from OPEN CAGE API
function getLocationName(latLongCoords) {

    console.log('in get location name');

    // my Open Cage Data API key
    var keyOpenCage = "135d8af66fb04c9bac0092208a55e2a7";

    // Open Cage Data API call
    var geocodeURL = "https://api.opencagedata.com/geocode/v1/json?q=" + latLongCoords + "&key=" + keyOpenCage;

    // make request to server using Open Cage API call
    $.getJSON(geocodeURL, function (locationData) {

        console.log(locationData.results[0]);

        var locationComponent = locationData.results[0].components;
        var locString = locationComponent.suburb + ", " + locationComponent.state_code;

        // LOCATION
        // get location and add to html tag
        $("#location").append(locString);

        //        console.log(locString);

    }); // close getJSON

} // close getLocationName function


// FUNCTION to load data from DARK SKY API
function getWeatherData(currentLocation) {
    
    console.log('in get weather data');

    // my Dark Sky API key
    var keyDarkSky = "008bf272749fe7c833b4606af967ab5e";

    // Dark Sky API call
    var urlDarkSky = "https://api.darksky.net/forecast/" + keyDarkSky + "/" + currentLocation + "?units=auto&callback=?";

    // make request to server using Dark Sky API call
    $.getJSON(urlDarkSky, function (data) {
        console.log('getting data');
        console.log(data); // show API data

        // MAX TEMPERATURE
        var maxTemp = data.daily.data[0].temperatureMax; // get max temperature for today
        
        // set the span in the h2 tag
        $("#currentMaxTemp span").html(Math.round(maxTemp)); // round up

        // DESCRIPTION
        // get summary and add to html tag
        $("#desc").html(data.currently.summary);

        // TIME
        // call function and send data object so it can process it
        updateTimeTemp(data.currently);

        // HUMIDITY
        // get humdity and add to html tag
        $("#humidity span").html(Math.round((data.currently.humidity) * 100)); // mulitply data by 10 to get percentage and round up

        // WIND SPEED
        // get wind speed and add to html tag
        $("#wind span").html(Math.round(data.currently.windSpeed) * 3.6); // round up and convert from metres per second to kilometres per hour

        // UV INDEX
        // get uv index and add to html tag
        $("#uv span").html(data.currently.uvIndex);

        // FEELS LIKE TEMP
        // get feels like temp and add to html tag
        $("#feelsTemp span").html(Math.round(data.currently.apparentTemperature)); // round up

        //call the  temp icon function and send data with it
        tempIcon(data); // call the function

        // call the timeGreeting function - don't need to send data as it is based off users location
        timeGreeting();

        // call the moonPhase function
        moonPhase(data);

        // call the dateSeason function
        dateSeason();

        // call futureTemps function
        futureTemps(data);

    }); // close getJSON

} // close getweatherdata function


// FUNCTION to update time
function updateTimeTemp(currently) {
    
    console.log('in update time fn')

    var currentTemp = currently.temperature; // get current temperature
    var currentTime = moment(currentTime).format('dddd, MMMM Do');
    
    startTime(); // call startTime function

    // FUNCTION to get current TIME and add to html tag
    function startTime() {

        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var session = "AM";m
        
        // set AM or PM based on current hour
        if(h == 0) {
            h = 12;
        }

        if(h > 12) {
            h = h - 12;
            session = "PM";
        }
        
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;

        // add to html tag
        var time = h + ":" + m + " " + session;
        document.getElementById("time").innerText = time;
        document.getElementById("time").textContent = time;

        // update data every second
        setTimeout(startTime, 1000);

    } // close startTime function

    // DATE
    // get current date and add to html tag
    $("#date span").html(currentTime);

    // TEMP
    // get current temp and add to html tag
    
    startTemp(); // call startTemp function
    
    // FUNCTION to get current TEMP and add to html tag
    function startTemp() {
        
        $("#temp span").html(currentTemp.toFixed(1)); // round to 1 decimal place

        // update data every second
        setTimeout(startTemp, 1000);
        
    } // close startTemp function

} // close updateTimeTemp function


// FUNCTION to determine the SEASON for current date and change colour of circle accordingly
function dateSeason() {

    var month = moment().format('MMMM');
    console.log(month);

    if (month == "December" || month == "January" || month == "February") { // if month is Dec, Jan or Feb - Summer

        $("#circleDate").css(
            "background-image", "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)"
        ); // set background to gradient

    } else if (month == "March" || month == "April" || month == "May") { // if month is Mar, Apr or May - Autumn

        $("#circleDate").css(
            "background-image", "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)"
        ); // set background to gradient

    } else if (month == "June" || month == "July" || month == "August") { // if month is Jun, Jul or Aug - Winter

        $("#circleDate").css(
            "background-image", "linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%)"
        ); // set background to gradient

    } else { // if month is Sep, Oct or Nov - Spring

        $("#circleDate").css(
            "background-image", "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)"
        ); // set background to gradient

    } // close if statement

} // close dateSeason function


// FUNCTION to determine the ICON to display based on the current temperature
function tempIcon(data) {

    var circleCurrentSummary = document.getElementById("circleSummary");
    var weatherIcon = document.getElementById("currentTemp");
    var currentIcon = data.currently.icon; // get current temperature icon

    //console.log(currentIcon); // show current icon

    if (currentIcon == "clear") { // clear day

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Not specified"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/sun.jpg)",
            "background-size": "cover"
        }); // set background image
        
    } else if (currentIcon == "clear-night") { // clear night

        $(circleCurrentSummary).css({
            "background-image":"linear-gradient(60deg, #29323c 0%, #485563 100%)",
            "color":"#FFFFFF"
        }); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Clear"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/night.jpg)",
            "background-size": "cover",
        }); // set background image
        $("#currentTemp").css(
            "color", "#FFFFFF"
        ); // change text color to white

    } else if (currentIcon == "rain") { // rain

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Rain"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/rain.jpg)",
            "background-size": "cover"
        }); // set background image
        $("#currentTemp").css(
            "color", "#FFFFFF"
        ); // change text color to white

    } else if (currentIcon == "snow") { // snow

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Snow"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/snow.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "sleet") { // sleet

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Sleet"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/sleet.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "wind") { // wind

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Windy"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/wind.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "fog") { // foggy

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Fog"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/fog.jpg)",
            "background-size": "cover"
        }); // set background image
        $("#currentTemp").css(
            "color", "#FFFFFF"
        ); // change text color to white

    } else if (currentIcon == "cloudy") { // cloudy

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Cloudy"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/cloud.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "partly-cloudy-day") { // partly cloudy
        
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Partly cloudy"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/partcloud.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "partly-cloudy-night") { // partly cloudy night

        $(circleCurrentSummary).css({
            "background-image":"linear-gradient(to top, #09203f 0%, #537895 100%)",
            "color":"#FFFFFF"
        }); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Partly cloudy"); // add alt tag for screen readers to represent summary
        $(weatherIcon).css({
            "background-image": "url(/images/cloudnight.jpg)",
            "background-size": "cover"
        }); // set background image
        $("#currentTemp").css(
            "color", "#FFFFFF"
        ); // change text color to white

    } else { // other

        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
        ); // change circle li background to gradient
        $(circleCurrentSummary).attr("alt", "Not specified"); // add alt tag for screen readers to represent summary

    } // close if statement

} // close tempIcon function


// FUNCTION to determine the GREETING to display based on the current time
function timeGreeting() {

    var hours = new Date().getHours();

    if (hours >= 0 && hours < 12) { // between 5am and 11:59am

        $("#greeting span").html("Good morning!"); // show "Good morning"
        $("#circleTime").css(
            "background-image", "linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)"
        );

    } else if (hours >= 12 && hours < 17) { // between 12pm and 4:59pm

        $("#greeting span").html("Good afternoon!"); // show "Good afternoon"
        $("#circleTime").css(
            "background-image", "linear-gradient(to top, #4481eb 0%, #04befe 100%)"
        );

    } else if (hours >= 17 && hours < 20) { // between 5pm and 7:59pm

        $("#greeting span").html("Good evening!"); // show "Good evening"
        $("#circleTime").css(
            "background-image", "linear-gradient(to top, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%)"
        );

    } else { // between 8pm and 4:59am

        $("#greeting span").html("Good night!"); // show "Good night"
        $("#circleTime").css(
            "background-image", "linear-gradient(to right, #243949 0%, #517fa4 100%)"
        );

    } // close if statement

} // close timeGreeting function


// FUNCTION to determin the MOON PHASES for the current day
function moonPhase(data) {

    var moon = data.daily.data[0].moonPhase;
    console.log(moon);

    // Moon Phases:
    // 0 - new moon
    // 0.01-0.24 - waning crescent
    // 0.25 - first quarter moon
    // 0.26-0.49 - waning gibbous
    // 0.5 - full moon
    // 0.51-0.74 - waxing gibbous
    // 0.75 - third quarter moon
    // 0.76-0.99 - waxing crescent

    if (moon == 0.25) { // 0.25 - first quarter moon -li 1-

        $("#moonRow1 .circleMoons:nth-child(1)").css({
            "background":"linear-gradient(90deg, #FFFFFF00 49%, #EEEEEE 51%)",
            "box-shadow":"0 0 0.75em 0 #fcfcfc"
        }); // set background color and opacity to 0%, set gradient to create half moon on right
        $("#moonRow1 .circleMoons:nth-child(1) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.76 && moon <= 0.99) { // 0.76-0.99 - waxing crescent -li 2-

        $("#moonRow1 .circleMoons:nth-child(2)").css({
            "background-color": "#FFFFFF25",
            "box-shadow": "inset -1.2em 0 0.5em #EEEEEE, inset -1.2em 0 0.5em 0.2em #EEEEEE, 0 0 0.75em 0 #fcfcfc",
            "-moz-box-shadow": "inset -1.2em 0 0.5em #EEEEEE, inset -1.2em 0 0.5em 0.2em #EEEEEE, 0 0 0.75em 0 #fcfcfc"
        }); // set background colour and opacity 25%, set box shadow to create crescent on right
        $("#moonRow1 .circleMoons:nth-child(2) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.01 && moon <= 0.24) { // 0.01-0.24 - waning crescent -li 4-

        $("#moonRow1 .circleMoons:nth-child(4)").css({
            "background-color": "#FFFFFF25",
            "box-shadow": "inset 1.2em 0 0.5em #EEEEEE, inset 1.2em 0 0.5em 0.2em #EEEEEE, 0 0 0.75em 0 #fcfcfc",
            "-moz-box-shadow": "inset 1.2em 0 0.5em #EEEEEE, inset 1.2em 0 0.5em 0.2em #EEEEEE, 0 0 0.75em 0 #fcfcfc"
        }); // set background colour and opacity 25%, set box shadow to create crescent on left
        $("#moonRow1 .circleMoons:nth-child(4) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon == 0.75) { // 0.75 - third quarter moon -li 1-

        $("#moonRow2 .circleMoons:nth-child(1)").css({
            "background": "linear-gradient(-90deg, #FFFFFF00 49%, #EEEEEE 51%)",
            "color": "#333332",
            "box-shadow":"0 0 0.75em 0 #fcfcfc"
        }); // set background color and opacity to 0%, set gradient to create half moon on left, set text color to charcoal
        $("#moonRow2 .circleMoons:nth-child(1) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.26 && moon <= 0.49) { // 0.26-0.49 - waning gibbous -li 2-

        $("#moonRow2 .circleMoons:nth-child(2)").css({
            "background-color": "#dedede",
            "box-shadow": "inset -1em 0 0.5em #FFFFFF00, inset -1em 0 0.5em 0.2em #00000030, 0 0 0.75em 0 #fcfcfc",
            "-moz-box-shadow": "inset -1em 0 0.5em #FFFFFF00, inset -1em 0 0.5em 0.2em #00000030, 0 0 0.75em 0 #fcfcfc"
        }); // set background colour and opacity 25%, set box shadow to create gibbous on left
        $("#moonRow2 .circleMoons:nth-child(2) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon == 0.5) { // 0.5 - full moon -li 3-

        $("#moonRow2 .circleMoons:nth-child(3)").css({
            "background-image":"linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
            "box-shadow":"0 0 0.75em 0 #fcfcfc"
        }); // set background to gradient
        $("#moonRow2 .circleMoons:nth-child(3) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.51 && moon <= 0.74) { // 0.51-0.74 - waxing gibbous -li 4-

        $("#moonRow2 .circleMoons:nth-child(4)").css({
            "background-color": "#dedede",
            "box-shadow": "inset 1em 0 0.5em #FFFFFF00, inset 1em 0 0.5em 0.2em #00000030, 0 0 0.75em 0 #fcfcfc",
            "-moz-box-shadow": "inset 1em 0 0.5em #FFFFFF00, inset 1em 0 0.5em 0.2em #00000030, 0 0 0.75em 0 #fcfcfc"
        }); // set background colour and opacity 25%, set box shadow to create gibbous on right
        $("#moonRow2 .circleMoons:nth-child(4) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else { // 0 - new moon -li 3-

        $("#moonRow1 .circleMoons:nth-child(3)").css(
            "box-shadow", "0 0 0.75em 0 #fcfcfc"
        ); // set css glow
        $("#moonRow1 .circleMoons:nth-child(3) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } // close if statement

} // close moonPhase function


// FUNCTION to determine the FUTURE TEMPS to display based on the current temperature
function futureTemps(data) {
    
    console.log('in future temps');

    console.log(data.daily);

    // loop through the data and add it to the ul
    // new li for each new item - starting tomorrow, therefore i = 1
    for (var i = 1; i < data.daily.data.length; i++) {

        // create new li for each future weekday and temp
        var listDiv = $("<div class='aheadHead'>");
        var listIcon = $("<div class='aheadIcon'>");

        // the data for one day in the forecast
        var future = data.daily.data[i];

        // create date based on the time of future dates, mulitplied by 1000 to convert
        var dateObj = new Date(future.time * 1000);

        // get day of dateObj using moment in 3-letter format
        var weekday = moment(dateObj).format('ddd');

        // get icon for each future day available
        var futureIcon = future.icon;

//        console.log("index: " + i + ", " + weekday + ". ICON: " + futureIcon);

        // if any of the elements of future array meet the condition
        if (futureIcon == "clear-day") { // clear day
            
            $(listIcon).css({
                "background-image":"url(/images/sun.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Clear"); // add alt tag for screen readers to represent summary
            
        } else if (futureIcon == "clear-night") { // clear night

            $(listIcon).css({
                "background-image":"url(/images/night.jpg)",
                "background-size":"cover",
                "opacity":"0.9",
                "color":"#FFFFFF"
            }); // set background image
            $(listIcon).attr("alt", "Clear"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "rain") { // rain

            $(listIcon).css({
                "background-image":"url(/images/rain.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Rain"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "snow") { // snow

            $(listIcon).css({
                "background-image":"url(/images/snow.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Snow"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "sleet") { // sleet

            $(listIcon).css({
                "background-image":"url(/images/sleet.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Sleet"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "wind") { // wind

            $(listIcon).css({
                "background-image":"url(/images/wind.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Wind"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "fog") { // foggy

            $(listIcon).css({
                "background-image":"url(/images/fog.jpg)",
                "background-size":"cover",
                "opacity":"0.8"
            }); // set background image
            $(listIcon).attr("alt", "Fog"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "cloudy") { // cloudy

            $(listIcon).css({
                "background-image":"url(/images/cloud.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Cloudy"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "partly-cloudy-day") { // partly cloudy

            $(listIcon).css({
                "background-image":"url(/images/partcloud.jpg)",
                "background-size":"cover",
                "opacity":"0.9"
            }); // set background image
            $(listIcon).attr("alt", "Partly cloudy"); // add alt tag for screen readers to represent summary

        } else if (futureIcon == "partly-cloudy-night") { // partly cloudy night

            $(listIcon).css({
                "background-image":"url(/images/cloudnight.jpg)",
                "background-size":"cover",
                "opacity":"0.9",
                "color":"#FFFFFF"
            }); // set background image
            $(listIcon).attr("alt", "Partly cloudy"); // add alt tag for screen readers to represent summary

        } else {
            
            $(listIcon).css(
                "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
            ); // set background image
            $(listIcon).attr("alt", "Not specified"); // add alt tag for screen readers to represent summary

        } // if statement close

        var listIconHtml = "<p class='minTemp' alt='Min'><span></span>" + Math.round(future.temperatureMin) + "</span><sup>&degC</span></p>" +
            "<p class='maxTemp' alt='Max'><span></span>" + Math.round(future.temperatureMax) + "</span><sup>&degC</span></p>"; // to add to each list item

        listDiv.append("<h5>" + weekday + "</h5>");
        listIcon.append(listIconHtml);

        // append container div with weekday div
        $("#col" +i).append(listDiv);
        // append the min-max temp info to the container div
        $("#col" +i).append(listIcon);

    } // close for loop

} // close futureTemps function


// FUNCTION to return ICON
function returnIcon(icon) {

} // close returnIcon function


// FUNCTION to create SLIDER for MOON PHASES

function moonSlide(event) { // function to hide/show moon phase div by sliding

    $("#moonPhases").slideToggle("slow", "linear"); // toggle the slide show/hide of moon phases div depending on its current state

    if ($("#moonButton").css("display") == "block") { // if the screen size is correct and the heading is correct
        
        $("#moonPhases").css({
            "display":"block",
            "float":"left"
        }); // change the css display to block
        $("#moonButton h3").text("Moon phases [x]"); // change the text to close

    } else {

        $("#moonButton h3").text("Moon phases"); // change the text to open

    } // close if statement
    
} // close futureSlide function

$("#moonButton").click(moonSlide); // call the futureSlide function on moonButton click


// FUNCTION to create SLIDER for FUTURE temps

function futureSlide(event) { // function to hide/show future div by sliding

    $("#future").slideToggle("slow", "linear"); // toggle the slide show/hide of future div depending on its current state

    if ($("#futureButton h3").text() == "Weekly forecast") { // if the text of the titleButton heading is equal to Show

        $("#future").css(
            "display", "block"
        ); // change the css display to block
        $("#futureButton h3").text("Weekly forecast [x]"); // change the text to close

    } else {

        $("#futureButton h3").text("Weekly forecast"); // change the text to open

    } // close if statement
    
} // close futureSlide function

$("#futureButton").click(futureSlide); // call the futureSlide function on futureButton click
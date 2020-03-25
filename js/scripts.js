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

        }

        function error(err) {

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
        var location = document.getElementById("#location");

        // LOCATION
        // get location and add to html tag
        $("#location").append(locString);

        //        console.log(locString);

    }); // close getJSON

}; // close getLocationName function


// FUNCTION to load data from DARK SKY API
function getWeatherData(currentLocation) {
    console.log('in get weather data');

    // my Dark Sky API key
    var keyDarkSky = "008bf272749fe7c833b4606af967ab5e";

    // Dark Sky API call
    var urlDarkSky = "https://api.darksky.net/forecast/" + keyDarkSky + "/" + currentLocation + "?units=auto&callback=?";

    var term = document.getElementById("term");

    // make request to server using Dark Sky API call
    $.getJSON(urlDarkSky, function (data) {
        console.log('getting data');
        console.log(data); // show API data

        // call updateTimeTemp every minute


        var maxTemp = data.daily.data[0].temperatureMax; // get max temperature for today

        // MAX TEMPERATURE
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

        // call tempDesc and send the temp data with it
        tempDesc(temp);

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

}; // close getweatherdata function


// FUNCTION to update time
function updateTimeTemp(currently) {
    console.log('in update time fn')

    // var to hold current date/time from API
    var currentDate = currently.time * 1000;
    var temp = currently.temperature; // get current temperature

    var currentTime = moment(currentDate).format('hh:mm A');
    var currentDate = moment(currentDate).format('dddd, MMMM Do');

    console.log(currentTime);

    //TIME
    $("#time span").html(currentTime);

    // DATE
    // get current date and add to html tag
    $("#date span").html(currentDate);

    // TEMP
    // get current temp and add to html tag
    $("#temp span").html(temp.toFixed(1)); // round to 1 decimal place

}; // updateTimeTemp function close


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

    }; // if statement close

}; // dateSeason function close


// FUNCTION to determine the DESCRIPTION to display based on the current temperature
function tempDesc(temp) {

    if (temp >= 40) { // 40 or above

        $("#temp").css(
            "color", "#9e0b00"
        ); // change text color to dark red

    } else if (temp >= 35 && temp <= 39.9) { // between 35-39

        $("#temp").css(
            "color", "#ff0000"
        ); // change text color to red

    } else if (temp >= 30 && temp <= 34.9) { // between 30-34

        $("#temp").css(
            "color", "#ff6a00"
        ); // change text color to orange

    } else if (temp >= 25 && temp <= 29.9) { // between 25-29

        $("#temp").css(
            "color", "#ffd500"
        ); // change text color to sunny yellow

    } else if (temp >= 20 && temp <= 24.9) { // between 20-24

        $("#temp").css(
            "color", "#fff200"
        ); // change text color to yellow

    } else if (temp >= 15 && temp <= 19.9) { // between 15-19

        $("#temp").css(
            "color", "#91ff00"
        ); // change text color to green

    } else if (temp >= 10 && temp <= 14.9) { // between 10-14

        $("#temp").css(
            "color", "#00ffb7"
        ); // change text color to warm green

    } else if (temp >= 0 && temp <= 9.9) { // between 0-9

        $("#temp").css(
            "color", "#00a6ff"
        ); // change text color to blue

    } else { //below 0

        $("#temp").css(
            "color", "#00e1ff"
        ); // change text color to ice blue

    }; // if statement close

}; // tempDesc function close


// FUNCTION to determine the ICON to display based on the current temperature
function tempIcon(data) {

    var circleCurrentSummary = document.getElementById("circleSummary");
    var sky = document.getElementById("currently");
    var weatherIcon = document.getElementById("currentTemp");

    var currentIcon = data.currently.icon; // get current temperature icon
    var defaultIcon = document.getElementById("defaultIcon");

    //console.log(currentIcon); // show current icon

    if (currentIcon == "clear-day") { // clear day

        $(sunny).css(
            "display", "block"
        ); // show "sunny" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/sun.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "clear-night") { // clear night

        $(night).css(
            "display", "block"
        ); // show "night" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(60deg, #29323c 0%, #485563 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/night.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "rain") { // rain

        $(rain).css(
            "display", "block"
        ); // show "rain" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/rain.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "snow") { // snow

        $(snowfall).css(
            "display", "block"
        ); // show "snowfall" icon and description
        $(circleCurrentTemp).css(
            "background-image", "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/snow.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "sleet") { // sleet

        $(sleet).css(
            "display", "block"
        ); // show "sleet" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/sleet.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "wind") { // wind

        $(windy).css(
            "display", "block"
        ); // show "windy" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/wind.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "fog") { // foggy

        $(foggy).css(
            "display", "block"
        ); // show "foggy" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/fog.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "cloudy") { // cloudy

        $(cloudy).css(
            "display", "block"
        ); // show "cloudy" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/cloud.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "partly-cloudy-day") { // partly cloudy

        $(cloudy).css(
            "display", "block"
        ); // show "cloudy" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/partcloud.jpg)",
            "background-size": "cover"
        }); // set background image

    } else if (currentIcon == "partly-cloudy-night") { // partly cloudy night

        $(cloudyNight).css(
            "display", "block"
        ); // show "partly cloudy night" icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #09203f 0%, #537895 100%)"
        ); // change circle li background to gradient
        $(weatherIcon).css({
            "background-image": "url(/images/partcloud.jpg)",
            "background-size": "cover"
        }); // set background image

    } else {

        $(sunny).css(
            "display", "block"
        ); //show sun icon and description
        $(circleCurrentSummary).css(
            "background-image", "linear-gradient(to top, #209cff 0%, #68e0cf 100%)"
        ); // change circle li background to gradient

    }; // if statement close

}; // tempIcon function close

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

    }; // if statement close

}; // timeGreeting function close


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

    if (moon >= 0.01 && moon <= 0.24) { // 0.01-0.24 - waning crescent

        $(".circleMoons:nth-child(13)").css({
            "background-color": "#FFFFFF25",
            "box-shadow": "inset 1.2em 0 0.5em #EEEEEE, inset 1.2em 0 0.5em 0.2em #EEEEEE",
            "-moz-box-shadow": "inset 1.2em 0 0.5em #EEEEEE, inset 1.2em 0 0.5em 0.2em #EEEEEE"
        }); // set background colour and opacity 25%, set box shadow to create crescent on left
        $(".circleMoons:nth-child(13) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon == 0.25) { // 0.25 - first quarter moon

        $(".circleMoons:nth-child(10)").css(
            "background", "linear-gradient(90deg, #FFFFFF00 49%, #EEEEEE 51%)"
        ); // set background color and opacity to 0%, set gradient to create half moon on right
        $(".circleMoons:nth-child(10) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.26 && moon <= 0.49) { // 0.26-0.49 - waning gibbous

        $(".circleMoons:nth-child(15)").css({
            "background-color": "#dedede",
            "box-shadow": "inset -1em 0 0.5em #FFFFFF00, inset -1em 0 0.5em 0.2em #FFFFFF",
            "-moz-box-shadow": "inset -1em 0 0.5em #FFFFFF00, inset -1em 0 0.5em 0.2em #FFFFFF"
        }); // set background colour and opacity 25%, set box shadow to create gibbous on left
        $(".circleMoons:nth-child(15) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon == 0.5) { // 0.5 - full moon

        $(".circleMoons:nth-child(16)").css(
            "background-image", "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)"
        ); // set background to gradient
        $(".circleMoons:nth-child(16) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon >= 0.51 && moon <= 0.74) { // 0.51-0.74 - waxing gibbous

        $(".circleMoons:nth-child(17)").css({
            "background-color": "#dedede",
            "box-shadow": "inset 1em 0 0.5em #FFFFFF00, inset 1em 0 0.5em 0.2em #FFFFFF",
            "-moz-box-shadow": "inset 1em 0 0.5em #FFFFFF00, inset 1em 0 0.5em 0.2em #FFFFFF"
        }); // set background colour and opacity 25%, set box shadow to create gibbous on right
        $(".circleMoons:nth-child(17) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else if (moon == 0.75) { // 0.75 - third quarter moon

        $(".circleMoons:nth-child(14)").css({
            "background": "linear-gradient(-90deg, #FFFFFF00 49%, #EEEEEE 51%)",
            "color": "#333332"
        }); // set background color and opacity to 0%, set gradient to create half moon on left, set text color to charcoal

    } else if (moon >= 0.76 && moon <= 0.99) { // 0.76-0.99 - waxing crescent

        $(".circleMoons:nth-child(11)").css({
            "background-color": "#FFFFFF25",
            "box-shadow": "inset -1.2em 0 0.5em #EEEEEE, inset -1.2em 0 0.5em 0.2em #EEEEEE",
            "-moz-box-shadow": "inset -1.2em 0 0.5em #EEEEEE, inset -1.2em 0 0.5em 0.2em #EEEEEE"
        }); // set background colour and opacity 25%, set box shadow to create crescent on right
        $(".circleMoons:nth-child(11) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    } else { // 0 - new moon

        $(".circleMoons:nth-child(12)").css(
            "box-shadow", "0 0 0.75em 0 #fcfcfc"
        ); // set css glow
        $(".circleMoons:nth-child(12) h6").css(
            "color", "#333332"
        ); // set h6 text color to charcoal

    }; // if statement close

}; // moonPhase function close


// FUNCTION to determine the FUTURE TEMPS to display based on the current temperature
function futureTemps(data) {
    console.log('in future temps');

    console.log(data.daily);

    // loop through the data and add it to the ul
    // new li for each new item - starting tomorrow, therefore i = 1
    for (var i = 1; i < data.daily.data.length; i++) {

        //create the html element first
        var list = $("<li class='ahead'>"); // create new li for each future temp day


        var future = data.daily.data[i]; // the data for one day in the forecast

        var dateObj = new Date(future.time * 1000);

        //if we format with moment we don't need the loop
        var weekday = moment(dateObj).format('dddd');

        //        console.log(wkday);


        //        var calDay = new Array(7); // weekday array
        //        calDay[0] = "Sunday";
        //        calDay[1] = "Monday";
        //        calDay[2] = "Tuesday";
        //        calDay[3] = "Wednesday";
        //        calDay[4] = "Thursday";
        //        calDay[5] = "Friday";
        //        calDay[6] = "Saturday";
        //
        //        if (weekday == calDay[0]) {
        //
        //            weekday = calDay[1];
        //
        //        } else if (weekday == calDay[1]) {
        //
        //            weekday = calDay[2];
        //
        //        } else if (weekday == calDay[2]) {
        //
        //            weekday = calDay[3];
        //
        //        } else if (weekday == calDay[3]) {
        //
        //            weekday = calDay[4];
        //
        //        } else if (weekday == calDay[4]) {
        //
        //            weekday = calDay[5];
        //
        //        } else if (weekday == calDay[5]) {
        //
        //            weekday = calDay[6];
        //
        //        } else if (weekday == calDay[6]) {
        //
        //            weekday = calDay[0];
        //
        //        };

        // Check Icons
        var futureIcon = future.icon;

        console.log("index: " + i + ", " + weekday + ". ICON: " + futureIcon);

        //this doesn't exist yet (i.e. hasn't been written to the DOM), so you cant select it
        // var futureIconImg = document.getElementsByClassName("ahead");

        //instead, you want  to set the image on the list variable created above

        // if any of the elements of futureTempIcon array meet the condition
        if (futureIcon == "clear-day") { // clear day

            $(list).css({
                "background-image": "url(/images/sun.jpg)",
                "background-size": "cover"
            }); // set background image


        } else if (futureIcon == "clear-night") { // clear night

            $(list).css({
                "background-image": "url(/images/night.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "rain") { // rain

            $(list).css({
                "background-image": "url(/images/rain.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "snow") { // snow

            $(list).css({
                "background-image": "url(/images/snow.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "sleet") { // sleet

            $(list).css({
                "background-image": "url(/images/sleet.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "wind") { // wind

            $(list).css({
                "background-image": "url(/images/wind.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "fog") { // foggy

            $(list).css({
                "background-image": "url(/images/fog.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "cloudy") { // cloudy

            $(list).css({
                "background-image": "url(/images/cloud.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "partly-cloudy-day") { // partly cloudy

            $(list).css({
                "background-image": "url(/images/partcloud.jpg)",
                "background-size": "cover"
            }); // set background image

        } else if (futureIcon == "partly-cloudy-night") { // partly cloudy night

            $(list).css({
                "background-image": "url(/images/cloudnight.jpg)",
                "background-size": "cover"
            }); // set background image

        } else {
            $(list).css({
                "background-image": "url(/images/sun.jpg)",
                "background-size": "cover"
            }); // set background image

        }; // if statement close

        var listHtml = "<h5>" + weekday + "</h5>" +
            "<p class='minTemp'<span></span>" + Math.round(future.temperatureMin) + "</span><sup>&degC</span></p>" +
            "<p class='maxTemp'<span></span>" + Math.round(future.temperatureMax) + "</span><sup>&degC</span></p>"; // to add to each list item

        list.append(listHtml); // append to html

        // append the li info to the ul
        $("#futureDays").append(list);

    }; // for loop close

}; //close futureTemps


function returnIcon(icon) {

}

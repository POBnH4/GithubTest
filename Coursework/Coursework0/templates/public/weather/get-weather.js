/* JS to get local weather */

/*
$(document).ready(function() {

    // MetOffice DataPoint - list of locations
    var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=b02b078d-1b64-44b3-90c7-3caacdbd442b";

    $.getJSON(url,function(data) {
        /* Extract from MetOffice DataPoint
        data-location-search-example > location-search.html

        var closest, locations, output = [], standpoint, i;

        // parse the sitelist.json data into an array of Location objects
        locations = parseJSON(data);

        var lat = document.getElementById('lat').innerHTML;
        var long = document.getElementById('long').innerHTML;


        // where you are
        standpoint = new Location(null, "Your location", document.getElementById('lat').value, document.getElementById('lon').value);

    })
});
*/

var url = "http://datapoint.metoffice.gov.uk/public/data/";
var key = "key=b02b078d-1b64-44b3-90c7-3caacdbd442b";

// var closest;
/*
var getWeather = function(lat,long) {

    getSite(lat,long);

    // var id = site.location.id;

    console.log("ID: " + closest.location.id);


    var forecast = url + "val/wxfcs/all/json/" + id + key;

    $.getJSON(forecast,function(data) {
        console.log(data);
    });


};
*/

var getWeather = function(lat,long) {
    var closest, locations, standpoint;

    var siteList = url + "val/wxfcs/all/json/sitelist?" + key;

    $.getJSON(siteList,function(data){


        // parse the sitelist.json data into an array of Location objects
        locations = parseJSON(data);

        // where you are
        standpoint = new Location(null, "Munro location", lat, long);

        // just interested in the closest location in the list
        closest = getNearest(standpoint, locations);

        console.log("Closest: " + closest.location.id);

        var forecast = url + "val/wxfcs/all/json/" + closest.location.id + "?res=3hourly&" + key;

        $.getJSON(forecast, function(result) {
            console.log(result);
            displayForecast(result);
        })

    });

    // return closest;
};


// Image Arrays for Weather
// Position cooresponds to MetOffice definitions
// https://www.metoffice.gov.uk/datapoint/support/documentation/code-definitions

var weatherIcon = [
    "clear-night.png",
    "sunny-day.png",
    "partly-cloudy-night.png",
    "sunny-intervals.png",
    "", // index: 4 - not used
    "mist.png",
    "fog.png",
    "cloudy.png",
    "overcast.png",
    "light-rain-shower-night.png",
    "light-rain-shower-day.png",
    "drizzle.png",
    "light-rain.png",
    "heavy-rain-shower-night.png",
    "heavy-rain-shower-day.png",
    "heavy-rain.png",
    "sleet-shower-night.png",
    "sleet-shower-day.png",
    "sleet.png",
    "hail-shower-night.png",
    "hail-shower-day.png",
    "hail.png",
    "light-snow-shower-night.png",
    "light-snow-shower-day.png",
    "light-snow.png",
    "heavy-snow-shower-night.png",
    "heavy-snow-shower-day.png",
    "heavy-snow.png",
    "thunder-shower-night.png",
    "thunder-shower-day.png",
    "thunder.png"
];





var displayForecast = function(weather) {

    //Variables
    var date, day, dayOfWeek, days, i, imgWeather, imgWind, j, k, numForecasts, output, tab, tabcontent, time, weekdays;

    //Get 5-day forecasts
    days = weather.SiteRep.DV.Location.Period;

    //display day data
    // console.log(days);

    //For each day
    for (i = 0; i < days.length; i++) {



        tab = "tab" + (i + 1);

        if (tab == "tab1") {
            document.getElementById(tab).innerHTML = "Today";
        }
        else if (tab == "tab2") {
            document.getElementById(tab).innerHTML = "Tomorrow";
        }
        else {
            date = new Date(days[i].value);

            weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

            dayOfWeek = weekdays[date.getDay()];

            document.getElementById(tab).innerHTML = dayOfWeek;
        }





        // Open table tag for forecasts
        output = "<table class='forecast'><tr>";

        //get forecasts for day
        day = days[i].Rep;

        // console.log(day);

        // output = "";
        // output = "<th>6AM</th><th>6AM</th><th>6AM</th><th>6AM</th><th>6AM</th>

        //determine starting forecast (missing out 12am and 3am)
        if (day.length == 8) {
            j = 2;
        }
        else if (day.length == 7) {
            j = 1;
        }
        else {
            j = 0;
        }


        // if (days.length < 6) {
        //     $('.forecast').find('th').css("width","calc(400px/" + days.length + ")");
        // }

        //for each forecast
        for (j; j < day.length; j++) {

            // if ()

            // console.log(day[j]);

            //Table per forecast
            output += "<td><table><tr>";

            time = parseInt(day[j].$)/60;

            //Time of forecast
            output += "<th>" + time + ":00</th>";

            output += "</tr><tr>";

            // weather icon
            if (day[j].W == "NA") {
                imgWeather = weatherIcon[0];
            }
            else {
                imgWeather = weatherIcon[parseInt(day[j].W)];
            }

            output += "<td class='wIcon'><img src='/img/weather/" + imgWeather + "'></td>";



            output += "</tr><tr>";

            // temperature and feels-like-temp
            output += "<td>" + day[j].T + "°C<br/><span class='fTemp tooltip'>" + day[j].F + "°C<span class='tooltiptext'>Feels-like Temperature</span></span>";

            output += "</tr><tr>";

            // wind direction icon

            imgWind = day[j].D + ".png";

            output += "<td class='cIcon'><img src='/img/wind/" + imgWind + "'></td>";

            output += "</tr><tr>";

            // chance of rain
            output += "<td>" + day[j].Pp + "%</td>";

            output += "</tr></table></td>"

        }

        output += "</tr></table>";

        tabcontent = "day" + (i + 1);

        document.getElementById(tabcontent).innerHTML = output;

    }

};


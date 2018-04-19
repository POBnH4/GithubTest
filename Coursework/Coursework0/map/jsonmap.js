var mymap = L.map('mapid').setView([56.8189342,-4.0756789], 6.56);

var baseMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZHI5OCIsImEiOiJjamRvY3FlZWowMTV6MnFxbGx6d2wzMnM4In0.ZU7d_lasqNE3eRJq3vol2Q'
}).addTo(mymap);


//Icon Class for Custom Pins
var mntIcon = L.Icon.extend({
    options: {
        iconSize: [25,40],
        iconAnchor: [12.5,40]
    }
});

//Custom Pins
var greenIcon = new mntIcon({iconUrl: 'img/greenPin.png'}),
    yellowIcon = new mntIcon({iconUrl: 'img/yellowPin.png'}),
    redIcon = new mntIcon({iconUrl: 'img/redPin.png'}),
    blueIcon = new mntIcon({iconUrl: 'img/bluePin.png'}),
    smrIcon = new mntIcon({iconUrl: 'img/smrPin.png'});


//http://zero-invent.codio.io/Munro-Mountains-Coursework-/%2FMunroMap/%2Fjson/munro.json


//var url = "https://zero-invent.codio.io/Munro-Mountains-Coursework-/%2FMunroMap/%2Fjson/munro.json";

/*
var blue = L.marker([56.79685,-5.003508], {icon:blueIcon});
blue.mName = "Ben Nevis";
blue.addTo(mymap);
*/


//Testing for map pins with JSON

/*
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "json/munro.json",
        success: function(result)
        {
            console.log(result.munros);
            var munros = result.munros;

            for (var i = 0; i < munros.length; i++) {
                var marker = L.marker([munros[i].lat,munros[i].lng], {icon:greenIcon});

                marker.mName = munros[i].name;
                marker.mHeight = munros[i].height;
                marker.mLat = munros[i].lat;
                marker.mLng = munros[i].lng;
                marker.mLocation = munros[i].location;
                marker.mImage = munros[i].image;

                //Test for "Bagged"
                marker.mBag = munros[i].bagged;
                if (munros[i].bagged == "true") {
                    marker.setIcon(blueIcon);
                }

                marker.bindTooltip(munros[i].name,{direction:"top",offset:[0,-40]});

                marker.on('click',openBox);

                marker.addTo(mymap);
            }
        }
    })
})
*/

/* Layer Groups for Pins */
var smrLocations = L.layerGroup([]);
var munroMountains = L.layerGroup([]);

var munroEasy = L.layerGroup([]);
var munroMedium = L.layerGroup([]);
var munroHard = L.layerGroup([]);




//Map markers loaded using JSON
$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "../list/munrodata.json",
    success: function(result)
    {
      console.log(result.munros);
      var munros = result.munros;

      for (var i = 0; i < munros.length; i++) {
          // var marker = L.marker([munros[i].latitude,munros[i].longitude], {icon:greenIcon});
          var marker = L.marker([munros[i].latitude,munros[i].longitude]);

          // console.log(munros[i]);

          marker.mName = munros[i].name;
          marker.mHeight = munros[i].height;
          marker.mLat = munros[i].latitude;
          marker.mLng = munros[i].longitude;
          marker.mLocation = munros[i].region;
          // marker.mImage = munros[i].image;
          marker.mDiff = munros[i].difficulty;


          marker.bindTooltip(munros[i].name,{direction:"top",offset:[0,-40]});

          marker.on('click',openBox);


          if (marker.mDiff == "Easy") {
              marker.setIcon(greenIcon);
              munroEasy.addLayer(marker);
          }
          else if (marker.mDiff == "Intermediate") {
              marker.setIcon(yellowIcon);
              munroMedium.addLayer(marker);
          }
          else if (marker.mDiff == "Hard") {
              marker.setIcon(redIcon);
              munroHard.addLayer(marker);
          }
          else {
              marker.setIcon(blueIcon);
              munroMountains.addLayer(marker);
          }



          // marker.addTo(mymap);
          // munroMountains.addLayer(marker);
    }
  }
  })
})


/* Add SMR Pins to Map using JSON data */
$(document).ready(function() {
   $.ajax ({
       type: "GET",
       url: "smr.json",
       success: function(result)
       {
           console.log(result.smr);
           var smr = result.smr;

           for (var i = 0; i < smr.length; i++) {
               var marker = L.marker([smr[i].lat,smr[i].long], {icon: smrIcon});

               marker.smrName = smr[i].name;

               marker.bindTooltip(smr[i].name,{direction:"top", offset:[0,-40]});

               // marker.addTo(mymap);
               smrLocations.addLayer(marker);
           }
       }
   })
})


//Add overlays to map

// var baseMaps = {
//     // "Streets": baseMap
// }

/*
var mapOverlays = {
    "SMR": smrLocations.addTo(mymap),
    "Munros": munroMountains.addTo(mymap)
}
*/


var mapOverlays = {
    "SMR Stations": smrLocations.addTo(mymap),
    "Beginner Munros": munroEasy.addTo(mymap),
    "Intermediate Munros": munroMedium.addTo(mymap),
    "Difficult Munros": munroHard.addTo(mymap),
    "Other (Testing)": munroMountains.addTo(mymap)
}



L.control.layers(null,mapOverlays,{collapsed:false}).addTo(mymap);


/*
//Add Name tooltip to marker
blue.bindTooltip("Ben Nevis", {direction:"top", offset:[0,-40]}).openTooltip();


//Marker on click use function to open info panel
var munro = "Ben Nevis";
blue.on('click',openBox);
*/


//MODAL BOX - OPEN FUNCTION (ON MARKER)

function openBox(e) {

    var m = e.target;

    var munro = document.getElementById("mName");
    munro.innerHTML = m.mName;

// No image urls in JSON file, placeholder image used
    // var img = document.getElementById("mImg");
    // img.src = m.mImage;

    var info = document.getElementById("mText");

    var output = "<table><tr><td>Height</td><td>" + m.mHeight + "</td></tr>";
    output += "<tr><td>Location</td><td>" + m.mLocation + "</td></tr>";
    output += "<tr><td>Latitude</td><td>" + m.mLat + "</td></tr>";
    output += "<tr><td>Longitude</td><td>" + m.mLng + "</td></tr></table>";

    info.innerHTML = output;

    var modal = document.getElementById("popup");
    modal.style.display = "flex";
}


//MODAL BOX - CLOSE FUNCTIONS

var modal = document.getElementById("popup");

var span = document.getElementById('close');

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function listenerEx(i) {
    if($("#checkBox" + i).is(":checked")) {
        $("#bMount" + i).show();
    } else {
        $("#bMount" + i).hide();
    }
}

$(document).ready(function() {
    var displayMunros = $('#accordion');

    $.ajax({
      type: "GET",
      url: "../list/munrodata.json",
      success: function(result)
      {
        console.log(result.munros);
        var munros = result.munros;

        for(var i = 0; i < munros.length; i++)
        {
          var output = "<h4 class='munrotitle'>" + munros[i].name + "<img class='bMount' id='bMount" + i + "' src='Mountain_Pins/blueMnt.png' alt='Blue Mountain'>";

          output += "</h4><div class='whiteback'><table><tr><td>Description: </td><td>" + munros[i].description + "</td></tr><tr><td>Region: </td><td>" + munros[i].region + "</td></tr><tr><td>Height: </td><td>" + munros[i].height + "</td></tr><tr><td>Latitude: </td><td>" + munros[i].latitude + "</td></tr><tr><td>Longitude: </td><td>" + munros[i].longitude + "</td></tr><tr><td>Grid Reference: </td><td>" + munros[i].gridReference + "</td></tr><tr><td>Difficulty: </td><td>";

            if (munros[i].height > "914m") {
                output += "<img src='Mountain_Pins/greenMnt.png' alt='Green Mountain'>";
            } else if (munros[i].height < "1219m") {
                output += "<img src='Mountain_Pins/yellowMnt.png' alt='Yellow Mountain'><img src='Mountain_Pins/yellowMnt.png' alt='Yellow Mountain'>";
            } else if (munros[i].height > "1219m") {
                output += "<img src='Mountain_Pins/redMnt.png' alt='Red Mountain'><img src='Mountain_Pins/redMnt.png' alt='Red Mountain'><img src='Mountain_Pins/redMnt.png' alt='Red Mountain'>";
            }

          output += "</td></tr><tr><td>Climbed: </td><td><input type='checkbox' id='checkBox" + i + "' onclick='listenerEx(" + i + ")'></td></tr></table></div>";
            
            currentFunction = function() {
                if($("#checkBox" + i).is(":checked")) {
                    $("#bMount" + i).show();
                    console.log("checked");
                } else {
                    console.log("unchecked");
                    $("#bMount" + i).hide();
                }
            };
            
//            console.log("creating listener for " + i);
            $("#checkBox" + i).click(function() {
                currentFunction();
                console.log(i);
            });
            
          displayMunros.append(output);
        }
        $( "#accordion" ).accordion({collapsible:true, active: false});
        $(".bMount").hide();
      }
  });
});

function myFunction() {
    // Declare variables
    var input, filter, h4, div, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    h4 = document.getElementsByTagName("h4");
//    acc = document.getElementById("accordion");
    div = document.getElementsByClassName("whiteback");
//    table = div.getElementsByTagName("table");
    
    // Loop through all munros, and hide those that don't match the search query
    // DO NOT CHANGE
    for(i = 0; i < h4.length; i++) {
        a = h4[i];
        if(a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            h4[i].style.display = "";
        } else {
            h4[i].style.display = "none";
        }
    }
    // DO NOT CHANGE
}

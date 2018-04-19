$(function() {
    $('#select').click(function() {

        $.ajax({
            type: "GET",
            url: "munrodata.json",
            success: function(result) {
                var htmlstring = "";
                for (var i in result) {
                    var name = result[i].name;
                    htmlstring += "<li>" + name + "</li>";
                }
                $("#results").html(htmlstring);
            }
        })

    });
})

/*
function getMunro() {
    // var url = "munrodata.json";
    /*
    $.getJSON(url, function(jsondata) {
        addMunro(jsondata);
    })
    */
    /*
    $.ajax({
        type: "GET",
        url: "munrodata.json",
        success: function(result) {
            var htmlstring = "";
            for (var i in result) {
                var name = result[i].name;
                htmlstring += "<li>" + name + "</li>";
            }
            $("#results").html(htmlstring);
        }
    })
    */

}
*/

/*
function addMunro() {
    var htmlstring = "";
    for (var i = 0; i < 5; i++) {
        var name = jsondata.Search[i].name;
        htmlstring += "<li>" + name + "</li>";
    }
    $("#results").html(htmlstring);
}
*/
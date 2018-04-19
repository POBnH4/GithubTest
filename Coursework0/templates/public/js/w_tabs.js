document.getElementById('tab1').click();

function openDay(evt,day) {

    $('.tabcontent').css('display','none');

    $('.tablink').removeClass('active');

    document.getElementById(day).style.display = "block";
    evt.currentTarget.className += " active";
}
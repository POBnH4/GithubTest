/*
window.onscroll = function() {
    stickyFunction()
};

var header = document.getElementById("navigation");

var sticky = header.height;

function stickyFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}
*/


console.log($('.parallax').height());
console.log($(this).scrollTop());

var yourNavigation = $(".nav");
stickyDiv = "sticky";
yourHeader = $('.parallax').height();
// console.log(yourHeader);

$(window).scroll(function() {
    if( $(this).scrollTop() > yourHeader ) {
        yourNavigation.addClass(stickyDiv);
    } else {
        yourNavigation.removeClass(stickyDiv);
    }
});
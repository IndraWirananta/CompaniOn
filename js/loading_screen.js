$(window).on("load", function () {
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function () {
        $(".loader-wrapper").fadeOut("slow");
    }, delayInMilliseconds);

});
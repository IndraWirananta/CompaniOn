$(window).on("load", function () {
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function () {
        document.body.style.overflow = "overlay";
        $(".loader-wrapper").fadeOut("slow");
    }, delayInMilliseconds);

});
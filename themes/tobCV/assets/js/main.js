$(function(){
	
    var mq = false;
    if (window.matchMedia == 'function')
        mq = window.matchMedia("(max-width: 1024px)");    

    if (!mq.matches) {
        colorPickerOptions = {
            onChange: function (hsb, hex, rgb) {
                ChangeAppColor(hex);
            }
        };

        $('.colorPicker').ColorPicker(colorPickerOptions);

        // show/hide business card on scroll event
        $(window).scroll(function () {
            if (scrollPos = $(document).scrollTop() >= 250) {
                $('#businessCard').fadeIn('slow', function () { });
            }
            else {
                $('#businessCard').fadeOut('slow', function () { });
            }
        });

        // Initialize timeline plugin
        $(".mainBody").timeline();
    }

    // Initialize popover plugin
	$('#Napoleon').popover({
	    name: 'Napoleon Bonaparte',
	    title: 'COMMANDER IN CHIEF',
	    webSite: 'www.napoleon.com',
	    mail: 'napoleon.bonaparte@napoleon.fr',
	    phone: '+46 (0)70-123 45 67'
	}, '#CC3300');

	$('#Governor_Dinwiddie').popover({
	    name: 'Governor Dinwiddie',
	    title: 'GOVERNOR',
	    webSite: 'www.dinwiddie.gov',
	    mail: 'governor@dinwiddie.gov',
	    phone: '+46 (0)70-987 65 43'
	}, '#CC3300');

	$('#lord_fairfax').popover({
	    name: 'Thomas Lord Fairfax',
	    title: 'GENERAL',
	    mail: 'fairfax@parlament.com',
	    phone: '+46 (0)70-111 22 33'
	}, '#CC3300');

	$('#lord_fairfax2').popover({
	    name: 'Thomas Lord Fairfax',
	    title: 'GENERAL',
	    mail: 'fairfax@parlament.com',
	    phone: '+46 (0)70-111 22 33'
	}, '#CC3300');

});

function ChangeAppColor(hexColor) {

    $('.appBgColor').css('background-color', '#' + hexColor);
    $('.appFontColor').css('color', '#' + hexColor);
    $('.appBorderColor').css('border-color', '#' + hexColor);
    $('.arrow').css('border-right-color', '#' + hexColor);
    $('.tobPopover').css('border-color', '#' + hexColor);
}

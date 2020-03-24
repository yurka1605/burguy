$( document ).ready(function() {
    $('#tel').mask('+7 (999) 999-99-99');
});
$(window).scroll(function() {
    var top = $(window).scrollTop();
    $('section').each((i, el) => {
        var blockTop = $(el).offset().top - 100;
        var height = $(el).height();
        if (blockTop < top && blockTop + height > top ) {
            var className = $(el).attr('class');
            $('.nav__item.active').removeClass('active');
            $('.nav__item').each((i, el) => {
                if ($(el).data('class') === className) {
                    $(el).addClass('active');
                }
            });
        } 
    });
});

$('.nav__item:not(.active)').click(function(e) {
    e.preventDefault();
    var className = $(this).data('class');
    var top = $(`section.${ className }`).offset().top - 80;
    $('html, body').animate({scrollTop: top}, 300);
});
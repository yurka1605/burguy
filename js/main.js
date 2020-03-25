$( document ).ready(function() {
    $('#tel, #tel1').mask('+7 (999) 999-99-99');
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

$('.amount__controls').click(function() {
    var amountControl = $('.amount__num');
    var val = parseInt($(amountControl).text(), 10);

    if ($(this).hasClass('plus')) {
        $(amountControl).html(val === 100 ? val : val + 5);
    } else {
        $(amountControl).html(val === 5  ? val : val - 5);
    }
});

$('.products__btn').click(function () {
    var val = parseInt($(this).children('.products__item_price').text(), 10);
    var name = $(this).prev().children('h4').text();
    openPopup(val, name);
});

$('.popup .submit').on('click', function () {
    // собираем данные с формы и отправляем
    closePopup();
});

$('.popup-bg').on('click', function () {
    closePopup();
});

function openPopup(val, name) {
    if (val > 999) {
        var hundred = parseInt(val/1000, 10);
        val = `${ hundred } ${ val - hundred * 1000 }`;
    }
    $('.popup .summ').html(val);
    $('.popup .product__name').html(name);
    $('body').addClass('active-popup');
}

function closePopup() {
    $('body').removeClass('active-popup');
    // если захотеть можно почистить форму, но какой смысл, 
    // если те сумма вбивается автоматом и полезнее будет оставить данные
    // чтобы не вводить повторно 
}
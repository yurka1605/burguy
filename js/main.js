$( document ).ready(function() {
    $('#tel, #tel1').mask('+7 (999) 999-99-99');
    const products = JSON.parse(sessionStorage.getItem('products'));
    if (products) {
        $('.amount__products').text(products.length);
        $('.amount__products_mobile').text(products.length);
    }
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

/* ===================================== Действия пользователя ================================= */

// open cartoon
$('.header__cartoon').click(function () {
    let summ = 0;
    if (parseInt($('.amount__products').text(), 10) > 0) {
        const products = JSON.parse(sessionStorage.getItem('products'));
        let html = '';
        products.map(function (item, i) {
            const itemSumm = item['Сумма'];
            const el = `<li class="product__list_item" data-num="${ i + 1 }">
                <span class="cartoon-item__name">${ item['Название продукта'] }</span>
                <div class="form__price">
                    <div class="amount">
                        <span onclick="changeAmount(this)" class="cartoon__controls minus">-</span>
                        <span class="cartoon__num">${ item['Количество']}</span>
                        <span onclick="changeAmount(this)" class="cartoon__controls plus">+</span>
                    </div>
                </div>
                <div class="cartoon__summ"><span class="cartoon__summ_val">${ itemSumm }</span><span> руб.</span></div>
                <div style="visibility: hidden;" class="cartoon__price">${ item['Цена'] }</div>
                <div onclick="deleteItem(this)" class="cartoon__del">×</div>
            </li>`;
            html = html + el;
            summ += parseInt(itemSumm.replace(' ',''), 10);
        });
        $('.products__list').html(html);
        $('.summ__all').text(editSumm(summ));
        $('body').addClass('active');
    } else {
        $('.empty-basket').addClass('active');
        setTimeout(() => {
            $('.empty-basket').removeClass('active');
        }, 5000);
    }
});

// menu item
$('.nav__item:not(.active)').click(function(e) {
    e.preventDefault();
    $('.mobile-menu').removeClass('active');
    $('body').removeClass('active-menu');
    var className = $(this).data('class');
    var top = $(`section.${ className }`).offset().top - 80;
    $('html, body').animate({scrollTop: top}, 300);
});

// count amount
$('.amount__controls').click(function() {
    var price = parseInt($('.popup .summ').data('price'), 10);
    const amount = amountControls(this,'amount');
    $('.popup .summ').html(editSumm(price * amount));
});

// count cartoon
// $('.cartoon__controls').click(function() {
//     changeAmount(this);
// });

// кнопка добавления товара
$('.products__btn').click(function () {
    var val = parseInt($(this).children('.products__item_price').text(), 10);
    var name = $(this).prev().children('h4').text();
    openPopup(val, name);
});

// + product popup
$('.popup .submit').on('click', function () {
    let products = JSON.parse(sessionStorage.getItem('products'));
    const item = {
        'Название продукта': $('.popup .product__name').text(),
        'Цена': $('.popup .summ').data('price'),
        'Количество': $('.amount__num').text(),
        'Сумма': $('.popup .summ').text(),
    }
    let haveEl = false;
    if (products) {
        products = products.map(el => {
            if (el['Название продукта'] === item['Название продукта']) {
                haveEl = true;
                el = item;
            }
            return el;
        });
        products = haveEl ? products : [...products, item];
    } else {
        products = [item];
    }
    if (!haveEl) {
        let amount = parseInt($('.amount__products').text(), 10) + 1;
        $('.amount__products').text(amount);
        $('.amount__products_mobile').text(amount);
    }
    sessionStorage.setItem('products', JSON.stringify(products));
    closePopup();
});

// Оформление заказа
$('.cartoon .submit').on('click', function (e) {
    e.preventDefault();
    // собираем данные с формы и отправляем
    const data = {
        'Форма': $(this).parent().parent().parent().children('.form__title').text(),
        'Имя': $('#name1').val(),
        'E-mail': $('#mail1').val(),
        'Телефон': $('#tel1').val(),
        'Продукты:': '',
    }

    const products = JSON.parse(sessionStorage.getItem('products'));
    products.map(el => {
        data[`${ el['Название продукта'] }`] = `
            Цена: ${ el['Цена'] }<br>
            Количество: ${ el['Количество'] }<br>
            Сумма: ${ el['Сумма'] }
        `;
    });

    data['Итог'] = $('.summ__all').text();

    if (data['Имя'] !== '' && data['E-mail'] !== '' && data['Телефон'] !== '' && $('#check1').prop("checked")) {
        request = send(data);
        request.done(function( msg ) {
            console.log(msg);
            sessionStorage.setItem('products', null);
            $('.amount__products').text(0);
            $('.amount__products_mobile').text(0);
            $('.popup__thanks').addClass('active');
        });
        request.fail(function(jqXHR, textStatus) {
            console.log(textStatus);
        })
    }
});

// форма контактов
$('.contacts .submit').on('click', function () {
    // собираем данные с формы и отправляем
    const data = {
        'Форма': $(this).parent().children('.form__title').text(),
        'Имя': $('#name').val(),
        'E-mail': $('#mail').val(),
        'Телефон': $('#tel').val(),
    }

    if (data['Имя'] !== '' && data['E-mail'] !== '' && data['Телефон'] !== '' && $('#check').prop("checked")) {
        send(data);
        setTimeout(() => {
            $('#name').val('');
            $('#mail').val('');
            $('#tel').val('');
        }, 100);
    }
});

// закрытие попапов
$('.popup-bg, .cartoon__close, .popup-bg, .popup__close').on('click', function () {
    closePopup();
});

// open menu
$('.burger-btn').on('click', function () {
    $('.mobile-menu').addClass('active');
    $('body').addClass('active-menu');
});

// close menu
$('.menu__close').on('click', function () {
    $('.mobile-menu').removeClass('active');
    $('body').removeClass('active-menu');
});

/* ===================== функции ======================== */
// открывает попап добавления товара
function openPopup(val, name) {
    $('.popup .summ').data('price', val);
    val = parseInt($('.amount__num').text(), 10) * val;
    $('.popup .summ').html(editSumm(val));
    $('.popup .product__name').html(name);
    $('body').addClass('active-popup');
}

// отделение тысяч
function editSumm(val) {
    const summ = `${ val }`;
    const arr = summ.split('');
    if (arr.length > 3) {
        val = '';
        arr.map((el, i) => {
            val = val + `${ el }`;
            if (i === 0 && arr.length === 4) {
                val = val + ' ';
            }
            if (i === 1 && arr.length === 5) {
                val = val + ' ';
            }
            if (i === 2 && arr.length === 6) {
                val = val + ' ';
            }
        });
    }
    return val; 
}

// закрывает попапы
function closePopup() {
    if ($('body').hasClass('active-popup')) {
        $('body').removeClass('active-popup');
        $('.amount__num').html('5');
    }
    if ($('body').hasClass('active')) {
        $('body').removeClass('active');
        $('.popup__thanks').removeClass('active');
    }
    // если захотеть можно почистить форму, но какой смысл, 
    // если те сумма вбивается автоматом и полезнее будет оставить данные
    // чтобы не вводить повторно 
}

// расчет количества
function amountControls(_this, selector) {
    var amountControl = $(_this).parent().children(`.${ selector }__num`);
    var val = parseInt($(amountControl).text(), 10);

    if ($(_this).hasClass('plus')) {
        $(amountControl).html(val = val === 100 ? val : val + 5);
    } else {
        $(amountControl).html(val = val === 5  ? val : val - 5);
    }
    return val;
}

// изменение количества товара в корзине
function changeAmount(_this) {
    const parent = $(_this).parent().parent().parent();
    const summHtml = $(parent).children('.cartoon__summ').children('.cartoon__summ_val');
    const oldSumm = parseInt(summHtml.text().replace(' ', ''), 10);
    const price = parseInt($(_this).parent().parent().parent().children('.cartoon__price').text(), 10);
    const amount = amountControls(_this,'cartoon');
    const newSumm = price * amount;
    let products = JSON.parse(sessionStorage.getItem('products'));
    const currentName = $(parent).children('.cartoon-item__name').text();
    products.map(function (el) {
        if (currentName === el['Название продукта']) {
            el['Количество'] = `${ amount }`;
            el['Сумма'] = editSumm(newSumm);
        }
    });
    sessionStorage.setItem('products', JSON.stringify(products));
    summHtml.text(editSumm(newSumm));
    let allSumm = $('.summ__all').text();
    allSumm = parseInt(allSumm.replace(' ', ''), 10) - oldSumm + newSumm;
    $('.summ__all').text(editSumm(allSumm));
}

// удалить айтем из списка
function deleteItem(_this) {
    const name = $(_this).parent().children('.cartoon-item__name').text();
    let products = JSON.parse(sessionStorage.getItem('products'));
    products = products.filter(el => el['Название продукта'] !== name);
    sessionStorage.setItem('products', JSON.stringify(products));
    const summ = parseInt($(_this).parent().children('.cartoon__summ').text().replace(' ', ''), 10);
    const allSumm = editSumm(parseInt($('.summ__all').text().replace(' ', ''), 10) - summ);
    $('.summ__all').text(allSumm);
    const currentAmount = parseInt($('.amount__products').text(), 10) - 1;
    $('.amount__products').text(currentAmount);
    $('.amount__products_mobile').text(currentAmount);
    if(currentAmount === 0) {
        console.log('корзина пуста');
    }
    $(_this).parent().remove();
}

// отправка заказа на почту
function send(data) {
    return $.ajax({
        type: 'POST',
        url: 'mail.php',
        data: data
    });
}
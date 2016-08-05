$(function(){

    // cartReculc();

    $('.nav-link-fave, .fave-btn').on('click', function(e)
    {
        e.preventDefault();
        if(!$(this).hasClass('disabled'))
        {
            var id = $(this).data("id");

            $.ajax({
                url: '/bouquet/addLike',
                type: 'post',
                dataType: 'json',
                data: {
                    "id": id
                },
                success: function (response) {
                    console.log(response);
                    $('.fave-btn').text(response.data.newLikeCount);
                }
            });
            $(this).addClass('disabled');
        }
    });

    // ***************** быстрый просмотр товара *****************
    $('.product-quick-view').on('click', function(e)
    {
        e.preventDefault();
        var loading = $('.loading');
        var id = $(this).data('id');
        var modal = $('.modal-quick-view');
        var modal_body = modal.find('.mfp-body');
        var product_img = modal.find('.product-img');
        var product_name = modal.find('.product-name');
        var price = modal.find('.price');
        var btn_cart_add = modal.find('.btn-cart-add');
        var fave_btn = modal.find('.fave-btn');
        // console.log(btn_to_cart);
        // price.empty();

        $.ajax({
            url: '/bouquet/getProduct',
            type: 'post',
            dataType: 'json',
            data: {
                "id": id
            },
            beforeSend: function(){
                modal_body.css({'opacity':'0'});
                loading.show();

            },
            success: function (response)
            {
                if(response.status == 'success')
                {
                    var data = response.data;
                    var priceToAppend = '';

                    if(parseFloat(data.discount) > 0) {
                        priceToAppend = '<span class="price-old">' + data.price_formatted + ' Р</span><span class="price-new">' + data.price_new_formatted + ' Р</span>';
                    } else {
                        priceToAppend = '<span class="price-cur">' + data.price_formatted + ' Р</span>';
                    }
                    // console.log(response.data.picture);

                    product_img.css({"background-image":"url('" + data.picture + "')"});
                    product_name.text(data.name);
                    price.html(priceToAppend);
                    btn_cart_add.attr('data-id', data.element_id);
                    btn_cart_add.attr('href', data.buy_link);
                    fave_btn.attr('data-id', data.element_id);
                    fave_btn.text(data.like_count);
                }

            },
            complete: function(){
                loading.fadeOut(200);
                modal_body.css({'opacity':'1'});
            }
        });

    });

    // ***************** добавить товар в корзину *****************
    $('.btn-cart-add').on('click', function(e){

        e.preventDefault();
        var id = $(this).attr('data-id');
        var count = $('.snipper-count-'+id).val();
        var nav_link_cart_count = $('.nav-link-cart').find('.count');
        // console.log(nav_link_cart_count);

        $.ajax({
            url: '/cart/add',
            type: 'post',
            dataType: 'json',
            data: {
                'id': id,
                'count': count
            },
            success: function (response) {
                console.log("11111");
                /*
                $.magnificPopup.open({
                    items: {
                        src: '#added-to-cart'
                    },
                    mainClass: 'mfp-zoom-in',
                    removalDelay:500,
                    type: 'inline'
                });
                */
                // console.log(response.data.cart_product_count);
                nav_link_cart_count.text(response.data.cart_product_count);
            }
        });
    });

    $('.cart-quantity-snipper').on('change',  function(){
        console.log('snipper change');
        var id = parseInt($(this).data('id'));
        //var price = parseFloat($(this).data('price'));
        var quantity = parseInt($(this).val());
        //console.log('id='+id+' price='+price+' quantity='+quantity);
        console.log('id='+id+' quantity='+quantity);

        $.ajax({
            url: '/cart/update',
            type: 'post',
            dataType: 'json',
            data: {
                id: id,
                quantity: quantity
            },
            success: function(response){
                // console.log(response);
            }
        });

        cartReculc();
    });

    $('.cart-delete-btn').on('click', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        var row = $('.cart').find('.cart-row-'+id);
        var nav_link_cart_count = $('.nav-link-cart').find('.count');

        console.log(row);
        $.ajax({
            url: '/cart/delete',
            type: 'post',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(response){
                console.log(response);
                if(response.status == 'deleted')
                {
                    row.slideDown(function(){
                        row.remove();
                    });
                    cartReculc();
                }
            }
        });
    });

});

function cartReculc()
{
    // console.log('cartReculc');
    var items = $('.cart').find('.cart-quantity-snipper');
    var totalSum = 0;
    // console.log(items);

    items.each(function(id, item){
        // console.log(item);
        var product_id = parseInt($(item).data('id'));
        var price = parseFloat($(item).data('price'));
        var quantity = parseInt($(item).val());
        totalSum += price * quantity;
        // console.log('id='+id+' price='+price+' quantity='+quantity);
        // console.log('totalSum='+totalSum);
    });

    if(totalSum == 0)
    {
        // console.log('its time to remove cart');
        $('.cart-list').empty().append('<p><strong>Корзина пуста.</strong></p>');
        $('.cart-order').remove();
    }

    var totalSumFormatted = commafy(Math.ceil(totalSum));
    console.log(totalSumFormatted);

    //$('.cart-total .price .ajresp').text(totalSumFormatted + ' Р');
    $('.cart-total .price .ajresp').text(totalSumFormatted);
    $('.navbar-list .title .ajresp').text(totalSumFormatted);

    if(totalSum < 1000){
        // показываем блок с подарочными ролами
        // $('.gift_roles').show();
        window.location('/cart/index');
    }

}

// форматирование числа для удобного чтения
function commafy(num, sThousandsSeparator){
    if(!sThousandsSeparator) {
        sThousandsSeparator = " ";
    }
    var bNegative = (num < 0);
    var sDecimalSeparator = ".";
    sOutput = num.toString();
    nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
    nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
    var sNewOutput = sOutput.substring(nDotIndex);
    var nCount = -1;
    for (var i=nDotIndex; i>0; i--) {
        nCount++;
        if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
            sNewOutput = sThousandsSeparator + sNewOutput;
        }
        sNewOutput = sOutput.charAt(i-1) + sNewOutput;
    }
    sOutput = sNewOutput;
    return sOutput;
}

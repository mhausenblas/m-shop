var SEDI_ENDPOINT = 'http://10.141.141.10:31313/';
var SHOPPING_BASKET_SERVICE = "webdis-site-m-shop.marathon.mesos";
var BASE_URL = '';
var SESSION_ID = guid();

// main event loop
$(document).ready(function() {
    serviceDiscovery();
    
    $(".buy").click(function(event) {
        buyItem($(this).parent().attr('id'));
    });
});

function serviceDiscovery() {
    var apicall = SEDI_ENDPOINT + SHOPPING_BASKET_SERVICE ;
    console.info('Discovering endpoint for ' + SHOPPING_BASKET_SERVICE);
    $.get(apicall, function(d) {
        console.debug("GET " + apicall);
        BASE_URL = d
        console.info('Got BASE_URL ' + BASE_URL);
        initSession();
    });
}

function buyItem(itemID) {
    var apicallGET = BASE_URL + '/GET/' + SESSION_ID;
    var apicallSET = BASE_URL + '/SET/' + SESSION_ID + '/';
    var shoppingBasket = '';
    
    $.get(apicallGET, function(d) {
        console.debug("GET " + apicallGET);
        if(d['GET'] == 'EMPTY'){
            apicallSET += itemID;
             $('#shopping-basket-content').html('<p>' + $('#'+ itemID + ' a').attr('title') + '</p>');
        }
        else {
            shoppingBasket = d['GET'].split(':');
            if (shoppingBasket.indexOf(itemID) >= 0) { // item already in basket
                apicallSET += d['GET'];
            }
            else {
                apicallSET += d['GET'] + ':' + itemID;
                shoppingBasket.push(itemID);
            }
            $('#shopping-basket-content').html('');
            for (item in shoppingBasket ) {
                $('#shopping-basket-content').append('<p>' + $('#'+ shoppingBasket[item] + ' a').attr('title') + '</p>');
            }
        }
        $.get(apicallSET, function(s) { // update basket
            console.debug("GET " + apicallSET);
        });
    });
}

function initSession() {
    var apicallSET = BASE_URL + '/SET/' + SESSION_ID + '/EMPTY';
    $.get(apicallSET, function(s) {
        console.debug("GET " + apicallSET);
    });
}


// lifted from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
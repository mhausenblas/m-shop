var SEDI_ENDPOINT = 'http://10.141.141.10:31313/';
var SHOPPING_BASKET_SERVICE = "webdis-site-m-shop.marathon.mesos";
var BASE_URL = '';
var SESSION_ID = guid();

// main event loop
$(document).ready(function() {
    serviceDiscovery();
    
    $(".buy").click(function(event) {
        buyItem($(this).parent().attr('id'));
        listShoppingBasket();
    });
    
    $("#shopping-basket").click(function(event) {
        listShoppingBasket();
    });
    
});

function serviceDiscovery() {
    var apicall = SEDI_ENDPOINT + SHOPPING_BASKET_SERVICE ;
    console.info('Discovering endpoint for ' + SHOPPING_BASKET_SERVICE);
    $.get(apicall, function(d) {
        console.debug("GET " + apicall);
        console.debug(d);
        BASE_URL = d
        console.info('Got BASE_URL ' + BASE_URL);
        initSession();
    });
}

function buyItem(itemID) {
    var apicallGET = BASE_URL + '/GET/' + SESSION_ID;
    var apicallSET = BASE_URL + '/SET/' + SESSION_ID + '/';
    $.get(apicallGET, function(d) {
        console.debug("GET " + apicallGET);
        console.debug(d);
        if(d['GET'] == 'EMPTY'){
            apicallSET += itemID;
        }
        else {
            apicallSET += d['GET'] + ':' + itemID;
        }
        $.get(apicallSET, function(s) {
            console.debug("GET " + apicallSET);
            console.debug(s);
        });
    });
}

function listShoppingBasket(){
    var apicallGET = BASE_URL + '/GET/' + SESSION_ID;
    var shoppingBasket = '';
    
    $.get(apicallGET, function(d) {
        console.debug("GET " + apicallGET);
        console.debug(d);
        if(d['GET'] == 'EMPTY'){
            $('#shopping-basket').html('<p>Empty shopping basket!</p>');
        }
        else {
            shoppingBasket = d['GET'].split(':');
            $('#shopping-basket').html('<p>Your shopping basket:</p>');
            for (item in shoppingBasket ) {
                $('#shopping-basket').append('<p>' + shoppingBasket[item] + '</p>');
            }
        }
       
    });
}

function initSession() {
    var apicallSET = BASE_URL + '/SET/' + SESSION_ID + '/EMPTY';
    $.get(apicallSET, function(s) {
        console.debug("GET " + apicallSET);
        console.debug(s);
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
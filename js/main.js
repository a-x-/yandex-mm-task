$(document).ready(function () {
    init();
    var tabs = $('.nav'),
        input = $('.input');
    tabs.on('click', 'li', function (e) {
        showTabs(e.target);
    });
    tabs.on('focus', 'li', function (e) {
        showTabs(e.target);
    });
    input.on("keyup", function (e) {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            custom_console.checkMethod(input.val());
        }
    });
});

function init() {
    if (localStorage.getItem('tab')) {
        showTabs($('li[data-tab=' + localStorage.getItem('tab') + ']')[0]);
    }
    else {
        showTabs($('li[tabindex=1]')[0]);
    }
}

function showTabs(e) {
    var el = (e.nodeName === 'LI') ? e : e.parentNode,
        tab = el.getAttribute('data-tab');
    localStorage.setItem('tab', tab);
    $('.active').removeClass('active');
    el.className = 'active';
    $('.tab-content').hide();
    $('#' + tab).show();
}

var custom_console = (function () {
    var history = [], statistic = [],
        method = ['selectTab', 'swapTabs', 'showStat'];
    var _publishToConsole = function (val) {
        $('.output').append(val+'<br>');
    };
    var selectTab = function (tabIndex) {
        if (tabIndex >= 1 && tabIndex <= 3) {
            var el = $('li[tabindex=' + tabIndex + ']')[0];
            showTabs(el);
            _publishToConsole('Выбран таб №'+tabIndex +' '+ el.getAttribute('title'));
        }
        else {
            _publishToConsole('Не удалось выбрать таб №'+tabIndex+'. Доступны табы с 0 по 3.');
        }
    };
    var swapTabs = function (tabIndex1, tabIndex2) {
        if(tabIndex1 >= 1 && tabIndex1 <= 3 && tabIndex2 >= 1 && tabIndex2 <= 3){
            var el2 = $('li[tabindex=' + tabIndex2 + ']')[0],
                el1 = $('li[tabindex=' + tabIndex1 + ']')[0],
                parent = $('.nav-tabs')[0];
            var dupNode = el1.cloneNode(true);
            parent.insertBefore(dupNode,el2);
            el1.remove();
        }
        else{
            _publishToConsole('Не удалось выбрать таб №'+tabIndex1+'. Доступны табы с 0 по 3.');
        }
    };
    var showStat = function () {

    };
    var _addToHistory = function () {

    };
    return {
        checkMethod: function (val) {
            if (!!~method.indexOf(val.split('(')[0])) {
                eval(val);
            }
            else {
                _publishToConsole('Uncaught ReferenceError: '+val+' is not defined');
            }
        }
    };
}());
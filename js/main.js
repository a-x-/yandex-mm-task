$(document).ready(function () {
    tab.init();
    var tabs = $('.nav'),
        input = $('.input');

    /**
     * Обработчик события focus по tab
     * @param {Event} e событие focus
     */

    tabs.on('focus', 'li', function (e) {
        tab.showTabs(e.target);
        e.stopImmediatePropagation();
    });

    /**
     * Обработчик события keyup по полю input в консоли
     * @param {Event} e событие keyup
     * Если нажат пробел(e.keyCode === 13) вызывает функцию проверки существования команды в консоли
     * Если происходит нажатие на стрелки вверх/вниз (e.keyCode === 38 || e.keyCode === 40) вызывает функцию поиска по истории команд в консоли
     */

    input.on("keyup", function (e) {
        if (e.keyCode === 13) {
            custom_console.checkMethod(input.val());
        }
        else if (e.keyCode === 38 || e.keyCode === 40) {
            custom_console.findMethodInHistory(e.keyCode);
        }
    });

});

/**
 * Модуль tab
 * содержит публичные методы:
 *        showTabs
 *        init
 */

var tab = (function(){
    return {
        /**
         * Функция showTabs
         * @param target - DOM элемент tab который следует установить active
         * устанавливает значение выбранной вкладки в localStorage
         * добавляет класс active к выбранной вкладке и отображает связанное с ней содержимое
         * Запускает функцию startTime для отслеживания активности пользователя на странице
         */
        showTabs: function(target){
            var el = (target.nodeName === 'LI') ? target : target.parentNode,
                tab = el.getAttribute('data-tab'),
                title = el.getAttribute('title'),
                tab_index = el.getAttribute('tabindex');
            localStorage.setItem('tab', tab);

            $('.active').removeClass('active');
            el.className = 'active';
            $('.tab-content').hide();
            $('.title').html(title);
            $('#' + tab).show();

            timer.startTime(tab_index);
        },
        /**
         * Функция init
         * Вызывается при загрузке страницы, для первоночальной установки активной вкладки
         * Если информация в localStorage отсутствует устанавливается значение по умолчанию элемента с атрибутом  tabindex === 1
         */
        init: function(){
            if (localStorage.getItem('tab')) {
                tab.showTabs($('li[data-tab=' + localStorage.getItem('tab') + ']')[0]);
            }
            else {
                tab.showTabs($('li[tabindex=1]')[0]);
            }
        }
    }
}());

/**
 * Модуль custom_console
 * содержит публичные методы:
 *        checkMethod
 *        findMethodInHistory
 * и приватные методы:
 *        _publishToConsole
 *        _addToHistory
 * так же включаетв  себя методы обработки команд консоли:
 *        selectTab
 *        selectTab
 *        showStat
 *  массив history - хранит в историю введенных пользователем команд консоли
 *         method  - хранит доступные методы нашей консоли
 *  переменная currentElement используется для отслеживания перехода пользователя по истории команд
 */

var custom_console = (function () {
    var history = [], currentElement = -1,
        method = ['selectTab', 'swapTabs', 'showStat'];
    /**
     * Функция _publishToConsole
     * @param val - сообщение которое нужно опубликовать в консоли
     */
    var _publishToConsole = function (val) {
        $('.output').append(val + '<br>');
    };
    /**
     * Функция _addToHistory
     * @param val - добавляет команду в историю
     */
    var _addToHistory = function (val) {
        history.splice(0, 0, val);
        if (history.length > 10) history.length = 10;
    };
    /**
     * Метод консоли selectTab
     * @param tabIndex - tabIndex элемента
     */
    var selectTab = function (tabIndex) {
        if (tabIndex >= 1 && tabIndex <= 3) {
            var el = $('li[tabindex=' + tabIndex + ']')[0];
            tab.showTabs(el);
            _publishToConsole('Выбран таб №' + tabIndex + ' ' + el.getAttribute('title'));
        }
        else {
            _publishToConsole('Не удалось выбрать таб №' + tabIndex + '. Доступны табы с 0 по 3.');
        }
    };
    /**
     * Метод консоли swapTabs
     * @param tabIndex1 - tabIndex элемента
     * @param tabIndex2 - tabIndex второго элемента
     */
    var swapTabs = function (tabIndex1, tabIndex2) {
        if (tabIndex1 >= 1 && tabIndex1 <= 3 && tabIndex2 >= 1 && tabIndex2 <= 3) {
            var el1 = $('li[tabindex=' + tabIndex1 + ']')[0],
                el2 = $('li[tabindex=' + tabIndex2 + ']')[0],
                parent = $('.nav-tabs')[0],
                dupNode = el2.cloneNode(true);
            parent.insertBefore(dupNode, el1);
            el2.remove();
            _publishToConsole('Поменяли табы №' + tabIndex1 + ' ' + el1.getAttribute('title') + ' и №' + tabIndex2 + ' ' + el2.getAttribute('title') + ' местами');
        }
        else {
            _publishToConsole('Не удалось выбрать табы. Доступны табы с 0 по 3.');
        }
    };
    /**
     * Метод консоли showStat
     */
    var showStat = function () {
        var stat = timer.getTime(),
            one = stat[1].sec / 1000,
            two = stat[2].sec / 1000,
            three = stat[3].sec / 1000,
            main_time = one + two + three;

        _publishToConsole('Общее время работы со страницей: ' + Math.round(main_time) + '<br>' +
            'Детализация времени просмотра табов:<br>' +
            'Таб 1: ' + Math.round(one) + ' секунд <br>' +
            'Таб 2: ' + Math.round(two) + ' секунд <br>' +
            'Таб 3: ' + Math.round(three) + ' секунд <br>');
    };

    return {
        /**
         * Функция checkMethod
         * проверяет "валидность" введенной пользователем команды
         * при положительном результате запускает команду
         */
        checkMethod: function (val) {
            $('.input').val('');
            currentElement = -1;
            _addToHistory(val);
            if (!!~method.indexOf(val.split('(')[0])) {
                _publishToConsole(' /> ' + val);
                eval(val);
            }
            else {
                _publishToConsole('Uncaught ReferenceError: ' + val + ' is not defined');
            }
        },
        /**
         * Функция findMethodInHistory
         * производит обход по истории команд
         * @code код клавиши (стрелки вверх/вниз)
         */
        findMethodInHistory: function (code) {
            if (history.length > 0) {
                if (code === 38) {
                    if (currentElement < history.length - 1) {
                        $('.input').val(history[currentElement + 1]);
                        currentElement++;
                    }
                    else {
                        return false
                    }
                }
                else {
                    if (currentElement != 0 && currentElement != -1) {
                        $('.input').val(history[currentElement - 1]);
                        currentElement--;
                    }
                    else {
                        return false
                    }
                }
            }
        }
    };
}());
/**
 * Модуль timer
 * содержит публичные методы:
 *        startTime
 *        getTime
 *  переменная currentTab хранит активную вкладку
 *  объект statistic - содержит 3 свойства в котором хранится информация по каждой вкладке
 *  timestamp - время в милисекундах когда вкладка стала активной
 *  sec - количество секунд который пользователь провел на текущей вкладке
 */
var timer = (function () {
    var currentTab,
        statistic = {
            1: {
                timestamp: null,
                sec: null
            },
            2: {
                timestamp: null,
                sec: null
            },
            3: {
                timestamp: null,
                sec: null
            }
        };
    return {
        startTime: function (tabIndex) {
            if (currentTab) {
                statistic[currentTab].sec += new Date().getTime() - statistic[currentTab].timestamp;
            }
            currentTab = tabIndex;
            statistic[tabIndex].timestamp = new Date().getTime();
        },
        getTime: function () {
            statistic[currentTab].sec += new Date().getTime() - statistic[currentTab].timestamp;
            statistic[currentTab].timestamp = new Date().getTime();
            return statistic;
        }
    }
}());
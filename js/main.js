$(document).ready(function () {
    $('body').keypress(function(e) {
        var code = e.keyCode || e.which;
        if (code === 9) {
            console.log(e)
        }
    });
    $('.nav').on('click','li',function(e){
        showTabs(e);
    })
});

function showTabs(e){
    var el = (e.target.nodeName === 'LI')? e.target : e.target.parentNode,
        tab = el.getAttribute('data-tab');
    $('.active').removeClass('active');
    el.className = 'active';
    $('.tab-content').hide();
    $('#'+tab).show();
}
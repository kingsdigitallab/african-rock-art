$(function() {
    if ($('svg g#areas')) {
        $('svg g#areas g').click(function() {
            location.href = 'country/' + this.id + '.html';
        });
    }
});

$(document).ready(function () {

    // Expand/collapse

    $('.accordion .chapter-title').bind("click", function () {
        $(this).next('.chapter-content').slideToggle(400).toggleClass("hide show");
        return false;
    });

});
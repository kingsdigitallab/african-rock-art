$(function() {
    if ($('svg g#areas')) {
        $('svg g#areas g').click(function() {
            location.href = 'country/' + this.id + '.html';
        });
    }
});
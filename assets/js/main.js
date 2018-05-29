$(function() {
  if ($('svg g#areas')) {
    $('svg g#areas g').click(function() {
      location.href = 'country/' + this.id + '/'
    })

    $('svg g#areas g path').tooltipster({
      delay: 50,
      offset: [0, 30],
      plugins: ['follower'],
      theme: ['tooltipster-borderless']
    })
  }

  // Expand/collapse
  $('.accordion .chapter-title').click(function() {
    $(this)
      .toggleClass('opened closed')
      .next('.chapter-content')
      .slideToggle(400)
      .toggleClass('show hide')
      .nextUntil('.chapter-title')
      .slideToggle(400)
      .toggleClass('show hide')
    return false
  })

  var amountScrolled = 300

  $(window).scroll(function() {
    if ($(window).scrollTop() > amountScrolled) {
      $('a.back-to-top').fadeIn('slow')
    } else {
      $('a.back-to-top').fadeOut('slow')
    }
  })

  $('a.back-to-top').click(function() {
    $('html, body').animate(
      {
        scrollTop: 0
      },
      700
    )
    return false
  })
})

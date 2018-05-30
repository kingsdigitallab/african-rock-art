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

  var offset = 300

  $(window).scroll(function() {
    if ($(window).scrollTop() > offset) {
      $('a.top').fadeIn('slow')
    } else {
      $('a.top').fadeOut('slow')
    }
  })

  $('a.top').click(function(event) {
    event.preventDefault()

    $('html, body').animate(
      {
        scrollTop: 0
      },
      700
    )
  })
})

$(function() {
  if ($("svg g#areas")) {
    $("svg g#areas g").click(function() {
      location.href = "country/" + this.id + ".html";
    });

    $("svg g#areas g path").tooltipster({
      delay: 100,
      theme: ['tooltipster-borderless']
    });
  }

  // Expand/collapse
  $(".accordion .chapter-title").click(function() {
    $(this)
      .toggleClass("opened closed")
      .next(".chapter-content")
      .slideToggle(400)
      .toggleClass("show hide")
      .nextUntil(".chapter-title")
      .slideToggle(400)
      .toggleClass("show hide");
    return false;
  });
});

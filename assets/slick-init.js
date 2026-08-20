$(function () {
  // Wait for jQuery and Slick to be available before initializing
  function initSlickSliders() {
    if (typeof $ === "undefined" || !$.fn || !$.fn.slick) {
      setTimeout(initSlickSliders, 50);
      return;
    }
    $("[data-slick-slider]").each(function () {
      var $slider = $(this);

      // Read options from data attributes with defaults
      var slidesToShow = parseInt($slider.data("slidesperview")) || 1;
      var slidesToScroll =
        parseInt($slider.data("slidestoscroll")) || slidesToShow;
      var arrows =
        $slider.data("arrows") === true || $slider.data("arrows") === "true";
      var dots =
        $slider.data("dots") === true || $slider.data("dots") === "true";
      var infinite =
        $slider.data("loop") === true || $slider.data("loop") === "true";
      var autoplay =
        $slider.data("autoplay") === true ||
        $slider.data("autoplay") === "true";
      var autoplaySpeed = parseInt($slider.data("autoplayspeed")) || 3000;
      var speed = parseInt($slider.data("speed")) || 300;
      var pauseOnHover =
        $slider.data("pauseonhover") !== false &&
        $slider.data("pauseonhover") !== "false";
      var pauseOnFocus =
        $slider.data("pauseonfocus") !== false &&
        $slider.data("pauseonfocus") !== "false";
      var pauseOnDotsHover =
        $slider.data("pauseondotshover") !== false &&
        $slider.data("pauseondotshover") !== "false";
      var cssEase = $slider.data("cssease") || "ease";
      var easing = $slider.data("easing") || "linear";
      var fade =
        $slider.data("fade") === true || $slider.data("fade") === "true";
      var centerMode =
        $slider.data("centermode") === true ||
        $slider.data("centermode") === "true";
      var centerPadding = $slider.data("centerpadding") || "50px";
      var variableWidth =
        $slider.data("variablewidth") === true ||
        $slider.data("variablewidth") === "true";
      var adaptiveHeight =
        $slider.data("adaptiveheight") === true ||
        $slider.data("adaptiveheight") === "true";
      var lazyLoad = $slider.data("lazyload") || "ondemand"; // ondemand, progressive, or false
      var focusOnSelect =
        $slider.data("focusonselect") === true ||
        $slider.data("focusonselect") === "true";
      var useCSS =
        $slider.data("usecss") !== false && $slider.data("usecss") !== "false";
      var useTransform =
        $slider.data("usetransform") !== false &&
        $slider.data("usetransform") !== "false";
      var vertical =
        $slider.data("vertical") === true ||
        $slider.data("vertical") === "true";
      var verticalSwiping =
        $slider.data("verticalswiping") === true ||
        $slider.data("verticalswiping") === "true";
      var swipe =
        $slider.data("swipe") !== false && $slider.data("swipe") !== "false";
      var swipeToSlide =
        $slider.data("swipetoslide") === true ||
        $slider.data("swipetoslide") === "true";
      var touchMove =
        $slider.data("touchmove") !== false &&
        $slider.data("touchmove") !== "false";
      var touchThreshold = parseInt($slider.data("touchthreshold")) || 5;
      var edgeFriction = parseFloat($slider.data("edgefriction")) || 0.35;
      var draggable =
        $slider.data("draggable") !== false &&
        $slider.data("draggable") !== "false";
      var asNavFor = $slider.data("asnavfor");


      $slider.slick({
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        arrows: arrows,
        dots: dots,
        infinite: infinite,
        autoplay: autoplay,
        autoplaySpeed: autoplaySpeed,
        speed: speed,
        pauseOnHover: pauseOnHover,
        pauseOnFocus: pauseOnFocus,
        pauseOnDotsHover: pauseOnDotsHover,
        cssEase: cssEase,
        easing: easing,
        fade: fade,
        centerMode: centerMode,
        centerPadding: centerPadding,
        variableWidth: variableWidth,
        adaptiveHeight: adaptiveHeight,
        lazyLoad: lazyLoad,
        focusOnSelect: focusOnSelect,
        useCSS: useCSS,
        useTransform: useTransform,
        vertical: vertical,
        verticalSwiping: verticalSwiping,
        swipe: swipe,
        swipeToSlide: swipeToSlide,
        touchMove: touchMove,
        touchThreshold: touchThreshold,
        edgeFriction: edgeFriction,
        draggable: draggable,
        rtl: document.dir === "rtl",
        asNavFor: asNavFor || undefined,
        nextArrow:
          '<button type="button" class="slick-next slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192" fill="none"> <path d="M30 96H162" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M108 42L162 96L108 150" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> </svg></button>',
        prevArrow:
          '<button type="button" class="slick-prev slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" width="192" height="192" viewBox="0 0 192 192" fill="none"> <path d="M30 96H162" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M108 42L162 96L108 150" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/> </svg></button>',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: centerMode ? 5 : Math.min(slidesToShow, 2),
              slidesToScroll: centerMode ? 1 : Math.min(slidesToScroll, 2),
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: slidesToShow === 1 ? 1 : centerMode ? 3 : 2,
              slidesToScroll: slidesToShow === 1 ? 1 : centerMode ? 1 : 2,
            },
          },
          {
            breakpoint: 360,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    });
  }
  initSlickSliders();
});

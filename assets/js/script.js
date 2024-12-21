// NAVIGATION
function setVh() {
    const vh = window.innerHeight / 100
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('load', function () {
    const header = document.querySelector('.header')
    const headerTrigger = document.querySelector('.header-menu')

    header.classList.remove('header-initial')

    let active = false

    headerTrigger.addEventListener('click', function () {
        active = !active

        if (active) {
            document.body.classList.add('header-lock-body-scroll')
            header.classList.add('header-active')
        } else {
            document.body.classList.remove('header-lock-body-scroll')
            header.classList.remove('header-active')
        }
    })

    setVh()

    window.addEventListener('resize', function () {
        setVh()
    })
});

// ACCORDIONS
(function ($) {
    $('.accordion > li:eq(0) a').addClass('active').next().slideDown();

    $('.accordion a').click(function (j) {
        var dropDown = $(this).closest('li').find('p');

        $(this).closest('.accordion').find('p').not(dropDown).slideUp();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('.accordion').find('a.active').removeClass('active');
            $(this).addClass('active');
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
    });
})(jQuery);

 // BACK TO TOP BUTTON
 document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('back-to-top');

    // Show the button when the user scrolls down 100px from the top
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    // Scroll smoothly back to the top when the button is clicked
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
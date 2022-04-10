function setVh() {
    const vh = window.innerHeight / 100
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('load', function () {
    const header = document.querySelector('.header')
    const headerTrigger = document.querySelector('.header__trigger')
    const hero = document.querySelector('.hero')
    const heroBlueHotspot = document.querySelector('.hero__hotspot--blue')
    const heroRedHotspot = document.querySelector('.hero__hotspot--red')
    const touchHotspot = document.querySelector('.hero__hotspot--touch')

    header.classList.remove('header--initial')
    hero.classList.remove('hero--initial')

    let active = false
    let scrollActive = false

    headerTrigger.addEventListener('click', function () {
        active = !active

        if (active) {
            document.body.classList.add('header__lock-body-scroll')
            header.classList.add('header--active')
            hero.classList.add('hero--both')
        } else {
            document.body.classList.remove('header__lock-body-scroll')
            header.classList.remove('header--active')
            hero.classList.remove('hero--both')
        }
    })

    heroBlueHotspot.addEventListener('mouseenter', function () {
        hero.classList.add('hero--blue')
    })

    heroBlueHotspot.addEventListener('mouseleave', function () {
        hero.classList.remove('hero--blue')
    })

    heroRedHotspot.addEventListener('mouseenter', function () {
        hero.classList.add('hero--red')
    })

    heroRedHotspot.addEventListener('mouseleave', function () {
        hero.classList.remove('hero--red')
    })

    let heroTouchStatus = 'none'

    touchHotspot.addEventListener('touchend', function () {
        if (scrollActive) {
            return
        }

        if (heroTouchStatus === 'none') {
            heroTouchStatus = 'blue'
            hero.classList.add('hero--blue')
        } else if (heroTouchStatus === 'blue') {
            heroTouchStatus = 'red'
            hero.classList.remove('hero--blue')

            function setHeroRed() {
                hero.classList.add('hero--red')
                hero.removeEventListener('transitionend', setHeroRed)
            }

            hero.addEventListener('transitionend', setHeroRed)
        } else {
            heroTouchStatus = 'none'
            hero.classList.remove('hero--red')
        }
    })

    setVh()

    window.addEventListener('resize', function () {
        setVh()
    })

    let scrollTimeout = null

    window.addEventListener('scroll', function () {
        window.requestAnimationFrame(() => {
            if (scrollTimeout !== null) {
                return
            }

            scrollTimeout = window.setTimeout(() => {
                if (!scrollActive) {
                    if (window.scrollY >= 1) {
                        scrollActive = true

                        header.classList.add('header--scroll-active')
                        hero.classList.add('hero--scroll-active')

                        heroTouchStatus = 'none'

                        hero.classList.remove('hero--blue')
                        hero.classList.remove('hero--red')
                    }
                } else if (window.scrollY < 1) {
                    scrollActive = false

                    header.classList.remove('header--scroll-active')
                    hero.classList.remove('hero--scroll-active')
                }

                scrollTimeout = null
            }, 100)
        })
    })
})
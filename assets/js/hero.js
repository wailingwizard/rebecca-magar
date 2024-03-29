function setVh() {
    let a = window.innerHeight / 100;
    document.documentElement.style.setProperty("--vh", `${a}px`);
}
window.addEventListener("load", function () {
    let c = document.querySelector(".header"),
        d = document.querySelector(".header-menu"),
        e = document.querySelector(".hero"),
        a = document.querySelector(".hero-hotspot-blue"),
        b = document.querySelector(".hero-hotspot-red"),
        f = document.querySelector(".hero-hotspot-touch");
    c.classList.remove("header-initial"), e.classList.remove("hero-initial");
    let g = !1,
        h = !1;
    d.addEventListener("click", function () {
        (g = !g)
            ? (document.body.classList.add("header-lock-body-scroll"), c.classList.add("header-active"), e.classList.add("hero-both"))
            : (document.body.classList.remove("header-lock-body-scroll"), c.classList.remove("header-active"), e.classList.remove("hero-both"));
    }),
        a.addEventListener("mouseenter", function () {
            e.classList.add("hero-blue");
        }),
        a.addEventListener("mouseleave", function () {
            e.classList.remove("hero-blue");
        }),
        b.addEventListener("mouseenter", function () {
            e.classList.add("hero-red");
        }),
        b.addEventListener("mouseleave", function () {
            e.classList.remove("hero-red");
        });
    let i = "none";
    f.addEventListener("touchend", function () {
        if (!h) {
            if ("none" === i) (i = "blue"), e.classList.add("hero-blue");
            else if ("blue" === i) {
                function a() {
                    e.classList.add("hero-red"), e.removeEventListener("transitionend", a);
                }
                (i = "red"), e.classList.remove("hero-blue"), e.addEventListener("transitionend", a);
            } else (i = "none"), e.classList.remove("hero-red");
        }
    }),
        setVh(),
        window.addEventListener("resize", function () {
            setVh();
        });
    let j = null;
    window.addEventListener("scroll", function () {
        window.requestAnimationFrame(() => {
            null === j &&
                (j = window.setTimeout(() => {
                    h
                        ? window.scrollY < 1 && ((h = !1), c.classList.remove("header-scroll-active"), e.classList.remove("hero-scroll-active"))
                        : window.scrollY >= 1 && ((h = !0), c.classList.add("header-scroll-active"), e.classList.add("hero-scroll-active"), (i = "none"), e.classList.remove("hero-blue"), e.classList.remove("hero-red")),
                        (j = null);
                }, 100));
        });
    });
});

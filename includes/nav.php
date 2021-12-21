    <header class="navbar js-navbar" id="sticky-navigation-home">
        <div class="nav-container">
            <a href="/" id="logo" class="logo-main js-logo-main">
                <div class="logo-main logo-main-image js-logo-main-image show" id="logoswitch">
                    <h1>Rebecca Magar - Web Designer and Front-End Developer</h1>
                </div>
            </a>

            <a href="/" id="logo-main-mobile" class="logo-main-mobile js-logo-main-mobile"><span class="mobile-menu-label">Menu</span></a>

            <button type="button" class="btn menu-icon hint menu-toggle js-menu-toggle">
                <span class="menu-toggle-label js-menu-toggle-label text" id="menuswitch"
                    onclick="toggleIcon()">Menu</span>
            </button>
        </div>
    </header>

    <div class="mobile-header-background js-mobile-header-background"></div>
    <div class="mobile-header-spacer js-mobile-header-spacer"></div>
    <div class="nav-overlay js-nav-overlay">

        <svg class="nav-bg-shape nav-bg-shape-landscape js-nav-bg-shape" preserveAspectRatio="none meet"
            viewbox="0 0 160 100">
            <path d="M12.48,12.07H160V100H12.48Z" data-inactive="M12.48,12.07H160V100H12.48Z"
                data-active="M12.48,12.07H160V100H12.48Z" fill="#f41d07" />
        </svg>

        <svg class="nav-bg-shape nav-bg-shape-landscape js-nav-bg-shape" preserveAspectRatio="none meet"
            viewbox="0 0 160 100">
            <path d="M0,0H148.19V88.19H0Z" data-inactive="M0,0H148.19V88.19H0Z" data-active="M0,0H148.19V88.19H0Z"
                fill="#19b7ff" />
        </svg>

        <svg class="nav-bg-shape nav-bg-shape-portrait js-nav-bg-shape" preserveAspectRatio="none meet"
            viewbox="0 0 320 568">
            <path d="M107,544.14H320v24H107Z" data-inactive="M107,544.14H320v24H107Z" data-active="M0,0H320V568.1H0Z"
                fill="#f41d07" />
        </svg>

        <svg class="nav-bg-shape nav-bg-shape-portrait js-nav-bg-shape" preserveAspectRatio="none meet"
            viewbox="0 0 320 568">
            <path d="M0,0H214V23.86H0Z" data-inactive="M0,0H214V23.86H0Z" data-active="M0,0H320V568.1H0Z"
                fill="#19b7ff" />
        </svg>

        <nav class="menu js-menu">
            <ul class="menu-list">
                <li class="menu-list-item">
                    <a class="menu-link" href="/about/">About</a>
                </li>
                <li class="menu-list-item">
                    <a class="menu-link" href="/portfolio/portfolio.php">Portfolio</a>
                </li>
                <li class="menu-list-item">
                    <a class="menu-link" href="/contact/">Contact</a>
                </li>
            </ul>
        </nav>
    </div>
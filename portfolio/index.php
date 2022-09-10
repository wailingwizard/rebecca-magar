<!DOCTYPE html>
<html lang="en" class="no-js no-touch">

    <head>
        <?php include '../includes/head.php'; ?>
        <title>Portfolio | Rebecca Magar</title>
        <meta name="description" content="Login to Rebecca's portfolio to preview UI and web design samples, email templates, digital ads, videos, identity design, illustrations, and more.">
        <meta name="keywords" content="Rebecca Magar, Web Designer, UI Designer, Graphic Designer, Front-End Developer, HTML Developer, CSS Developer, Javascript Developer, jQuery Developer, Illustrator, Artist, Portfolio, Design, Work, Examples">
        <meta name="robots" content="index, follow">

        <link rel="canonical" href="https://www.rebeccamagar.com/portfolio/" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wailingwizard" />
        <meta name="twitter:creator" content="@wailingwizard" />

        <meta property="og:url" content="https://www.rebeccamagar.com/portfolio/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rebecca Magar - Portfolio" />
        <meta property="og:description" content="Login to Rebecca's portfolio to preview UI and web design samples, email templates, digital ads, videos, identity design, illustrations, and more." />
        <meta property="og:image" content="https://www.rebeccamagar.com/assets/images/og-images/rebecca-magar-og.jpg" />

        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "VisualArtwork",
                "name": "Partners and Harrison Web Presence",
                "alternateName": "Partners and Harrison Web Design",
                "image": "https://www.rebeccamagar.com/assets/images/sample-project/partners-and-harrison-banner.webp",
                "description": "Design and development of the Partners and Harrison website, landing page, email templates, and whitepaper.",
                "creator": [
                    {
                    "@type": "Person",
                    "name": "Rebecca Magar",
                    "email": "mailto:rebecca@rebeccamagar.com",
                    "image": "https://www.rebeccamagar.com/assets/images/rebecca-magar-portrait-halftone.webp",
                    "jobTitle": "Web/UI Designer and Front-End Developer",
                    "url": "https://www.rebeccamagar.com",
                    "workLocation": "PNY Technologies"
                    }
                ]
            }
        </script>
    </head>

    <body class="portfolio-login">

        <?php include '../includes/nav.php'; ?>

        <main>
            <section class="main-content">
                <div class="container-fluid">

                    <!-- Sample Project -->
                    <div class="row portfolio">
                        <div class="col-md-12">
                            <figure class="portfolio-banner">    
                                <a href="/sample-project/"><span class="image-overlay"></span><img width="1200" height="675" src="/assets/images/sample-project/partners-and-harrison-banner.webp" srcset="/assets/images/sample-project/partners-and-harrison-banner_400.webp 400w, /assets/images/sample-project/partners-and-harrison-banner_800.webp 800w, /assets/images/sample-project/partners-and-harrison-banner.webp 1200w" sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px" alt="Partners and Harrison - Web Presence"></a>
                                <figcaption><a href="/sample-project/">View a Sample Project</a></figcaption>
                            </figure>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-3"></div>
                        <div class="col-sm-6">
                            <div class="login-box">
                                <h3>Login</h3>
                                <p>Login to preview more samples of my work.</p>
                                <p>Don't have a login? <a href="/contact/">Contact me</a> to request access.</p>
                                <form action="authenticate.php" method="post">
                                    <div>
                                        <label for="username"><span class="required">*</span> Username</label>
                                        <input type="text" name="username" placeholder="Username" id="username" required>
                                    </div>
                                    <div>
                                        <label for="password"><span class="required">*</span> Password</label>
                                        <input type="password" name="password" placeholder="Password" id="password" required>
                                    </div>
                                    <div>
                                        <input type="submit" value="Login">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="col-sm-3"></div>
                    </div>
                </div>
            </section>
        </main>

        <?php include '../includes/footer.php'; ?>

    </body>
</html>
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
                "name": "Velocity-X Application UI Design",
                "alternateName": "Velocity-X UI Design",
                "image": "https://www.rebeccamagar.com/assets/images/sample-project/velocity-x-app-pny-40-series-gpu-og.webp",
                "description": "Learn more about Rebecca Magar's design and development process by previewing a sample of her work.",
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
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-5 login-box">
                            <h2 class="h-h3 centered">LOGIN</h2>
                            <p class="centered">Login to preview more samples of my work <br>(see resume for username &amp; password).</p>
                            <p class="centered">Don't have a login? <a href="/contact/">Contact me</a> to request access.</p>
                            <form action="authenticate.php" method="post">
                                <div>
                                    <label for="username"><span class="required">*</span> Username</label>
                                    <input type="text" name="username" placeholder="Username" id="username" required>
                                </div>
                                <div>
                                    <label for="password"><span class="required">*</span> Password</label>
                                    <input type="password" name="password" placeholder="Password" id="password" required>
                                </div>
                                <div class="centered">
                                    <input type="submit" value="Login">
                                </div>
                            </form>
                        </div>
                        <div class="col-md-5 login-banner">
                            <a href="/sample-project/">
                                <p class="img-label">View a Sample Project</p>
                            </a>
                        </div>
                        <div class="col-md-1"></div>
                    </div>
                    <div class="row">
                        <div class="col-sm-3"></div>
                        <div class="col-sm-6">
                        </div>
                        <div class="col-sm-3"></div>
                    </div>
                </div>
            </section>
        </main>
        <?php include '../includes/footer.php'; ?>
    </body>
</html>
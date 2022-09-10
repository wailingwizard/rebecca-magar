<!DOCTYPE html>
<html lang="en" class="no-js no-touch">

    <head>
        <?php include '../includes/head.php'; ?>
        <title>Contact | Rebecca Magar</title>
        <meta name="description" content="Connect with Rebecca to request samples of her work, to discuss new opportunities, or just to chat. Fill out the contact form to start a conversation.">
        <meta name="keywords" content="Rebecca Magar, Contact, Get in Touch, Email, Connect, Web Designer, UI Designer, Graphic Designer, Front-End Developer, HTML Developer, CSS Developer, Javascript Developer, jQuery Developer, Illustrator, Artist, Portfolio, Design">
        <meta name="robots" content="index, follow">

        <link rel="canonical" href="https://www.rebeccamagar.com/contact/" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wailingwizard" />
        <meta name="twitter:creator" content="@wailingwizard" />

        <meta property="og:url" content="https://www.rebeccamagar.com/contact/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Rebecca Magar" />
        <meta property="og:description" content="Connect with Rebecca to request samples of her work, to discuss new opportunities, or just to chat. Fill out the contact form to start a conversation." />
        <meta property="og:image" content="https://www.rebeccamagar.com/assets/images/og-images/rebecca-magar-og.jpg" />

        <script type="application/ld+json">
            {
            "@context": "https://schema.org",
            "@type": "Person",
            "email": "mailto:rebecca@rebeccamagar.com",
            "image": "/assets/images/rebecca-magar-portrait-halftone.webp",
            "jobTitle": "Web/UI Designer and Front-End Developer",
            "name": "Rebecca Magar",
            "url": "https://www.rebeccamagar.com",
            "workLocation": "PNY Technologies"
            }
        </script>
    </head>
    <body class="about">

        <?php include '../includes/nav.php'; ?>

        <main>
            <section class="main-content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="row">
                                <form class="contact-form" method="post" enctype="multipart/form-data" novalidate>

                                    <div class="col-sm-12">
                                        <h2>Contact Me</h2>
                                        <p>Let's connect! Send me an email using the form below to start a conversation.</p>
                                    </div>

                                    <div class="col-sm-6">
                                        <label for="first_name"><span class="required">*</span> First Name</label>
                                        <div class="form-element">
                                            <i class="fas fa-user"></i>
                                            <input type="text" id="first_name" name="first_name" placeholder="Enter your first name" pattern="^[a-zA-Z]+" title="First name must contain only characters!" required>
                                        </div>
                                    </div>

                                    <div class="col-sm-6">
                                        <label for="last_name"><span class="required">*</span> Last Name</label>
                                        <div class="form-element">
                                            <i class="fas fa-user"></i>
                                            <input type="text" id="last_name" name="last_name" placeholder="Enter your last name" pattern="^[a-zA-Z]+" title="Last name must contain only characters!" required>
                                        </div>
                                    </div>

                                    <div class="col-sm-12">
                                        <label for="email"><span class="required">*</span> Email</label>
                                        <div class="form-element">
                                            <i class="fas fa-envelope"></i>
                                            <input type="email" id="email" name="email" placeholder="Enter your email" title="Please enter a valid email address!" required>
                                        </div>
                                    </div>

                                    <div class="col-sm-12">
                                        <label for="subject"><span class="required">*</span> Subject</label>
                                        <div class="form-element">
                                            <input type="text" id="subject" name="subject" placeholder="Enter your subject" title="Please enter a subject!" required>
                                        </div>
                                    </div>

                                    <div class="col-sm-12">
                                        <label for="message"><span class="required">*</span> Message</label>
                                        <div class="form-element">
                                            <textarea id="message" name="message" placeholder="Enter your message ..." title="Please enter your message!" required></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <label for="captcha"><span class="required">*</span> Please prove your humanity</label>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-element">
                                            <input type="text" id="captcha" name="captcha" placeholder="Enter captcha code" title="Please enter the captcha code!" required>
                                            <img src="captcha.php" width="150" height="50" alt="CAPTCHA">
                                        </div>
                                    </div>

                                    <div class="col-sm-12">

                                        <button type="submit" class="btn">Submit</button>

                                        <a href="#" class="btn btn-secondary clear-form">Clear</a>

                                    </div>

                                    <p class="col-sm-12 errors"></p>  

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <script src="/assets/js/contact-form.min.js"></script>
        <script>
            new ContactForm({
                container: document.querySelector(".contact-form"),
            });
        </script>

        <?php include '../includes/footer.php'; ?>

    </body>
</html>
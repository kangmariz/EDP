$(document).ready(function() {
    if ($.fn.accordion) {
        $("#skillsAccordion").accordion({
            collapsible: true,
            heightStyle: "content"
        });
    }
    $("#funFactsBtn").on("click", function() {
        $("#funFacts").slideToggle(300);y
        if ($("#funFacts").is(":visible")) {
            $(this).html('<i class="fas fa-minus-circle me-2"></i>Hide Fun Facts');
        } else {
            $(this).html('<i class="fas fa-star me-2"></i>Show Fun Facts');
        }
    });
    $(".list-group-item").on("click", function() {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).css("background-color", "var(--super-light-pink)");
        } else {
            $(this).css("background-color", "");
        }
    });
    $("#fetchGithubBtn").on("click", function() {
        fetchGitHubData();
    });
    $("#githubUsername").on("keypress", function(e) {
        if (e.which === 13) { 
            fetchGitHubData();
        }
    });
    $(".sidebar a").on("click", function() {
        $(".sidebar a").removeClass("active");
        $(this).addClass("active");
    });
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });
    $("#contactForm").on("submit", function(e) {
        e.preventDefault();
        $(this).find(".is-invalid").removeClass("is-invalid");
        $(this).find(".invalid-feedback").remove();
        
        let isValid = true;
        const name = $("#name").val().trim();
        if (name === "") {
            $("#name").addClass("is-invalid")
                .after('<div class="invalid-feedback">Please enter your name</div>');
            isValid = false;
        }
        const email = $("#email").val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $("#email").addClass("is-invalid")
                .after('<div class="invalid-feedback">Please enter a valid email address</div>');
            isValid = false;
        }
        const message = $("#message").val().trim();
        if (message === "") {
            $("#message").addClass("is-invalid")
                .after('<div class="invalid-feedback">Please enter your message</div>');
            isValid = false;
        }
        if (isValid) {
            processFormSubmission();
        }
    });
    
    function processFormSubmission() {
        const formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            message: $("#message").val()
        };
        const successAlert = `
            <div class="alert alert-success mt-3" id="successMessage">
                <i class="fas fa-check-circle me-2"></i>
                Thank you for your message, ${formData.name}! I'll get back to you soon.
            </div>
        `;
        $("#contactForm").append(successAlert);
        $("#successMessage")
            .hide()
            .slideDown(300)
            .delay(3000)
            .slideUp(300, function() {
                $(this).remove();
            });
        $("#contactForm")[0].reset();
        $(document).trigger("formSubmitted", [formData]);
    }
    
    function fetchGitHubData() {
        const username = $("#githubUsername").val().trim();
        
        if (username === "") {
            $("#githubData").html(`
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Please enter a GitHub username
                </div>
            `);
            return;
        }
        $("#githubData").html(`
            <div class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-primary">Fetching GitHub data...</p>
            </div>
        `);
        $.ajax({
            url: `https://api.github.com/users/${username}`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                displayGitHubData(data);
            },
            error: function(xhr, status, error) {
                $("#githubData").html(`
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error: ${xhr.responseJSON ? xhr.responseJSON.message : "User not found"}
                    </div>
                `);
            }
        });
    }
    
    function displayGitHubData(data) {
        const html = `
            <div class="card" style="background-color: #f8bbd0;">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-4 text-center mb-3 mb-md-0">
                            <img src="${data.avatar_url}" alt="${data.login}" class="rounded-circle mb-2" style="width: 100px; height: 100px; border: 3px solid #d81b60;">
                            <h4 class="mb-0">${data.name || data.login}</h4>
                            <p class="text-muted">${data.bio || 'GitHub User'}</p>
                        </div>
                        <div class="col-md-8">
                            <div class="row text-center g-2">
                                <div class="col-4">
                                    <div class="border rounded p-2 bg-white shadow-sm">
                                        <h5 class="mb-0 text-primary">${data.public_repos}</h5>
                                        <small>Repositories</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="border rounded p-2 bg-white shadow-sm">
                                        <h5 class="mb-0 text-primary">${data.followers}</h5>
                                        <small>Followers</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="border rounded p-2 bg-white shadow-sm">
                                        <h5 class="mb-0 text-primary">${data.following}</h5>
                                        <small>Following</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-3">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                                        <strong>Location:</strong> ${data.location || 'Not specified'}
                                    </li>
                                    <li class="list-group-item">
                                        <i class="fas fa-building me-2 text-primary"></i>
                                        <strong>Company:</strong> ${data.company || 'Not specified'}
                                    </li>
                                </ul>
                                <div class="text-center mt-3">
                                    <a href="${data.html_url}" target="_blank" class="btn btn-primary">
                                        <i class="fab fa-github me-2"></i>View Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#githubData").html(html);
        $(document).trigger("apiDataLoaded", [data]);
    }
    $(".card").hover(
        function() {
            $(this).css("transform", "translateY(-5px)");
            $(this).css("box-shadow", "0 10px 20px rgba(216, 27, 96, 0.2)");
        },
        function() {
            $(this).css("transform", "");
            $(this).css("box-shadow", "0 5px 15px rgba(0, 0, 0, 0.1)");
        }
    );
    $(document).on("formSubmitted", function(event, data) {
        console.log("Form submitted with data:", data);
    });
    
    $(document).on("apiDataLoaded", function(event, data) {
        console.log("API data loaded:", data);
    });
    
    $(window).on('scroll', function() {
        const scrollPosition = $(this).scrollTop();
        $('section').each(function() {
            const topDistance = $(this).offset().top - 100;
            
            if (scrollPosition >= topDistance) {
                const id = $(this).attr('id');
                $('.sidebar a').removeClass('active');
                $('.sidebar a[href="#' + id + '"]').addClass('active');
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    const expanded = menuToggle.getAttribute("aria-expanded") === "true" || false;
    menuToggle.setAttribute("aria-expanded", !expanded);
  });

  // Dark/Light Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const header = document.querySelector('header');

  function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    const icon = themeToggle.querySelector("i");
    if (isDark) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme === "dark");
  } else {
    setTheme(prefersDark.matches);
  }

  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    setTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
  
  // Header shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
  });

  // Smooth active nav-link highlight on scroll
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  function onScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let currentSectionId = "";
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });
    navItems.forEach((navLink) => {
      navLink.classList.toggle("active", navLink.getAttribute("href").slice(1) === currentSectionId);
    });
  }
  window.addEventListener("scroll", onScroll);

  // Typed text effect
  const typedTextElement = document.getElementById("typed-text");
  const words = [
    "CSE Student",
    "Programming Enthusiast",
    "Cybersecurity Explorer",
    "Problem Solver",
    "Campus Ambassador",
    "Volunteer & Organizer"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let typingDelay = 100;
  let erasingDelay = 50;
  let newWordDelay = 2000;
  let isDeleting = false;

  function type() {
    if (wordIndex >= words.length) wordIndex = 0;
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, newWordDelay);
      } else {
        setTimeout(type, typingDelay);
      }
    } else {
      typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(type, erasingDelay);
      }
    }
  }
  type();

  // Animate skill circles on scroll into view
  const skillCircles = document.querySelectorAll(".skill-circle");
  const circumference = 2 * Math.PI * 45;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
        const circle = entry.target;
        const percent = parseInt(circle.dataset.percent);
        const progressCircle = circle.querySelector("circle.progress");
        const percentElem = circle.querySelector(".percent");
        progressCircle.style.strokeDashoffset = circumference - (circumference * percent) / 100;

        let count = 0;
        const speed = 20;
        const interval = setInterval(() => {
          if (count >= percent) {
            clearInterval(interval);
          } else {
            count++;
            percentElem.textContent = count + "%";
          }
        }, speed);
        circle.classList.add("animated");
      }
    });
  }, { threshold: 0.5 });
  
  skillCircles.forEach(circle => skillObserver.observe(circle));

  // Projects filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.filter;
      projects.forEach((proj) => {
        if (filter === "all" || proj.classList.contains(filter)) {
          proj.style.display = "block";
          setTimeout(() => {
            proj.style.opacity = "1";
          }, 10);
        } else {
          proj.style.opacity = "0";
          setTimeout(() => {
            proj.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Project Modal
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDescription = document.getElementById("modal-description");
  const modalLiveLink = document.getElementById("modal-live-link");
  const modalGithubLink = document.getElementById("modal-github-link");
  const closeBtn = document.querySelector(".close-btn");
  const viewDetailsBtns = document.querySelectorAll(".view-details-btn");

  viewDetailsBtns.forEach(button => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".project-card");
      modalTitle.textContent = card.dataset.title;
      modalImage.src = card.dataset.image;
      modalDescription.textContent = card.dataset.description;
      modalLiveLink.href = card.dataset.live-link;
      modalGithubLink.href = card.dataset.github-link;
      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    });
  });
  
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    document.body.style.overflow = "auto";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  });

  // Contact form submission to Google Sheets
  const contactForm = document.getElementById("contact-form");
  const feedback = contactForm.querySelector(".form-feedback");
  
  // You need to replace 'YOUR_FORM_ID' with the actual ID of your Google Form.
  // To get the ID, create a Google Form, click 'Send', then 'Embed HTML'. Copy the 'src' URL from the iframe.
  // The ID is the long string of characters after '/d/e/'.
  const formId = "YOUR_FORM_ID";
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Clear previous errors
    contactForm.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    feedback.textContent = "";

    let valid = true;
    if (name === "") {
      contactForm.querySelector("#name-error").textContent = "Name is required.";
      valid = false;
    }
    if (email === "" || !/^\S+@\S+\.\S+$/.test(email)) {
      contactForm.querySelector("#email-error").textContent = "Valid email is required.";
      valid = false;
    }
    if (message === "") {
      contactForm.querySelector("#message-error").textContent = "Message cannot be empty.";
      valid = false;
    }

    if (!valid) return;

    feedback.textContent = "Sending...";

    const data = new FormData();
    data.append("entry.123456789", name); // You need to find the correct entry IDs
    data.append("entry.987654321", email); // Replace with your entry IDs
    data.append("entry.112233445", message); // Replace with your entry IDs

    fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: data
    })
    .then(() => {
      feedback.textContent = "Thank you for reaching out! I'll get back to you soon.";
      contactForm.reset();
    })
    .catch((error) => {
      feedback.textContent = "There was an error sending your message. Please try again or contact me directly.";
      console.error("Error:", error);
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Scroll animation reveal for sections
  const animateElements = document.querySelectorAll(".animate");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach((el) => observer.observe(el));
});
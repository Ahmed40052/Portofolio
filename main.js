/* =============================================
   Mobile Menu Toggle
   ============================================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector("#mainNav ul");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");

  const icon = menuToggle.querySelector("i");

  if (navLinks.classList.contains("show")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});

// قفل المنيو تلقائي لما تدوس على أي لينك
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    const icon = menuToggle.querySelector("i");
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  });
});

/* =============================================
   Dark / Light Mode Toggle
   ============================================= */
const themeToggleBtn = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  localStorage.setItem("preferredTheme", theme);
}

(function initTheme() {
  const saved = localStorage.getItem("preferredTheme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    applyTheme(prefersLight ? "light" : "dark");
  }
})();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current =
      rootEl.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(current === "light" ? "dark" : "light");
  });
}

/* =============================================
   Page Loader
   ============================================= */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => loader.classList.add("loaded"), 250);
  }
});

/* =============================================
   Scroll Reveal Animations
   ============================================= */
const revealTargets = document.querySelectorAll(".reveal, .revealStagger");

if ("IntersectionObserver" in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealVisible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("revealVisible"));
}

/* =============================================
   Scroll Spy — Active Nav Link
   ============================================= */
const sections = document.querySelectorAll("main > div[id], header[id]");
const navAnchorLinks = document.querySelectorAll("#mainNav ul li a");

function setActiveLink(id) {
  navAnchorLinks.forEach((link) => {
    const match = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("activeLink", match);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );

  sections.forEach((section) => spyObserver.observe(section));
}

/* =============================================
   Back to Top Button
   ============================================= */
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    },
    { passive: true },
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =============================================
   Contact Form — Validation Feedback
   ============================================= */
const contactFormEl = document.querySelector(".contactForm form");

if (contactFormEl) {
  const formStatusEl = document.createElement("p");
  formStatusEl.className = "formStatus";
  contactFormEl.prepend(formStatusEl);

  function wrapFieldMessage(input) {
    const fieldWrap = input.closest(".field");
    if (!fieldWrap) return null;
    let msg = fieldWrap.querySelector(".fieldMsg");
    if (!msg) {
      msg = document.createElement("span");
      msg.className = "fieldMsg";
      fieldWrap.appendChild(msg);
    }
    return { fieldWrap, msg };
  }

  function validateField(input) {
    const wrap = wrapFieldMessage(input);
    if (!wrap) return true;
    const { fieldWrap, msg } = wrap;

    if (!input.willValidate) return true;

    if (input.checkValidity()) {
      fieldWrap.classList.remove("fieldError");
      fieldWrap.classList.add("fieldSuccess");
      msg.textContent = "";
      return true;
    } else {
      fieldWrap.classList.add("fieldError");
      fieldWrap.classList.remove("fieldSuccess");
      msg.textContent = input.validationMessage;
      return false;
    }
  }

  contactFormEl.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      const fieldWrap = input.closest(".field");
      if (fieldWrap && fieldWrap.classList.contains("fieldError")) {
        validateField(input);
      }
    });
  });

  contactFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    let allValid = true;
    contactFormEl
      .querySelectorAll("input, textarea, select")
      .forEach((input) => {
        if (!validateField(input)) {
          allValid = false;
        }
      });

    formStatusEl.classList.remove("success", "error");

    if (allValid) {
      formStatusEl.textContent =
        "تم إرسال الرسالة بنجاح! هترد عليك في أقرب وقت. (Demo — لا يتم إرسال بيانات فعلياً)";
      formStatusEl.classList.add("success", "show");
    } else {
      formStatusEl.textContent =
        "في حقول محتاجة تعديل قبل الإرسال، برجاء المراجعة تحت.";
      formStatusEl.classList.add("error", "show");
      const firstError = contactFormEl.querySelector(
        ".fieldError input, .fieldError textarea, .fieldError select",
      );
      if (firstError) firstError.focus();
    }
  });

  contactFormEl.addEventListener("reset", () => {
    setTimeout(() => {
      contactFormEl.querySelectorAll(".field").forEach((f) => {
        f.classList.remove("fieldError", "fieldSuccess");
        const msg = f.querySelector(".fieldMsg");
        if (msg) msg.textContent = "";
      });
      formStatusEl.classList.remove("show", "success", "error");
    }, 0);
  });
}

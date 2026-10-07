// Bond Technology Partners

// Contact form submissions are delivered by FormSubmit (https://formsubmit.co).
// After the inbox owner clicks FormSubmit's activation email, swap the address
// below for the random alias FormSubmit provides so the address isn't public.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/michael@bookmarkpartners.com";

document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scrolling
const NAV_OFFSET = -150;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis = null;
if (window.Lenis && !reduceMotion) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || !lenis) return;
  const id = link.getAttribute("href");
  const target = id === "#top" || id === "#" ? 0 : document.querySelector(id);
  if (target === null) return;
  e.preventDefault();
  lenis.scrollTo(target, { offset: target === 0 ? 0 : NAV_OFFSET });
  history.replaceState(null, "", id);
});

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("nav-menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  menu.classList.toggle("open", !open);
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("open");
  }
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".principle, .section__head, .exchange__col, .journey__step, .path, .diagram, .feature, .ccard, .faq__list, .form"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  revealTargets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// "Talk about…" links preselect the matching form option
document.querySelectorAll("[data-interest]").forEach((link) => {
  link.addEventListener("click", () => {
    const select = document.querySelector('#contact-form select[name="interest"]');
    if (select) select.value = link.dataset.interest;
  });
});

// Contact form
const form = document.getElementById("contact-form");
const status = form.querySelector(".form__status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.classList.remove("error");

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.value.trim() && field.checkValidity();
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Please fill in your name, firm and a valid email.";
    status.classList.add("error");
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  if (data._honey) return; // bot filled the hidden field

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  status.textContent = "Sending…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Name: data.name,
        Firm: data.company,
        Email: data.email,
        Phone: data.phone || "(not provided)",
        "Interested in": data.interest,
        Message: data.message || "(none)",
        _replyto: data.email,
        _subject: `Bond inquiry: ${data.company} (${data.interest})`,
        _template: "table",
        _captcha: "false",
      }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || String(result.success) !== "true") throw new Error(result.message || res.statusText);
    form.reset();
    status.textContent = "Thank you. We'll be in touch within one business day.";
  } catch {
    status.textContent = "Something went wrong sending your message. Please try again in a moment.";
    status.classList.add("error");
  } finally {
    button.disabled = false;
  }
});

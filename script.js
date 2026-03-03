/**
 * WALE BHANKS PORTFOLIO — script.js
 * Features:
 *  - Dark / Light theme toggle (localStorage)
 *  - Mobile side nav toggle
 *  - Smooth scroll + active nav highlighting
 *  - Typing animation
 *  - Scroll reveal animations
 *  - Skill bar animations on scroll
 *  - Contact form validation + WhatsApp/mailto dispatch
 */

/* ===================== THEME ===================== */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const THEME_KEY    = 'wb-theme';

/** Read saved theme or default to dark */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', saved);
}

/** Toggle between dark and light */
function toggleTheme() {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();


/* ===================== SIDE NAV MOBILE ===================== */
const sidenav   = document.getElementById('sidenav');
const navToggle = document.getElementById('navToggle');
const overlay   = document.getElementById('navOverlay');

function openNav()  {
  sidenav.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  sidenav.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  sidenav.classList.contains('open') ? closeNav() : openNav();
});
overlay.addEventListener('click', closeNav);

/* Close nav when a link is clicked (mobile) */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeNav();
  });
});


/* ===================== SMOOTH SCROLL + ACTIVE LINK ===================== */
const sections  = document.querySelectorAll('.section');
const navLinks  = document.querySelectorAll('.nav-link');

/**
 * Update active nav link based on scroll position.
 * Uses IntersectionObserver for performance.
 */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));


/* ===================== SCROLL REVEAL ===================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const index    = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ===================== SKILL BARS ===================== */
/**
 * Animate skill bars when they scroll into view.
 * Each .skill-item has data-pct="N" for the target percentage.
 */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.skill-fill');
      const pct = entry.target.dataset.pct || 0;
      // Small timeout so CSS transition is visible
      setTimeout(() => {
        bar.style.width = pct + '%';
      }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));


/* ===================== TYPING ANIMATION ===================== */
const typingText = document.getElementById('typingText');

const PHRASES = [
  'Forex & Crypto Trader',
  'Frontend Developer',
  'AI Engineer'
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const TYPE_SPEED  = 80;   // ms per character typed
const DEL_SPEED   = 45;   // ms per character deleted
const PAUSE_END   = 1800; // ms pause at full phrase
const PAUSE_START = 400;  // ms pause before typing next

function typeLoop() {
  const current = PHRASES[phraseIndex];

  if (!isDeleting) {
    // Type forward
    typingText.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, PAUSE_END);
      return;
    }
    setTimeout(typeLoop, TYPE_SPEED);
  } else {
    // Delete backward
    typingText.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      setTimeout(typeLoop, PAUSE_START);
      return;
    }
    setTimeout(typeLoop, DEL_SPEED);
  }
}

// Start typing after short delay
setTimeout(typeLoop, 800);


/* ===================== CONTACT FORM ===================== */
const form        = document.getElementById('contactForm');
const nameInput   = document.getElementById('formName');
const emailInput  = document.getElementById('formEmail');
const msgInput    = document.getElementById('formMessage');
const nameError   = document.getElementById('nameError');
const emailError  = document.getElementById('emailError');
const msgError    = document.getElementById('messageError');
const successMsg  = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('formSubmit');

const WHATSAPP_NUM = '2347011439308';
const EMAIL_TO     = 'walebhanks7@gmail.com';

/** Simple email regex validation */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Clear all error messages */
function clearErrors() {
  nameError.textContent  = '';
  emailError.textContent = '';
  msgError.textContent   = '';
}

/** Highlight field with error */
function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.style.borderColor = '#ef4444';
  input.focus();
}

/** Reset field border on input */
function bindResetBorder(input) {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
  });
}
bindResetBorder(nameInput);
bindResetBorder(emailInput);
bindResetBorder(msgInput);

/**
 * Validate and submit the form.
 * On success: open WhatsApp pre-filled + mailto link.
 */
form.addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrors();

  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = msgInput.value.trim();

  let valid = true;

  // Validate Name
  if (!name) {
    showError(nameInput, nameError, 'Please enter your full name.');
    valid = false;
  }

  // Validate Email
  if (!email) {
    if (valid) showError(emailInput, emailError, 'Please enter your email address.');
    emailError.textContent = emailError.textContent || 'Please enter your email address.';
    valid = false;
  } else if (!isValidEmail(email)) {
    if (valid) showError(emailInput, emailError, 'Please enter a valid email address.');
    emailError.textContent = emailError.textContent || 'Please enter a valid email address.';
    valid = false;
  }

  // Validate Message
  if (!message) {
    if (valid) showError(msgInput, msgError, 'Please write a message before sending.');
    msgError.textContent = msgError.textContent || 'Please write a message before sending.';
    valid = false;
  } else if (message.length < 10) {
    if (valid) showError(msgInput, msgError, 'Message is too short. Please give more detail.');
    msgError.textContent = msgError.textContent || 'Message is too short. Please give more detail.';
    valid = false;
  }

  if (!valid) return;

  // ===== SUCCESS: Dispatch via WhatsApp + mailto =====

  // 1) Build WhatsApp message
  const waText = `Hello Wale,\n\nMy name is ${name} (${email}).\n\n${message}`;
  const waURL  = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(waText)}`;

  // 2) Build mailto link
  const mailSubject = `Portfolio Contact from ${name}`;
  const mailBody    = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailURL     = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  // Show success message
  successMsg.classList.add('visible');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sent ✓';

  // Open WhatsApp in new tab
  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Open email client after short delay
  setTimeout(() => {
    window.location.href = mailURL;
  }, 1200);

  // Reset form after 4 seconds
  setTimeout(() => {
    form.reset();
    successMsg.classList.remove('visible');
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }, 4000);
});
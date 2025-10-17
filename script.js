document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky shrink effect
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('shrink');
    else navbar.classList.remove('shrink');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open')); // close after click
    });
  }

  const typeEl = document.getElementById('typewriter');
if (typeEl) {
  const text = 'Soulat Bemanning og Omsorg AS';
  const speed = 90;        // typing speed per character
  const eraseSpeed = 60;   // erase speed per character
  const delayBetween = 1200; // pause before erase or retype
  let i = 0;
  let typing = true;

  typeEl.textContent = ''; // start empty (no flash)

  const typeLoop = () => {
    if (typing) {
      // typing forward
      typeEl.textContent = text.slice(0, i + 1);
      i++;
      if (i === text.length) {
        typing = false;
        setTimeout(typeLoop, delayBetween);
        return;
      }
    } else {
      // erasing backward
      typeEl.textContent = text.slice(0, i - 1);
      i--;
      if (i === 0) {
        typing = true;
        setTimeout(typeLoop, delayBetween);
        return;
      }
    }
    setTimeout(typeLoop, typing ? speed : eraseSpeed);
  };

  // slight delay to ensure element is rendered before typing begins
  setTimeout(typeLoop, 300);
}


  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  // EmailJS handling on contact page
  const contactForm = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (contactForm && window.emailjs) {
    try {
      if (typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }
    } catch (e) {
      // Config not loaded; do nothing
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.emailjs || typeof EMAILJS_SERVICE_ID === 'undefined' || typeof EMAILJS_TEMPLATE_ID === 'undefined') {
        if (statusEl) statusEl.textContent = 'Noe gikk galt. Vennligst prøv igjen.';
        return;
      }
      if (statusEl) statusEl.textContent = 'Sender...';
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
        .then(() => {
          if (statusEl) statusEl.textContent = 'Takk for meldingen! Vi tar kontakt med deg snart.';
          this.reset();
        })
        .catch(() => {
          if (statusEl) statusEl.textContent = 'Noe gikk galt. Vennligst prøv igjen.';
        });
    });
  }
});
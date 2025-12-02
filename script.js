document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Static header: disable scroll-based shrink behavior

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

      // Send main email (to admin)
      const sendAdmin = emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);
      
      // Send confirmation email (to user) if template ID exists
      if (typeof EMAILJS_CONFIRM_TEMPLATE_ID !== 'undefined' && EMAILJS_CONFIRM_TEMPLATE_ID) {
         // Prepare explicit parameters to ensure the "To Email" and names work correctly
         // regardless of whether the template uses default variables or form field names.
         const formData = new FormData(this);
         const confirmParams = {
             to_name: formData.get('Fornavn') + ' ' + formData.get('Etternavn'),
             to_email: formData.get('E-postadresse'),
             message: formData.get('Beskjed'),
             time: new Date().toLocaleString('no-NO'), // Add localized time string
             // Include original field names as fallback
             'Fornavn': formData.get('Fornavn'),
             'Etternavn': formData.get('Etternavn'),
             'E-postadresse': formData.get('E-postadresse'),
             'Telefonnummer': formData.get('Telefonnummer'),
             'Beskjed': formData.get('Beskjed')
         };

         emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONFIRM_TEMPLATE_ID, confirmParams)
            .catch(err => console.error('Confirmation email failed:', err));
      }

      sendAdmin
        .then(() => {
          if (statusEl) statusEl.textContent = 'Takk for meldingen! Vi tar kontakt med deg snart.';
          this.reset();
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          if (statusEl) statusEl.textContent = 'Noe gikk galt. Vennligst prøv igjen.';
        });
    });
  }
});
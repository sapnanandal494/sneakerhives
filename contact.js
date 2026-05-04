/* ====================================================
   SneakerHive — Contact Page JavaScript
   Form validation · FAQ accordion · Select styling
   ==================================================== */

(function () {
  'use strict';

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Select: add class when value chosen ── */
  const select = document.getElementById('cSubject');
  if (select) {
    select.addEventListener('change', () => {
      select.classList.toggle('has-value', select.value !== '');
    });
  }

  /* ── Contact Form Submit ── */
  const form     = document.getElementById('contactForm');
  const btnSub   = document.getElementById('btnSubmit');
  const toast    = document.getElementById('formToast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const inputs = form.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach((inp) => {
        if (!inp.value.trim()) {
          inp.style.borderBottomColor = 'var(--neon-pink)';
          valid = false;
          setTimeout(() => { inp.style.borderBottomColor = ''; }, 2000);
        }
      });
      if (!valid) return;

      // Simulate sending
      btnSub.classList.add('sending');
      btnSub.textContent = 'Sending…';

      setTimeout(() => {
        btnSub.classList.remove('sending');
        btnSub.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg> Sent!`;
        if (toast) toast.classList.add('show');
        form.reset();
        if (select) select.classList.remove('has-value');

        setTimeout(() => {
          btnSub.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg> Send Message`;
          if (toast) toast.classList.remove('show');
        }, 4000);
      }, 1200);
    });
  }

})();

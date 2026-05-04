/* ====================================================
   SneakerHive — Product Detail Page JavaScript
   Size selector · Color picker · Add to Cart · Wishlist
   ==================================================== */

(function () {
  'use strict';

  /* ── Color / Colorway Picker ── */
  const colorDots    = document.querySelectorAll('.color-dot');
  const selectedColor = document.getElementById('selectedColor');
  const mainImageBg   = document.getElementById('mainImageBg');
  const sneakerEmoji  = document.getElementById('sneakerEmoji');
  const thumbBtns     = document.querySelectorAll('.thumb');

  const colorGlows = {
    'Cyber Blue': 'radial-gradient(circle at 60% 40%, #00f0ff, transparent 65%)',
    'Acid Lime':  'radial-gradient(circle at 60% 40%, #c0ff00, transparent 65%)',
    'Neon Punk':  'radial-gradient(circle at 60% 40%, #ff2d95, transparent 65%)',
  };

  colorDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Sync thumbnail
      thumbBtns.forEach(t => t.classList.remove('active'));
      if (thumbBtns[i]) thumbBtns[i].classList.add('active');

      const name = dot.dataset.name;
      if (selectedColor) selectedColor.textContent = name;
      if (mainImageBg)   mainImageBg.style.background = colorGlows[name] || '';

      // Animate sneaker swap
      if (sneakerEmoji) {
        sneakerEmoji.style.transform = 'scale(0.7) rotate(-20deg)';
        sneakerEmoji.style.opacity   = '0';
        setTimeout(() => {
          sneakerEmoji.style.transform = '';
          sneakerEmoji.style.opacity   = '1';
        }, 280);
      }
    });
  });

  // Thumbnail strip also triggers color
  thumbBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (colorDots[i]) colorDots[i].click();
    });
  });

  /* ── Size Selector ── */
  const sizeBtns    = document.querySelectorAll('.size-btn:not(.disabled)');
  const selectedSize = document.getElementById('selectedSize');

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (selectedSize) selectedSize.textContent = btn.dataset.size;
    });
  });

  /* ── Add to Cart ── */
  const btnAddCart = document.getElementById('btnAddCart');
  if (btnAddCart) {
    btnAddCart.addEventListener('click', () => {
      if (btnAddCart.classList.contains('added')) return;

      // Validate size selection
      const hasSize = document.querySelector('.size-btn.active');
      if (!hasSize) {
        // Shake size grid to prompt selection
        const grid = document.getElementById('sizeGrid');
        if (grid) {
          grid.style.animation = 'none';
          grid.offsetHeight; // reflow
          grid.style.animation = 'shake 0.4s ease';
          // add shake keyframe dynamically
          if (!document.getElementById('shakeStyle')) {
            const style = document.createElement('style');
            style.id = 'shakeStyle';
            style.textContent = `
              @keyframes shake {
                0%,100% { transform: translateX(0); }
                20%      { transform: translateX(-8px); }
                40%      { transform: translateX(8px); }
                60%      { transform: translateX(-6px); }
                80%      { transform: translateX(6px); }
              }`;
            document.head.appendChild(style);
          }
        }
        return;
      }

      btnAddCart.classList.add('added');
      btnAddCart.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Added to Cart!`;

      setTimeout(() => {
        btnAddCart.classList.remove('added');
        btnAddCart.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1-5H4.41L3.17 5H1V3H0v2h3l1.17 5.88L5.5 18H17"/>
          </svg>
          Add to Cart`;
      }, 2500);
    });
  }

  /* ── Wishlist Toggle ── */
  const btnWishlist = document.getElementById('btnWishlist');
  const heartIcon   = document.getElementById('heartIcon');

  if (btnWishlist) {
    let wishlisted = false;
    btnWishlist.addEventListener('click', () => {
      wishlisted = !wishlisted;
      btnWishlist.classList.toggle('wishlisted', wishlisted);
      if (heartIcon) {
        const path = heartIcon.querySelector('path');
        if (path) {
          path.style.fill   = wishlisted ? 'var(--neon-pink)'  : 'none';
          path.style.stroke = wishlisted ? 'var(--neon-pink)'  : 'currentColor';
        }
      }
    });
  }

  /* ── Hover zoom effect on main image ── */
  const mainWrap = document.getElementById('mainImageWrap');
  const sneakerVisual = document.getElementById('sneakerVisual');
  if (mainWrap && sneakerVisual) {
    mainWrap.addEventListener('mousemove', (e) => {
      const rect = mainWrap.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      sneakerVisual.style.transform = `translate(${cx * 18}px, ${cy * 12}px) scale(1.06)`;
    });
    mainWrap.addEventListener('mouseleave', () => {
      sneakerVisual.style.transform = '';
    });
  }

})();

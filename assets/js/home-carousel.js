(function() {
  const phone = document.querySelector('.phone-mock--shots');
  if (!phone) {
    console.warn('Screenshot carousel: phone-mock--shots not found');
    return;
  }

  const data = phone.getAttribute('data-shots') || '';
  const shots = data.split(',').map(s => s.trim()).filter(Boolean);

  console.log('Screenshot carousel initialized with', shots.length, 'images');

  if (!shots.length) {
    console.warn('Screenshot carousel: no images found in data-shots');
    return;
  }

  const img = phone.querySelector('#shots-slide');
  const dots = Array.from(phone.querySelectorAll('[data-shots-dot]'));
  const prevBtn = phone.querySelector('[data-shots-prev]');
  const nextBtn = phone.querySelector('[data-shots-next]');

  if (!img) {
    console.warn('Screenshot carousel: #shots-slide img not found');
    return;
  }

  console.log('Found carousel elements:', {
    img: !!img,
    dots: dots.length,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn
  });

  let idx = 0;
  let timer;

  const set = (i) => {
    idx = (i + shots.length) % shots.length;
    if (img) {
      img.src = shots[idx];
      console.log('Screenshot carousel: switched to slide', idx, shots[idx]);
    }
    dots.forEach((d, j) => d.classList.toggle('is-active', j === idx));
  };

  const next = () => set(idx + 1);
  const start = () => {
    clearInterval(timer);
    timer = setInterval(next, 3500);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      console.log('Screenshot carousel: prev button clicked');
      set(idx - 1);
      start();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      console.log('Screenshot carousel: next button clicked');
      set(idx + 1);
      start();
    });
  }

  dots.forEach((d, j) => d.addEventListener('click', () => {
    console.log('Screenshot carousel: dot', j, 'clicked');
    set(j);
    start();
  }));

  set(0);
  start();
  console.log('Screenshot carousel: auto-play started');
})();


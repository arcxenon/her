(() => {
  const landing = document.getElementById('landing');
  const explore = document.getElementById('explore');
  const world = document.getElementById('world');
  const modal = document.getElementById('responseModal');
  const responseText = document.getElementById('responseText');
  const responseButton = document.getElementById('responseButton');
  const worldBg = document.getElementById('worldBg');
  const worldTitle = document.getElementById('worldTitle');
  const messages = [1, 2, 3].map(n => document.getElementById(`message${n}`));
  const chooseAnother = document.getElementById('chooseAnother');
  const storyCards = [...document.querySelectorAll('[data-scroll-card]')];

  const worlds = {
    love: {
      title: "Dinosaur of Love's World",
      bg: 'assets/love.webp',
      messages: [
        'This is my world of love for you, I have loved you ever since i saw you, i could not ask for better, you are perfect for me.',
        'My life without you is dull, you are the everlasting fruit of joy for me, I may be far, but my love is not',
        'I love you Rupali, You are mine.'
      ]
    },
    apology: {
      title: "Dinosaur of Apology's World",
      bg: 'assets/apology.webp',
      messages: [
        'Rupali, I know what i have done, I am devastated that i could not see what you felt',
        'I see it all now, i did not want to make you feel like you are taken for granted, i accidentally did what i have myself always hated',
        'I love you Rupali, I hope you can forgive me'
      ]
    },
    promises: {
      title: "Dinosaur of Promises' World",
      bg: 'assets/promises.webp',
      messages: [
        'My first promise to you was that i will get in a good college, so our dreams of being together will be more realistic, and i accomplished it, I want you to be with me for life, I want it all, and the promises are an extension of that desire',
        'My next promise to you is that No matter how difficult it gets, never let me go, and i will also never let you go, you are mine and i am yours. Yes as my girlfriend, there will be days where you may feel that i am distant, but it is all so i can be 1% more sure of having a future for us',
        'I love you Rupali. All i need is you, All i want is you, You are my desire, and you are my need.'
      ]
    }
  };

  let hateStep = 0;
  let currentScene = landing;

  function showScene(target) {
    [landing, explore, world].forEach(section => {
      section.hidden = section !== target;
      section.classList.remove('scene-enter');
    });
    target.hidden = false;
    currentScene = target;
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => target.classList.add('scene-enter'));
  }

  function openModal(text, buttonText = text) {
    responseText.textContent = text;
    responseButton.textContent = buttonText;
    modal.hidden = false;
    requestAnimationFrame(() => responseButton.focus({preventScroll:true}));
  }

  function closeModal() { modal.hidden = true; }

  function beginLove() {
    hateStep = 0;
    openModal("Let's go :))", "Let's go :))");
    responseButton.onclick = () => { closeModal(); showScene(explore); };
  }

  function beginHate() {
    const steps = [
      { text: 'really?', button: 'really?' },
      { text: 'no you dont, right?', button: 'no you dont, right?' },
      { text: "Let's go :))", button: "Let's go :))" }
    ];
    hateStep = 0;
    const advance = () => {
      const item = steps[hateStep];
      openModal(item.text, item.button);
      responseButton.onclick = () => {
        hateStep += 1;
        if (hateStep >= steps.length) {
          closeModal();
          showScene(explore);
          return;
        }
        advance();
      };
    };
    advance();
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'love') beginLove();
    if (action === 'hate') beginHate();

    const selectedWorld = event.target.closest('[data-world]')?.dataset.world;
    if (selectedWorld) enterWorld(selectedWorld);

    const back = event.target.closest('[data-back]')?.dataset.back;
    if (back === 'landing') showScene(landing);
    if (back === 'explore') showScene(explore);
  });

  chooseAnother.addEventListener('click', () => showScene(explore));
  modal.querySelector('.modal__scrim').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!modal.hidden) closeModal();
      else if (currentScene === world) showScene(explore);
      else if (currentScene === explore) showScene(landing);
    }
  });

  function enterWorld(key) {
    const data = worlds[key];
    if (!data) return;
    worldBg.style.backgroundImage = `url("${data.bg}")`;
    world.dataset.theme = key;
    worldTitle.textContent = data.title;
    messages.forEach((node, i) => node.textContent = data.messages[i]);
    storyCards.forEach(card => card.classList.remove('is-visible'));
    showScene(world);
    setTimeout(() => storyCards[0].classList.add('is-visible'), 250);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: .42 });
  storyCards.forEach(card => observer.observe(card));

  // Gentle single-image parallax to keep the mockups feeling alive.
  const canParallax = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches;
  if (canParallax) {
    document.addEventListener('pointermove', e => {
      if (currentScene === world) return;
      const bg = currentScene.querySelector?.('[data-parallax-bg]');
      if (!bg) return;
      const x = (e.clientX / innerWidth - .5) * 14;
      const y = (e.clientY / innerHeight - .5) * 10;
      bg.style.transform = `scale(1.055) translate3d(${-x}px, ${-y}px, 0)`;
    });
    document.addEventListener('pointerleave', () => {
      const bg = currentScene.querySelector?.('[data-parallax-bg]');
      if (bg) bg.style.transform = 'scale(1.04)';
    });
  }

  // World parallax responds to scroll while the message scrolls reveal.
  addEventListener('scroll', () => {
    if (world.hidden) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, scrollY / max);
    worldBg.style.transform = `scale(1.07) translate3d(${progress * -10}px, ${progress * -18}px, 0)`;
  }, { passive: true });
})();

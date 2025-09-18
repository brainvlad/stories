/**
 * Инициализирует плеер Stories по заданным параметрам
 *
 * @param {{
 *    target: string,
 *    slides: Array<{url: string, alt?: string}>,
 *    delayPerSlide?: number
 *  }} params - параметры инициализации
 *
 *   1. target - место инициализации плеера, CSS селектор
 *   2. slides - список слайдов плеера
 *   3. delayPerSlide - как долго показывается один слайд
 *
 * @returns {Element|null}
 */
function initPlayer(params) {
  const
    target = document.querySelector(params.target);

  if (target === null || params.slides === undefined) {
    return null;
  }

  let
    timer,
    isPlaying = true;

  let
    timelineChunks = '',
    playerChunks = '';

  let
    isFirst = true;

  for (const slide of params.slides) {
    timelineChunks += generateTimelineChunk(isFirst);
    playerChunks += generatePlayerChunk(slide, isFirst);
    isFirst = false;
  }

  target.innerHTML = generatePlayerLayout();
  target.querySelector('.player-content__switcher_prev').addEventListener('click', switchToPrevChunk);
  target.querySelector('.player-content__switcher_next').addEventListener('click', switchToNextChunk);

  runChunkSwitching(params.delayPerSlide || 1, 1);

  const
    playerButton = target.querySelector('.player');

  if (playerButton) {
    playerButton.addEventListener('mousedown', () => {
      isPlaying = false;
    });

    playerButton.addEventListener('mouseup', () => {
      isPlaying = true;
    });

    playerButton.addEventListener('touchstart', () => {
      isPlaying = false;
    });

    playerButton.addEventListener('touchend', () => {
      isPlaying = true;
    });
  }

  return target.querySelector('.player');

  function generateTimelineChunk(isFirst) {
    return `
      <div class="timeline__chunk ${isFirst ? 'timeline__chunk_active' : ''}">
        <div class="timeline__chunk-inner"></div>
      </div>`;
  }

  function generatePlayerChunk(slide, isFirst) {
    const
      style = [];

    if (slide.filter) {
      style.push(`filter: ${slide.filter.join(' ')}`);
    }

    return `
      <div class="player-content__chunk ${isFirst ? 'player-content__chunk_active' : ''}">
        <img src="${slide.url}" alt="${slide.alt || ''}" style="${style.join(';')}">
        ${generateOverlays(slide)}
      </div>`;
  }

  function generateOverlays(slide) {
    if (slide.overlays === undefined) {
      return '';
    }

    let
      result = '';

    for (const overlay of slide.overlays) {
      const
        classes = (overlay.classes !== undefined ? overlay.classes.join(' ') : '');

      const
        styles = (overlay.styles !== undefined ? Object.entries(overlay.styles) : [])
          .map((overlay) => overlay.join(':'))
          .join(';');

      result += `
        <div class="player-content__overlay ${classes}" style="${styles}">${renderOverlay(overlay)}</div>
      `;
    }

    return result;

    function renderOverlay(overlay) {
      if (overlay.type === 'text') {
        return overlay.value;
      }

      if (overlay.type === 'question') {
        return `
          <div class="player-content__question">
            ${overlay.question}
            <div class="player-content__question-answer-list">
              <button value="1">${overlay.variants[0] || 'Да'}</button>
              <button value="2">${overlay.variants[1] || 'Нет'}</button>
            </div>
          </div>
        `;
      }

      if (overlay.type === 'img') {
        return `<img src="${overlay.value}" alt="">`;
      }
    }
  }

  function generatePlayerLayout() {
    return `
    <div class="player">
      <div class="timeline">
        ${timelineChunks}
      </div>

      <div class="player-content">
        <div class="player-content__switcher player-content__switcher_prev"></div>
        <div class="player-content__switcher player-content__switcher_next"></div>
        
        <div class="player-content__list">
          ${playerChunks}
        </div>
      </div>
    </div>`;
  }

  function moveClass(className, method, pred) {
    const active = target.querySelector('.' + className), next = active[method];

    if (pred && !pred(active)) {
      return null;
    }

    if (next) {
      active.classList.remove(className);
      next.classList.add(className);

      return active;
    }
    return null;
  }

  function switchToNextChunk() {
    moveClass('player-content__chunk_active', 'nextElementSibling');

    const el = moveClass('timeline__chunk_active', 'nextElementSibling');
    if (el) {
      el.querySelector('.timeline__chunk-inner').style.width = '';
    }
  }

  function switchToPrevChunk() {
    const prev = moveClass('timeline__chunk_active', 'previousElementSibling', (el) => {
      const inner = el.querySelector('.timeline__chunk-inner'), width = parseFloat(inner.style.width) || 0;

      el.querySelector('.timeline__chunk-inner').style.width = '';
      return width <= 20;
    });

    if (prev) {
      moveClass('player-content__chunk_active', 'previousElementSibling');
    }
  }


  function runChunkSwitching(time, step) {
    clearInterval(timer);

    timer = setInterval(() => {
      if (!isPlaying) return;

      const active = target.querySelector('.timeline__chunk_active').querySelector('.timeline__chunk-inner');
      const width = parseFloat(active.style.width) || 0;

      if (width === 100) {
        switchToNextChunk();
        return;
      }

      active.style.width = String(width + step) + '%';
    }, time * 1000 * step / 100);
  }
}














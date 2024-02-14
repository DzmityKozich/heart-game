'use strict'
// удалять burst вместе с сердечком
// сделать кастомную форуму для burst

// создавать рандомно сердечки на канвасе

// изменять параметры (размер и цвет) сердечек

class LoveU extends mojs.CustomShape {
  getShape() {
    return `<g stroke="#000" stroke-miterlimit="10" stroke-width="1.5">
    <path fill="red" stroke="red"
      d="M17.47,1.52a3.33,3.33,0,0,0-2.61,1.16,3.31,3.31,0,0,0-2.6-1.16A2.89,2.89,0,0,0,9.14,4.1c0,3.87,5.72,6,5.72,6s5.73-2.14,5.73-6A2.89,2.89,0,0,0,17.47,1.52Z" />
    <line x1="2.45" y1="1.52" x2="6.27" y2="1.52" />
    <line x1="4.36" y1="10.11" x2="4.36" y2="1.52" />
    <line x1="2.45" y1="10.11" x2="6.27" y2="10.11" />
    <polyline fill="none"
      points="7.23 14.89 7.23 15.84 4.36 19.66 1.5 15.84 1.5 14.89" />
    <line x1="4.36" y1="23.48" x2="4.36" y2="19.66" />
    <rect fill="none" x="10.09" y="15.84" width="4.77" height="6.68" rx="2.39" />
    <path fill="none"
      d="M22.5,14.89v5.25a2.39,2.39,0,0,1-2.39,2.38h0a2.39,2.39,0,0,1-2.38-2.38V14.89" />
  </g>`;
  }
  getLength() { return 50; }
}

mojs.addShape('loveU', LoveU);

class HeartShape extends mojs.CustomShape {
  getShape() {
    return '<path d="M73.6170213,0 C64.4680851,0 56.5957447,5.53191489 51.7021277,13.8297872 C50.8510638,15.3191489 48.9361702,15.3191489 48.0851064,13.8297872 C43.4042553,5.53191489 35.3191489,0 26.1702128,0 C11.9148936,0 0,14.0425532 0,31.2765957 C0,48.0851064 14.893617,77.8723404 47.6595745,99.3617021 C49.1489362,100.212766 50.8510638,100.212766 52.1276596,99.3617021 C83.8297872,78.5106383 99.787234,48.2978723 99.787234,31.2765957 C100,14.0425532 88.0851064,0 73.6170213,0 L73.6170213,0 Z"></path>';
  }
}

mojs.addShape('heart', HeartShape);

const HEART_LIVE = 1500;
const SIZES = [50, 100, 150, 200];
const COLORS = [
  '#000000',
  '#ffe555',
  '#ff5ed7ce',
  '#59f4ff',
  '#FF0000',
  '#70ff70',
  '#9795f7',
  '#ffffea',
  '#a42cd6',
  '#bb4d00',
]
const POINTS = {
  50: 200,
  100: 150,
  150: 100,
  200: 50
}

class Heart {
  width = 50;
  animationPlayed = false;

  constructor(heartTemplate, onRemove = () => { }, params) {
    this.params = params;
    this.heart = heartTemplate;
    this.onRemove = onRemove;
    this.width = params.width;
    this.points = POINTS[this.width];
    this.setStyles({ ...params });
    this.initListeners();
  }

  get svg() {
    return this.heart.querySelector('svg');
  }

  get shadowEl() {
    return this.heart.querySelector('#drop-shadow > feDropShadow');
  }

  setStyles(params) {
    const { x, y, color, width } = params;
    this.heart.style.left = `${x}px`;
    this.heart.style.top = `${y}px`;
    this.heart.style.width = `${width}px`;
    this.svg.style.fill = color;
    this.svg.style.stroke = color;
    this.shadowEl.style.floodColor = color;
    this.heart.style.transform = 'translate(-50%, -50%)'
    this.heart.classList.add(`appearance${width}`);
  }

  onClick = () => {
    this.heart.classList.remove(`appearance${this.width}`);
    this.heart.classList.add(`pulse-animation${this.width}`);
    playBurst({ x: this.params.x, y: this.params.y });
  }

  onAnimdationEnd = ({ animationName }) => {
    if (animationName === `pulse${this.width}`) {
      this.remove();
    }
  }

  onAnimdationStart = ({ animationName }) => {
    if (animationName === `pulse${this.width}`) {
      this.animationPlayed = true;
    }
  }

  remove() {
    this.onRemove(this.animationPlayed);
    this.removeListeners()
    this.heart.remove();
    this.onRemove = undefined;
  }

  initListeners() {
    this.heart.addEventListener('animationend', this.onAnimdationEnd);
    this.heart.addEventListener('animationstart', this.onAnimdationStart);
    this.heart.addEventListener('click', this.onClick);
  }

  removeListeners() {
    this.heart.removeEventListener('animationend', this.onAnimdationEnd);
    this.heart.removeEventListener('animationstart', this.onAnimdationStart);
    this.heart.removeEventListener('click', this.onClick);
  }
}

const container = document.querySelector('.container');
const heartTemplate = document.querySelector('#heart-template').content.querySelector('div.heart');
const counter = document.querySelector('.counter');

const burst = new mojs.Burst({
  left: 0, top: 0,
  radius: { 20: 150 },
  angle: 45,
  count: 14,
  children: {
    radius: [20, 70, 20],
    shape: ['circle', 'loveU', 'heart'],
    fill: [{ '#9EC9F5': '#9ED8C6' }, { 'none': 'none' }, { '#CF8EEF': '#CBEB98' }],
    scale: { 1: 0, easing: 'quad.in' },
    pathScale: [.8, null],
    degreeShift: [13, null],
    duration: [500, 700],
    easing: 'quint.out'
  }
});

let heart = null;
const next = true;

const random = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomColor = () => {
  const index = Math.round(Math.random() * COLORS.length - 1);
  return COLORS[index];
}

const randomHeartParams = () => {
  const { width, height } = container.getBoundingClientRect();
  const [x, y] = [random(100, width - 100), random(100, height - 100)];
  const color = randomColor();
  return { x, y, color, width: SIZES[random(0, 3)] };
}

const heartLifeCycle = () => {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => heart?.remove(), HEART_LIVE);
    const params = randomHeartParams();
    const onRemove = (animated) => {
      clearTimeout(timeoutId);
      animated && updateCounter(heart.width);
      resolve();
    }
    heart = new Heart(heartTemplate.cloneNode(true), onRemove, params);
    container.appendChild(heart.heart);
  });
}

const nextHeart = () => {
  const lifeCicle = heartLifeCycle();
  if (next) {
    lifeCicle.then(() => nextHeart());
  }
}

const updateCounter = (points) => {
  counter.textContent = (+counter.textContent || 0) + points;
}

const playBurst = (position) => {
  burst.tune(position).replay();
}

document.addEventListener('DOMContentLoaded', () => {
  nextHeart();
});

const createHeart = () => {
  const heart = new Heart(heartTemplate.content.querySelector('div.heart').cloneNode(true));
  container.insertBefore(heart.heart, createBtn);
}

// createBtn.addEventListener('click', createHeart);
// container.addEventListener('click', ({ pageX, pageY }) => {
//   burst.tune({ x: pageX, y: pageY }).replay();
// });
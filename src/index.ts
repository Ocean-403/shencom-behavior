import './index.scss';

const W = 40; // 拼图矩形边长
const R = 10; // 拼图圆块半径
const { PI } = Math;
let X = 0;
let Y = 0;

/**
 * 滑块实际边长
 */
const blockWidth = W + R * 2;
/**
 * 滑块移动时Y轴坐标痕迹
 */
const trail: number[] = [];

export interface BehaviorOption {
  /** dom */
  el: HTMLElement;
  /** 高度 */
  height: number;
  /** 宽度 */
  width: number;
  /** 背景图Url */
  url?: string;
  /** 验证成功钩子 */
  onSuccess?: () => void;
  /** 验证失败钩子 */
  onFail?: () => void;
  /** 点击刷新钩子 */
  onRefresh?: () => void;
}

/** 获取一个范围内的随机数 */
const getRandomNumberByRange = (start: number, end: number) =>
  Math.round(Math.random() * (end - start) + start);

const sum = (x: number, y: number) => x + y;

const square = (x: number) => x * x;

const addClass = (element: HTMLElement, className: string) => {
  element.classList.add(className);
};

const removeClass = (element: HTMLElement, className: string) => {
  element.classList.remove(className);
};

const setClass = (element: HTMLElement, className: string) => {
  element.className = className;
};

/**
 *
 * @param width
 * @param height
 * @returns
 */
const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 *
 * @param tagName
 * @param className
 * @returns
 */
const createElement = (tagName: string, className?: string) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return element;
};

class Behavior {
  protected canvas!: HTMLCanvasElement;

  protected block!: HTMLCanvasElement;

  protected canvasCtx!: CanvasRenderingContext2D;

  protected blockCtx!: CanvasRenderingContext2D;

  protected loadingContainer!: HTMLElement;

  protected sliderMask!: HTMLElement;

  protected sliderIcon!: HTMLElement;

  protected Img!: HTMLImageElement;

  protected config = {} as BehaviorOption;

  constructor(ops: BehaviorOption) {
    this.config = ops;
  }

  initDOM() {
    const { width, height, el } = this.config;
    const Captcha = createElement('div', 'Captcha');
    Captcha.style.width = `${width}px`;
    const canvas = createCanvas(width, height); // 画布
    const block = createCanvas(width, height); // 滑块
    setClass(block, 'block');
    const slider = createElement('div', 'slider');
    slider.style.width = `${width}px`;
    const refresh = createElement('div', 'refresh');
    refresh.onclick = () => {
      this.reset();
      if (typeof this.config.onRefresh === 'function') this.config.onRefresh();
    };
    const sliderMask = createElement('div', 'slider-Mask');
    const sliderIcon = createElement('div', 'slider-Icon');
    sliderIcon.style.pointerEvents = 'none';
    const span = createElement('span');
    const text = createElement('span', 'sliderText');
    text.innerHTML = '向右滑动填充拼图';

    // 增加loading
    const loadingContainer = createElement('div', 'loadingContainer');
    loadingContainer.style.width = `${width}px`;
    loadingContainer.style.height = `${height}px`;
    const loadingIcon = createElement('div', 'loadingIcon');
    const loadingText = createElement('span');
    loadingText.innerHTML = '加载中...';
    loadingContainer.appendChild(loadingIcon);
    loadingContainer.appendChild(loadingText);

    el.appendChild(Captcha);
    Captcha.appendChild(loadingContainer);
    Captcha.appendChild(canvas);
    Captcha.appendChild(refresh);
    Captcha.appendChild(block);
    Captcha.appendChild(slider);
    slider.appendChild(text);
    slider.appendChild(sliderMask);
    sliderMask.appendChild(sliderIcon);
    sliderIcon.appendChild(span);

    Object.assign(this, {
      canvas,
      block,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d'),
      loadingContainer,
      sliderMask,
      sliderIcon,
    });
  }

  /**
   * 创建图片实例
   *
   * @param onload Image实例onload事件
   * @returns Image实例
   */
  createImg(onload: () => void) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = onload;
    img.src = this.config.url || `https://picsum.photos/${this.config.width}/${this.config.height}`;
    return img;
  }

  initCanvas() {
    const { height, width } = this.config;
    if (!this.canvas || !this.block) return;
    X = getRandomNumberByRange(W + 10, width - W * 2);
    Y = getRandomNumberByRange(10 + R * 2, height - (W + 10));

    this.drawCanvas(this.canvasCtx, true);
    this.drawCanvas(this.blockCtx);

    this.canvasCtx.drawImage(this.Img, 0, 0, width, height);
    this.blockCtx.drawImage(this.Img, 0, 0, width, height);

    // 滑块实际的Y坐标(减去一个凸起的圆)
    const _y = Y - R * 2 + 1;
    const ImageData = this.blockCtx.getImageData(X, _y, blockWidth, blockWidth);
    this.block.width = blockWidth;
    this.blockCtx.putImageData(ImageData, 0, _y);
  }

  /**
   * 绘制拼图缺口
   *
   * @param ctx canvas画布
   * @param fill  是否使用fill方法 背景图true 滑块false
   */
  drawCanvas(ctx: CanvasRenderingContext2D, fill?: boolean) {
    ctx.beginPath();
    ctx.moveTo(X, Y);
    ctx.arc(X + W / 2, Y - R + 2, R, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(X + W, Y);
    ctx.arc(X + W + R - 2, Y + W / 2, R, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(X + W, Y + W);
    ctx.lineTo(X, Y + W);
    ctx.arc(X + R - 2, Y + W / 2, R + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(X, Y);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.stroke();
    ctx.globalCompositeOperation = 'destination-over';
    if (fill) {
      ctx.fill();
    } else {
      ctx.clip();
    }
  }

  /**
   * 验证是否成功拼图及真人操作
   *
   * @returns
   */
  verify() {
    const arr = trail; // 拖动时y轴的移动轨迹
    const average = arr.reduce(sum) / arr.length; // 均值
    const deviations = arr.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    const left = parseInt(this.block.style.left, 10);

    return {
      spliced: Math.abs(left - X) < 5,
      verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    };
  }

  /**
   * 拼图移动事件
   */
  TouchEvent() {
    let originX: number;
    let originY: number;
    let isMouseDown = false;

    const handleDragStart = (e: TouchEvent) => {
      console.log('e: ', e);
      originX = e.touches[0].clientX;
      originY = e.touches[0].clientY;
      isMouseDown = true;
    };

    const handleDragMove = (e: TouchEvent) => {
      const { width } = this.config;
      if (!isMouseDown) return;
      e.preventDefault();
      const eventX = e.touches[0].clientX;
      const eventY = e.touches[0].clientY;
      const moveX = eventX - originX;
      const moveY = eventY - originY;
      if (moveX < 0 || moveX + W >= width) return;
      this.sliderIcon.style.left = `${moveX}px`;

      addClass(this.sliderMask, 'sliderIcon_activer');
      const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX;
      this.block.style.left = `${blockLeft}px`;

      this.sliderMask.style.width = `${moveX}px`;
      trail.push(moveY);
    };

    const handleDragEnd = (e: TouchEvent) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const eventX = e.changedTouches[0].clientX;
      if (eventX === originX) return;

      const { spliced, verified } = this.verify();

      if (spliced && verified) {
        addClass(this.sliderMask, 'sliderIcon_success');
        if (typeof this.config.onSuccess === 'function') this.config.onSuccess();
      } else {
        addClass(this.sliderMask, 'sliderContainer_fail');
        setTimeout(() => {
          this.reset();
        }, 1000);
        if (typeof this.config.onFail === 'function') this.config.onFail();
      }
    };

    this.sliderIcon.addEventListener('touchstart', handleDragStart, { passive: false });
    this.block.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }

  /**
   * 重置拼图
   * @returns
   */
  reset() {
    const { width, height } = this.config;
    if (!this.canvas || !this.block) return;
    // 重置样式
    setClass(this.sliderMask, 'slider-Mask');

    this.sliderIcon.style.left = `${0}px`;
    this.sliderMask.style.width = `${0}px`;
    this.sliderMask.style.left = `${0}px`;
    this.block.width = width;
    this.block.style.left = `${0}px`;

    this.loadingContainer.style.display = '';
    this.sliderIcon.style.pointerEvents = 'none';

    // 清空画布
    this.canvasCtx.clearRect(0, 0, width, height);
    this.blockCtx.clearRect(0, 0, width, height);

    // 重新加载图片
    this.Img.src = this.config.url || `https://picsum.photos/${width}/${height}`;
  }

  init() {
    this.initDOM();
    this.Img = this.createImg(() => {
      this.initCanvas();
      this.loadingContainer.style.display = 'none';
      this.sliderIcon.style.pointerEvents = '';
    });

    this.TouchEvent();
  }
}

export { Behavior };

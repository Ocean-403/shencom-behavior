(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Behavior = {}));
})(this, (function (exports) { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".Captcha {\n  position: relative;\n  width: 310px;\n}\n.Captcha .block {\n  left: 0;\n  top: 0;\n  position: absolute;\n}\n.Captcha .refresh {\n  position: absolute;\n  right: 5px;\n  top: 5px;\n  width: 30px;\n  height: 30px;\n  background: url(https://scplugins.oss-cn-shenzhen.aliyuncs.com/assets/activity/verifyIcon.png) 0 -233px;\n}\n.Captcha .loadingContainer {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 310px;\n  height: 155px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  font-size: 14px;\n  color: #45494c;\n  z-index: 2;\n  background: #edf0f2;\n}\n.Captcha .loadingContainer .loadingIcon {\n  width: 32px;\n  height: 32px;\n  margin-bottom: 10px;\n  background: url(https://scplugins.oss-cn-shenzhen.aliyuncs.com/assets/activity/verifyIcon.png) 0 -332px;\n  animation: rotate 1s linear infinite;\n}\n@keyframes rotate {\n  from {\n    transform: rotate(0);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.Captcha .slider {\n  position: relative;\n  text-align: center;\n  width: 310px;\n  height: 0.8rem;\n  line-height: 0.8rem;\n  margin-top: 0.15rem;\n  background: #f7f9fa;\n  color: #45494c;\n  border: 1px solid #e4e7eb;\n}\n.Captcha .slider-Mask {\n  position: absolute;\n  left: -1px;\n  top: 0;\n  height: 0.8rem;\n  border: 0 solid #1991fa;\n  background: #d1e9fe;\n}\n.Captcha .slider-Icon {\n  position: absolute;\n  top: -1px;\n  left: 0;\n  width: 0.8rem;\n  height: 0.8rem;\n  background: #fff;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);\n  transition: background 0.2s linear;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.Captcha .slider-Icon span {\n  width: 14px;\n  height: 12px;\n  background: url(https://scplugins.oss-cn-shenzhen.aliyuncs.com/assets/activity/verifyIcon.png) 0 -13px;\n}\n.Captcha .sliderIcon_activer {\n  height: 0.8rem;\n  border: 1px solid #1991fa;\n  top: -1px;\n}\n.Captcha .sliderIcon_activer .slider-Icon {\n  border: 1px solid #1991fa;\n  transform: translateX(-0.1rem);\n}\n.Captcha .sliderIcon_success {\n  border: 1px solid #52ccba;\n  background-color: #d2f4ef !important;\n}\n.Captcha .sliderIcon_success .slider-Icon {\n  border: 1px solid #52ccba;\n  background-color: #52ccba !important;\n}\n.Captcha .sliderIcon_success .slider-Icon span {\n  background-position: 0 -26px !important;\n}\n.Captcha .sliderContainer_fail {\n  border: 1px solid #f57a7a;\n  background-color: #fce1e1 !important;\n}\n.Captcha .sliderContainer_fail .slider-Icon {\n  border: 1px solid #f57a7a;\n  background-color: #f57a7a !important;\n}\n.Captcha .sliderContainer_fail .slider-Icon span {\n  background-position: 0 -82px !important;\n}";
  styleInject(css_248z);

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
  const trail = [];
  /** 获取一个范围内的随机数 */
  const getRandomNumberByRange = (start, end) => Math.round(Math.random() * (end - start) + start);
  const sum = (x, y) => x + y;
  const square = (x) => x * x;
  const addClass = (element, className) => {
      element.classList.add(className);
  };
  const setClass = (element, className) => {
      element.className = className;
  };
  /**
   *
   * @param width
   * @param height
   * @returns
   */
  const createCanvas = (width, height) => {
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
  const createElement = (tagName, className) => {
      const element = document.createElement(tagName);
      if (className)
          element.className = className;
      return element;
  };
  class Behavior {
      constructor(ops) {
          this.config = {};
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
              if (typeof this.config.onRefresh === 'function')
                  this.config.onRefresh();
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
      createImg(onload) {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = onload;
          img.src = this.config.url || `https://picsum.photos/${this.config.width}/${this.config.height}`;
          return img;
      }
      initCanvas() {
          const { height, width } = this.config;
          if (!this.canvas || !this.block)
              return;
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
      drawCanvas(ctx, fill) {
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
          }
          else {
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
          let originX;
          let originY;
          let isMouseDown = false;
          const handleDragStart = (e) => {
              console.log('e: ', e);
              originX = e.touches[0].clientX;
              originY = e.touches[0].clientY;
              isMouseDown = true;
          };
          const handleDragMove = (e) => {
              const { width } = this.config;
              if (!isMouseDown)
                  return;
              e.preventDefault();
              const eventX = e.touches[0].clientX;
              const eventY = e.touches[0].clientY;
              const moveX = eventX - originX;
              const moveY = eventY - originY;
              if (moveX < 0 || moveX + W >= width)
                  return;
              this.sliderIcon.style.left = `${moveX}px`;
              addClass(this.sliderMask, 'sliderIcon_activer');
              const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX;
              this.block.style.left = `${blockLeft}px`;
              this.sliderMask.style.width = `${moveX}px`;
              trail.push(moveY);
          };
          const handleDragEnd = (e) => {
              if (!isMouseDown)
                  return;
              isMouseDown = false;
              const eventX = e.changedTouches[0].clientX;
              if (eventX === originX)
                  return;
              const { spliced, verified } = this.verify();
              if (spliced && verified) {
                  addClass(this.sliderMask, 'sliderIcon_success');
                  if (typeof this.config.onSuccess === 'function')
                      this.config.onSuccess();
              }
              else {
                  addClass(this.sliderMask, 'sliderContainer_fail');
                  setTimeout(() => {
                      this.reset();
                  }, 1000);
                  if (typeof this.config.onFail === 'function')
                      this.config.onFail();
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
          if (!this.canvas || !this.block)
              return;
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

  exports.Behavior = Behavior;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

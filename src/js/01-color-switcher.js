class ColorSwitcher {
  constructor({ btnStart, btnStop }) {
    this.btnStart = btnStart;
    this.btnStop = btnStop;
    this.intervalID = null;
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.btnStart.addEventListener('click', this.onBtnStart.bind(this));
    this.btnStop.addEventListener('click', this.onBtnStop.bind(this));
  }

  onBtnStart() {
    this.intervalID = setInterval(this.setBodyBGColor.bind(this), 1000);
    this.btnStart.disabled = true;
    this.btnStop.disabled = false;
  }

  onBtnStop() {
    clearInterval(this.intervalID);
    this.btnStart.disabled = false;
    this.btnStop.disabled = true;
  }

  setBodyBGColor() {
    window.document.body.style.backgroundColor = this.getRandomHexColor();
  }

  getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}

const ref = {
  btnStart: document.querySelector('button[data-start]'),
  btnStop: document.querySelector('button[data-stop]'),
};

ref.btnStop.disabled = true;
ref.btnStart.style.cursor = 'pointer';
ref.btnStop.style.cursor = 'pointer';

new ColorSwitcher(ref).init();

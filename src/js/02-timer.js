import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

class Timer {
  constructor({ btnStart, days, hours, minutes, seconds }) {
    this.btnStart = btnStart;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.intervalID = null;
  }

  init(selectedDate) {
    this.disabledBtnStart(selectedDate);

    this.btnStart.addEventListener(
      'click',
      this.onBtnStartClick.bind(this, selectedDate)
    );
  }

  disabledBtnStart(selectedDate) {
    if (!this.ckeckCorrectDate(selectedDate)) {
      this.btnStart.disabled = true;
      return;
    }

    this.btnStart.disabled = false;
  }

  ckeckCorrectDate(selectedDate) {
    const currentData = new Date();
    if (currentData > selectedDate) {
      Notify.failure('Please choose a date in the future');
      return false;
    }

    return true;
  }
  onBtnStartClick(selectedDate) {
    this.btnStart.disabled = true;
    clearInterval(this.intervalID);

    this.intervalID = setInterval(() => {
      const restTime = selectedDate - Date.now();

      this.timerValueMarkup(this.convertMs(restTime));

      if (restTime < 1000) {
        clearInterval(this.intervalID);
      }
    }, 1000);
  }

  timerValueMarkup({ days, hours, minutes, seconds }) {
    this.days.textContent = this.addLeadingZero(days);
    this.hours.textContent = this.addLeadingZero(hours);
    this.minutes.textContent = this.addLeadingZero(minutes);
    this.seconds.textContent = this.addLeadingZero(seconds);
  }

  addLeadingZero(value) {
    return value.toString().padStart(2, 0);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const ref = {
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

ref.btnStart.disabled = true;

const timer = new Timer(ref);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: 'l, j F Y, H:i',
  onClose(selectedDates) {
    timer.init(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);

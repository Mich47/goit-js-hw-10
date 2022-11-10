import { Notify } from 'notiflix/build/notiflix-notify-aio';

class PromiseGenerator {
  constructor({ formRef, delay, step, amount }) {
    this.formRef = formRef;
    this.delay = delay;
    this.step = step;
    this.amount = amount;
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.formRef.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  onFormSubmit(event) {
    event.preventDefault();

    this.createPromises({
      delay: this.delay.valueAsNumber,
      step: this.step.valueAsNumber,
      amount: this.amount.valueAsNumber,
    });
  }

  createPromises({ delay, step, amount }) {
    for (let i = 1; i <= amount; i += 1) {
      this.createPromise(i, delay)
        .then(({ position, delay }) => {
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });

      delay += step;
    }
  }

  createPromise(position, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldResolve = Math.random() > 0.3;
        if (shouldResolve) {
          resolve({ position, delay });
        }

        reject({ position, delay });
      }, delay);
    });
  }
}

const refFormInput = {
  formRef: document.querySelector('.form'),
  delay: document.querySelector('input[name="delay"]'),
  step: document.querySelector('input[name="step"]'),
  amount: document.querySelector('input[name="amount"]'),
};

new PromiseGenerator(refFormInput).init();

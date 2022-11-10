import * as debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 1000;

const inputRef = document.querySelector('[id="search-box"]');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(resp => {
      console.log('resp ', resp);
      if (!resp.ok) {
        console.log('Not Find');
        countryListRef.innerHTML = ''; //Clear

        throw new Error('Oops, there is no country with that name');
      }
      console.log('123', resp);

      return resp.json();
    })
    .catch(error => {
      //   console.log(error);
      Notify.failure('123' + error.message);
    });
}

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  console.log('event.target.value', event.target.value);
  if (!event.target.value) {
    return;
  }

  fetchCountries(event.target.value)
    .then(data => {
      console.log('data ', data);
      if (data.length > 10) {
        countryListRef.innerHTML = ''; //Clear
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return null;
      }
      if (data.length === 1) {
        return data
          .map(item => {
            return `
                <li class="country-item">
                <p><img src="${item.flags.svg}" width="30"
        height="30"> ${item.name.common}</p>
        // ======================================
                <p>Capital: ${item.capital}</p>
                <p>Population: ${item.population}</p>
                <p>Languages: ${Object.values(item.languages)}</p>
                </li>`;
          })
          .join('');
      }

      return data
        .map(item => {
          return `
                <li class="country-item">
                <p><img src="${item.flags.svg}" width="30"
        height="30"> ${item.name.common}</p>
                </li>`;
        })
        .join('');
    })
    .then(markup => {
      if (!markup) {
        return null;
      }
      countryListRef.innerHTML = markup;
    })
    .catch(error => {
      //   console.log(error);
      Notify.failure(error.message);
    });
}

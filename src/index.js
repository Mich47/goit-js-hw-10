import * as debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('[id="search-box"]');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
inputRef.addEventListener('keydown', onInputEnter);
countryListRef.addEventListener('click', onClick);

function onInput(event) {
  console.log('inputRef ', inputRef);
  const inputValue = event.target.value.trim();
  if (!inputValue) {
    return;
  }

  getCountries(inputValue);
}

function onInputEnter(event) {
  if (event.code != 'Enter') {
    return;
  }
  onInput(event);
}

function onClick(event) {
  if (event.target.nodeName === 'UL') {
    return;
  }

  if (event.target.nodeName === 'IMG') {
    // inputRef.value = event.target.parentNode.innerText;
    getCountries(event.target.parentNode.innerText);
    return;
  }

  // inputRef.value = event.target.innerText;
  getCountries(event.target.innerText);
}

function getCountries(inputValue) {
  fetchCountries(inputValue)
    .then(getCountriesData)
    .catch(error => {
      Notify.failure(error.message);
    });
}

function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`).then(response => {
    if (!response.ok) {
      clearCountry(); //Clear
      throw new Error('Oops, there is no country with that name');
    }

    return response.json();
  });
}

function getCountriesData(data) {
  console.log('data ', data);
  if (data.length > 10) {
    clearCountry(); //Clear
    Notify.info('Too many matches found. Please enter a more specific name.');
    return null;
  }
  if (data.length === 1) {
    addCountryList(data);
    addCountryInfo(data);
    return null;
  }

  clearCountry(); //Clear
  addCountryList(data);
}

function getCountryListMarkup(data) {
  return data
    .map(({ flags: { svg }, name: { official } }) => {
      return `
        <li class="country-item">
          <img src="${svg}" width="60">
          <div>
          <p>${official}</p>
          </div>
        </li>`;
    })
    .join('');
}

function getCountryInfoMarkup(data) {
  return data
    .map(({ name: { common }, capital, population, languages }) => {
      return `
        <div>
          <p>Common Name: <span>${common}</span></p>
          <p>Capital: <span>${capital}</span></p>
          <p>Population: <span>${population}</span></p>
          <p>Languages: <span>${Object.values(languages).join(', ')}</span></p>
        </div>`;
    })
    .join('');
}

function addCountryList(data) {
  countryListRef.innerHTML = getCountryListMarkup(data);
}

function addCountryInfo(data) {
  countryInfoRef.innerHTML = getCountryInfoMarkup(data);
}

function clearCountry() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}

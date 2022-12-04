import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(serchCountry, DEBOUNCE_DELAY));

function serchCountry(e) {
  const name = e.target.value.trim();

  if (name === '') {
    deleteMarkup(refs.countryInfo);
    deleteMarkup(refs.countryList);
    return;
  }

  fetchCountries(name)
    .then(fetched => {
      if (fetched.length > 10) {
        deleteMarkup(refs.countryInfo);
        deleteMarkup(refs.countryList);
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            clickToClose: true,
          }
        );

        return;
      }
      console.log(fetched);
      commonMarkup(fetched);
    })
    .catch(error => {
      deleteMarkup(refs.countryInfo);
        deleteMarkup(refs.countryList);
        Notify.failure('Oops, there is no country with that name', {
          clickToClose: true,
        });
      console.log(error);
    });
}

function commonMarkup(fetched) {
  if (fetched.length > 1) {
    refs.countryList.innerHTML = renderCountryListMarkup(fetched);
    deleteMarkup(refs.countryInfo);
  } else {
    refs.countryInfo.innerHTML = renderCountryInfoMarkup(fetched);
    deleteMarkup(refs.countryList);
  }
}

function renderCountryListMarkup(fetched) {
  return fetched
    .map(
      ({ flags, name }) =>
        `<li style='list-style: none; margin-bottom: 10px; display: flex; margin-left: -40px'><img src="${flags[0]}" alt="country-flag" width="40px" height="20px" style='display: block;
  max-width: 100%; height: auto; margin-right: 10px;'/> ${name.common}</li>`
    )
    .join('');
}

function renderCountryInfoMarkup(fetched) {
  return fetched
    .map(
      ({ flags, name, capital, population, languages }) =>
        `<h1 style='display: flex;'>
        <img src="${
          flags[0]
        }" alt="country-name" width="50px" height="25px" style='display: block; max-width: 100%; height: auto; margin-right: 10px;'/>
        ${name.common}</h1>
        <ul style='padding-left: 0;'>
          <li style='list-style: none; margin-bottom: 10px; display: flex;'><b>Capital</b>: ${capital}</li>
          <li style='list-style: none; margin-bottom: 10px; display: flex;'><b>Population</b>: ${population}</li>
          <li style='list-style: none; margin-bottom: 10px; display: flex;'><b>Languages</b>: ${Object.values(
            languages
          )}</li>
        </ul>`
    )
    .join('');
}

function deleteMarkup(markupElement) {
  markupElement.innerHTML = '';
}

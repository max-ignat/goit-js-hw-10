import { Notify } from 'notiflix/build/notiflix-notify-aio';

const URL = 'https://restcountries.com/v3/name';

export function fetchCountries(name) {
  return fetch(
    `${URL}/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    
      return response.json();
    

    Notify.failure('Oops, there is no country with that name', {
        clickToClose: true,
    });
    // throw new Error('response.statusText');
  });
}

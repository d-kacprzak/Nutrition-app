import { APP_ID, AppKey } from './appKey';

function fetchApp(value) {
  fetch(`https://api.edamam.com/search?q=${value}&app_id=${APP_ID}&app_key=${AppKey}&from=0&to=10&calories=591-722&health=alcohol-free`)
    .then((res) => res.json())
    .then((data) => {
      let output = '';
      const { hits } = data;

      for (const item in hits) {
        console.log(hits[item].recipe);
        output
                  += `
                    <div>
                        <figure>
                           <img src="${hits[item].recipe.image}" alt="">
                           <figcaption>${hits[item].recipe.label}</figcaption>
                        </figure>
                        <div>${hits[item].recipe.ingredientLines}</div>
                    </div>
                            `;
      }
      document.querySelector('.output').innerHTML = output;
    });
}

let inputValue = '';

const btnSearch = document.querySelector('a.btn');
btnSearch.addEventListener('click', (e) => {
  e.preventDefault();
  inputValue = document.getElementById('searchValue').value;
  fetchApp(inputValue);
  inputValue = '';
  document.querySelector('#searchValue').value = '';
});

const apiKey = "8195434c";
const apiUrl = 'http://www.omdbapi.com';

const autoCompleteConfig={
  renderOption(movie) {
    const imgSrc =  movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})            
    `;
  },
  inputValue(movie){
    return movie.Title
  },
  async getSearchResults(searchTerm) {
    const response = await fetchData(apiUrl, {
      apikey: apiKey,
      s: searchTerm
    });
    
    return response.data.Search;
    
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'), 
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  } 
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),  
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {

  const result = await fetchData(apiUrl, {
    apikey: apiKey,
    i: movie.imdbID
  });

  const dataValues = parseDataValues(result.data);

  summaryElement.innerHTML = movieTemplate(result.data, dataValues);

  if(side ==='left'){
    leftMovie = result.data;
  }
  else{
    rightMovie = result.data;
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value) ;
    const rightSideValue = parseInt(rightStat.dataset.value);

    if(leftSideValue > rightSideValue ){
      setLosingScheme(rightStat);
    }else{
      setLosingScheme(leftStat);           
    }
  })
}

const setLosingScheme = (stat) => {
  stat.classList.remove('is-primary');
  stat.classList.add('is-warning');
}

const movieTemplate = (movieDetail, dataValues) => { 
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value =${dataValues.awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>    
    <article data-value =${dataValues.dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value =${dataValues.metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>  
    <article data-value =${dataValues.imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>   
    <article data-value =${dataValues.imdbVotes}  class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

const parseDataValues = (movieDetail) => {   
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/\,/g, ''));  
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/\,/g, ''));  

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    }else{
      return prev + value;
    }    

  }, 0);

  return{
    dollars,
    metascore,
    imdbRating,
    imdbVotes,
    awards
  }
}


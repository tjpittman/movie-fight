const createAutoComplete = ({
    renderOption,      
    inputValue, 
    getSearchResults,
    root,
    onOptionSelect
}) => {
  
  root.innerHTML = `
     <label><b>Search</b></label>
     <input class="input"/>
     <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>  
      </div>
    `;
    
    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async (event) => { 
      const items = await getSearchResults(event.target.value);          
      
      console.log(items);

      if(!items.length){
        dropdown.classList.remove('is-active');
        return;
      }
    
      resultsWrapper.innerHTML = '';    
      dropdown.classList.add('is-active');        
      for(let item of items){
          const listItem = document.createElement('a')          
              
          listItem.classList.add("dropdown-item");
          listItem.innerHTML = renderOption(item);    
          listItem.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = inputValue(item)
            onOptionSelect(item);
          });
    
          resultsWrapper.appendChild(listItem);
      }
    };

    input.addEventListener('input', debounce(onInput));
    
    document.addEventListener('click', (event) => {
      if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
      }
    });
};


const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...arg) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, arg);
        }, delay); 
    };
};

const  fetchData = async (url, params) => {     
    const response = await axios.get(url, {params: params});
     
    if(response.data.Error){
      return [];
    };
    
    return response;    
}; 

const BASE_URL = `https://api.yelp.com/v3/businesses/search?`
function formatQueryParams(params) {
    const myQuery = Object.keys(params)
        .filter(key => {
            return params[key] !== ''
        })
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
    console.log(' params', myQuery)
    return myQuery.join('&');
}

function getServicesURL(serviceType, myLocation) {
    const params = {
        'q': `${serviceType}  ${myLocation || ''}`,

    };
    
    const queryString = formatQueryParams(params)
    const authorize= " Authorization=${api_Config.Authorization}"
    /*const options = {
     headers:  new Headers({
          " Authorization": authorize})
      };*/
    const url = BASE_URL + '&' + queryString + '&' + authorize;
    
    console.log('URL:', url);

    const myResults = $('#search-output')
    myResults.empty()

    $('#js-error-message').text('Loading, please wait...')
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log('JSON RESPONSE:', responseJson)
            if (responseJson.hits.length === 0) {

                return $('#js-error-message').show().text(`Search Yields No Results`)
            }
            $('#js-error-message').hide()
            displayResults(responseJson.hits)
        })

        .catch(err => {
            console.error(err)
            $('#js-error-message').text(`Something went wrong: ${err.message}`);

        });
}

function displayResults(dataArr) {
    $('#inputForm').remove();
    $('#myResults').css('display', 'block');
    const myResults = $('#search-output')
    myResults.empty()
    $('#resultsHeader').show()

 /*showModal();
  hideModal();*/
  const businessIterator = business=>{
    const serviceTypeObj = business.name;
   /*const ingredientsHTML = recipeObj.ingredients.map(ingredientObj=>`<li>${ingredientObj.text}</li>`)


        const result =$(`<section class="card">
            <a id="hideHttp" href="${recipeObj.shareAs.replace('http://', 'https://')}" data-lity>${recipeObj.image}
            <div class="result" style="background-image:url('${recipeObj.image}'); height:200px;"></div>
            </a>
         <nav>
         <button >Click For Ingredients List</button>
  </nav>
     </section>`)

     $(result).find('button').click(()=>{
        showModal()
        $('#modal_box_message').html(ingredientsHTML)
     })
  myResults.append(result)
    }
    dataArr.forEach(itemIterator)
  }*/
  }
}
//import { stat } from "fs";

//calling route from backend for GET request...
const DATABASE_URL = "/referrals"

//listen for when the user clicks the submit button...
$( document ).ready(
    function (){
        $('.searchReferrals-button').click(generateReferrals);

        
    }
)
//do a fetch for the data...
function getData(){
 return  fetch(DATABASE_URL);

}

               
// manage user inputs...
function checkUserInput(service, zipcode,city,state){

    let serviceType= $('#serviceType').val();
    let locationType= $('#locationType').val();
    let locationCity= $('#locationCity').val();
    let locationState= $('locationState').val();
        //I'm trying to say, if it is true that there's a value in the input field, then return that value...
       // if (service.value == true){
           if(service.value =data.referrals.length || !0){
            return data.referrals.business_type == serviceType;
        }
        if (service.value =data.referrals.length || !0){
            return data.referrals.location == locationType;
        }
        if (service.value =data.referrals.length || !0){
            return data.referrals.location == locationCity;

        }
        if (service.value =data.referrals.length || !0){
            return data.referrals.location == locationState;

        }
}
    
// function responsible for getting the data, filtering through the checkUserInputs function and then displaying...
 function generateReferrals(){

        let data=getData()
        let userInput = checkUserInput()
        console.log('SubmitSearch Button Clicked')
        event.preventDefault()
        $('#myResults').removeAttr('hidden');
        $('.searchReferrals').hide();
        
        data.then(response=>response.json())
        
        .then(data=> 
            {console.log(data);
            let filteredData =  data.filter(userInput);
            console.log(filteredData);
            })
        .then( filteredData =>{
                let referralList = filteredData.referrals.map(elm=>{
                    return templateMaker(elm)
                });
                    $('#resultsHeader').append(referralList)
                    console.log(referralList);
            })
                

            /*if(data.referrals.length ===0){
                return $('#js-error-message').text(`Search Yields No Results`);
           }if(data.referrals.business_type == serviceType){
                    let referralServiceType = data.referrals.map(elm=>{
                        return templateMaker(elm)
                    });
                 $('#resultsHeader').append(referralServiceType);//templateMaker(serviceType);
           }*/
                

    };

// creating the template for returned data...
function templateMaker(filteredData){
    return (`<li role="listitem class="cards_item">
              
    <div class="card">
    <div class="card_content">
    <h3 class="businessType">${filteredData.business_type}</h3>
    <h3 class="businessName">${filteredData.business_name}</h3>
    <h4 class= "businessInfo">Business Info:</h4>
    <p> Phone Number: ${filteredData.phone_number}</p>
    <p> Email: ${filteredData.email}</p>
    <p>location: ${filteredData.street} ${filteredData.city} ${filteredData.state} ${filteredData.zipcode}</p>
    <h4> class="businessReviews">Business Reviews:</h4>
    <p> Review: ${filteredData.reviews}</p>
    <button class="clear-results" type="button">Clear Search Results</button>
    </div>
    </div>
    </li>
    `)

}
   
   
     
    
    

/*function deleteResults(){
    $('.clear-results').on(click, event=>{
        console.log('deleted');
        location.reload();

    })
}



function handleApp(){
    generateReferrals();
  
} */


	


//$(handleApp); 



const DATABASE_URL = "/referrals"
//const referrals = require('./config')
$( document ).ready(
    function (){
        $('.searchReferrals-button').click(generateReferrals);

        
    }
);

function getData(){
 return  fetch(DATABASE_URL)
/*.then(response=> response.json())
.then(data=>console.log(data))
*/

}
function generateReferrals(){

        let data=getData()
        console.log('SubmitSearch Button Clicked')
        event.preventDefault()
        $('#myResults').removeAttr('hidden');
        $('.searchReferrals').hide();
        /*let referralList = data.map(elm=>{
            return templateMaker(elm);

        })
        $('.resultsHeader').append(referralList);*/
        data.then(response=>response.json())
        //.then(data=>console.log(data))
        .then(data=> 
            {console.log(data)
                let referralList = data.referrals.map(elm=>{
            return templateMaker(elm)});
            $('#resultsHeader').append(referralList)
            console.log(referralList);
            })
        ;

    };
function templateMaker(data){
    return (`<li role="listitem class="cards_item">
              
    <div class="card">
    <div class="card_content">
    <h3 class="businessType">${data.business_type}</h3>
    <h3 class="businessName">${data.business_name}</h3>
    <h4 class= "businessInfo">Business Info:</h4>
    <p> Phone Number: ${data.phone_number}</p>
    <p> Email: ${data.email}</p>
    <p>location: ${data.street} ${data.city} ${data.state} ${data.zipcode}</p>
    <h4> class="businessReviews">Business Reviews:</h4>
    <p> Review: ${data.reviews}</p>
    <button class="clear-results" type="button">Clear Search Results</button>
    </div>
    </div>
    </li>
    `)

}
   
   /* fetch(DATABASE_URL).then(response=>response.json)
    .then(data =>{

        const serviceType= $('#serviceType').val();
        const locationType= $('#locationType').val();
        const locationCity= $('#locationCity').val();
        const locationState= $('locationState').val();

        /*if(data.referrals.length <=0){
           $('#message').toggleClass("hidden");
       }else{*/
        
           /*for(let i = 0; i<data.referrals.length; i++){
               $('.search-form').remove();
               $('#myResults').css('display,block');
               const output = $('#myResults')
               output.empty()
               $('#myResults').append(`<li role="listitem class="cards_item">
              
                                       <div class="card">
                                       <div class="card_content">
                                       <h3 class="businessType">${data.referrals.businessType}</h3>
                                       <h3 class="businessName">${data.referrals.businessName}</h3>
                                       <h4 class= "businessInfo">Business Info:</h4>
                                       <p> Phone Number: ${data.referrals.businessInfo.phone_number}</p>
                                       <p> Email: ${data.referrals.businessInfo.email}</p>
                                       <p>location: ${data.referrals.locaton.street} ${data.referrals.location.city} ${data.referrals.location.state} ${data.referrals.location.zipcode}</p>
                                       <h4> class="businessReviews">Business Reviews:</h4>
                                       <p> Review: ${data.referrals.reviews}</p>
                                       <button class="clear-results" type="button">Clear Search Results</button>
                                       </div>
                                       </div>
                                       </li>
                                       `);
           
        }
    })
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



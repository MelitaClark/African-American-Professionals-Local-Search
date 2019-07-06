const DATABASE_URL = "/referrals"
//const referrals = require('./config')

fetch(DATABASE_URL)
.then(response=> response.json())
.then(data=>console.log(data))
.then(data=>generateReferrals(data))

function generateReferrals(data){
    $('.searchReferrals-button').click(event => {
        console.log('SubmitSearch Button Clicked');
        event.preventDefault();

       /* const serviceType= $('#serviceType').val();
         const locationType= $('#locationType').val();
         const locationCity= $('#locationCity').val();
         const locationState= $('locationState').val();

         if(data.referrals.length <=0){
            $('#message').toggleClass("hidden");
        }else{
            for(let i = 0; i<data.referrals.length; i++){
                $('.search-form').remove();
                $('#myResults').css('display,block');
                const output = $('#myResults')
                output.empty()
                $('#myResults').append(`<li role="listitem class="cards_item">
               
                                        <div class="card">
                                        <div class="card_content">
                                        <h3 class="businessType">${data.referrals[i].businessType}</h3>
                                        <h3 class="businessName">${data.referrals[i].businessName}</h3>
                                        <h4 class= "businessInfo">Business Info:</h4>
                                        <p> Phone Number: ${data.referrals[i].businessInfo.phone_number}</p>
                                        <p> Email: ${data.referrals[i].businessInfo.email}</p>
                                        <p>location: ${data.referrals[i].locaton.street} ${data.referrals[i].location.city} ${data.referrals[i].location.state} ${data.referrals[i].location.zipcode}</p>
                                        <h4> class="businessReviews">Business Reviews:</h4>
                                        <p> Review: ${data.referrals[i].reviews}</p>
                                        <button class="clear-results" type="button">Clear Search Results</button>
                                        </div>
                                        </div>
                                        </li>
                                        `);
            }*/
        }) }
    
    

/*function deleteResults(){
    $('.clear-results').on(click, event=>{
        console.log('deleted');
        location.reload();

    })
}
function handleApp(){
    generateReferrals();
  
}

$(handleApp); */


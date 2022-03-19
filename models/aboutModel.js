var{mongoose, conn} = require("../Modules/connection");
const { Schema} = require('mongoose');

let  aboutSchema  = mongoose.Schema({
    
// aboutUs:{
//     type:String
// },
// aboutUsCreatedAt:{
//     type:Date,
//     default:Date.now
// },
contactUs:{
    type:String
},
// contactUsCreatedAt:{
//     type:Date,
//     default:Date.now
// },
termsAndServices:{
    type:String
},
email:{
    type:String
},
name:{
    type:String
},
// termsAndServicesCreatedAt:{
//     type:Date,
//     default:Date.now
// },
// helpCenter:{
//     type:Array
// },
// helpCenterCreatedAt:{
//     type:Date,
//     default:Date.now
// },
privacyPolicy:{
    type:String
},
// privacyPolicyCreatedAt:{  
//     type:Date,
//     default:Date.now
// },
})
exports.AboutModel = conn.model('about', aboutSchema); 


var AboutModel = conn.model('about', aboutSchema); 

AboutModel.findOne({}).then((result) => {
    if(!result){
		AboutModel.create({
            contactUs:"Provide barbering services, such as cutting, trimming, shampooing, and styling hair, trimming beards, or giving shaves.",
            termsAndServices:"A legitimate terms-of-service agreement is legally binding and may be subject to change.[2] Companies can enforce the terms by refusing service. Customers can enforce by filing a suit or arbitration case if they can show they were actually harmed by a breach of the terms. There is a heightened risk of data going astray during corporate changes, including mergers, divestitures, buyouts, downsizing, etc., when data can be transferred improperly.",  
            privacyPolicy:"Even if your mobile app doesn’t directly collect personal information from users you’ll still need a Privacy Policy if you’re using a third-party advertising tool like Flurry or Google Analytics.",
            email:"abc@gmail.com",
            name:"barber"
                }, (err, barber)=>{
                    if(err)
                        console.log("Error while create A data");
                    else
                        console.log("data Created!");
                })
          
    }
}).catch((err) => {
        console.log("data error=====>>>>",err)
})






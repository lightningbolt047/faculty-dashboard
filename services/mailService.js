const mailgun=require('mailgun-js');
const mg=mailgun({apiKey:process.env.MAIL_API_KEY,domain:process.env.MAIL_DOMAIN});


module.exports=(toMailAddress,subject,body)=>{
    mg.messages().send({
        from:process.env.MAIL_FROM,
        to:toMailAddress,
        subject:subject,
        text:body
    });
}
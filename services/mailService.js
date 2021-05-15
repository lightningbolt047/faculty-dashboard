const nodemailer = require('nodemailer');
const transporter=nodemailer.createTransport({
   service:process.env.MAIL_SERVICE_TRANSPORT_SERVICE,
   auth:{
       user:process.env.MAIL_SERVICE_MAIL_ADDRESS,
       pass:process.env.MAIL_SERVICE_MAIL_PASSWORD
   }
});

module.exports=(toMailAddress,subject,body)=>{
    if(typeof toMailAddress==='undefined' || typeof subject==='undefined' || typeof body==='undefined'){
        return;
    }
    transporter.sendMail({
        from:process.env.MAIL_SERVICE_MAIL_ADDRESS,
        to:toMailAddress,
        subject:subject,
        text:body
    });
};

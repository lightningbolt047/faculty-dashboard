const crypto=require('crypto');

export default function hashString(username,password){
    const salt="~`!@#$%^&*()_";
    var hash=crypto.createHash('sha1').update(username+salt+password).digest('hex');
    console.log("Hash "+hash);
    return hash;
}
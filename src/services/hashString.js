const crypto=require('crypto');

export default function hashString(username,password){
    const salt="~`!@#$%^&*()_0123456789";
    return crypto.createHash('sha512').update(username+salt+password).digest('hex');
}
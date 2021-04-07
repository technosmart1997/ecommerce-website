const {appConfig} = require('./appConfig');

let COOKIE_NAME = 'st';
let CSR_COOKIE = 'csr';
function validateSession() {
     const {cookies,headers} = req;
     try{
         let config = appConfig();
         if(!cookies || !cookies[COOKIE_NAME]) {
            // return
         }
         // payload is in
         const payload = jwtHelper

     }catch (err) {

     }
}
validateSession();


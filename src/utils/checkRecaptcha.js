let reCAPTCHA=require('recaptcha2')

const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

let recaptcha = new reCAPTCHA({
  siteKey:RECAPTCHA_SITE_KEY,
  secretKey:RECAPTCHA_SECRET_KEY
})

export default function (req) {
    recaptcha.validateRequest(req, req.clientIp)
        .then(function(){
            // validated :thumbsup:
            return true;
        })
        .catch(function(errorCodes) {
            // bad user
            console.log(recaptcha.translateErrors(errorCodes));
            return false;
        });
}

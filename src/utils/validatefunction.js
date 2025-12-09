const validator = require("validator")

const validatesignup = (req)=>{
    const {firstname, lastname, email , password, gender, age, about} = req.body
    if(!firstname || !lastname){
        throw new Error("please fill all the details")
    }
    if(! email || !validator.isEmail(email)){
        throw new Error("please enter a valid email")
    }
    if(!password || !validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}

const validateprofileudate = (req)=>{
    const allowededitsfield = ["firstname", "lastname", "gender" ,"age", "about"]
    const isallowedfiled  = Object.keys(req.body).every((field)=>allowededitsfield.includes(field))
    return isallowedfiled
}
module.exports = {validatesignup, validateprofileudate}
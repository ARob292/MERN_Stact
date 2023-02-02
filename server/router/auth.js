const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res, next) => {
    console.log('Hello world from router')
    next();
});

/*====================================================================================================================
                            With Promises
==================================================================================================================*/

// router.post('/register', (req, res)=>{
//     const { name, email, phone, work, password, cpassword} = req.body;
//     if( !name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error: "please fill the form properly"});
//     }

//     User.findOne({email:email})
//         .then((userExist) =>{
//             if (userExist) {
//                 return res.status(422).json({error: "Email allready Exist"});
//             }
//             const user = new User ({ name, email, phone, work, password, cpassword });
    
//             user.save().then(() =>{
//                 res.status(201).json({ message: "Registration successfull"})
//             }).catch((err) => res.status(500).json({error: "Registration failed"}));

//         }).catch(err => { console.log(err);})

// });


/*====================================================================================================================
                            With Async Await
==================================================================================================================*/


router.post('/register', async (req, res)=>{
    const { name, email, phone, work, password, cpassword} = req.body;
    if( !name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "please fill the form properly"});
    }

    try {

        const userExist = await User.findOne({email:email});

            
            if (userExist) {
                return res.status(422).json({error: "Email allready Exist"});
            }else if(password != cpassword){
                return res.status(422).json({error: "Password is not match"});
            }else{                
                const user = new User ({ name, email, phone, work, password, cpassword });
    
                await user.save();
    
                res.status(201).json({ message: "Registration successfull"});
            }


    } catch (err) {
        console.log(err);
    }

});



/*====================================================================================================================
                            Login Route
==================================================================================================================*/


router.post('/signin', async(req, res) =>{
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({err:"Please fill the form properly"});
        };
        const userLogin = await User.findOne({ email:email });

        if (userLogin) {
            
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);
    
            if (!isMatch) {
                res.status(400).json({err:"Invalid data"});
            } else {
                res.json({message: "user login succesfully"})
            };
            
        } else {
            res.status(400).json({err:"Invalid Data"});
        }


    } catch (error) {
        console.log(err);
    }
})


module.exports = router;
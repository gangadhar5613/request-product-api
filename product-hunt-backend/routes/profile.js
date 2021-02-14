var express = require('express');
var router = express.Router();
let User = require("../Model/User");

// getting user profile
router.get("/:username" ,async (req,res,next)=> {
    try {
        let username = req.params.username;
        let profile = await User.findOne({username});
        console.log(profile, req.user);
        res.json({profile : userProfiles(profile, req.user.userId)});
    } catch (error) {
        console.log(error)
        next(error);
    }
});


function userProfiles(user) {
    return {
        username : user.username,
        bio : user.bio,
        image: user.image,
    }
}

module.exports = router;
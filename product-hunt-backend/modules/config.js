const jwt = require("jsonwebtoken");

module.exports = {
    generateJwt : async (user)=> {
        let payload = {userId: user.id, email: user.email};
        let token = await jwt.sign(payload,process.env.SECRET);
        return token;
    },
    verifyToken : async (req,res,next)=> {
        let token = req.headers.authorization;
        if(token) {
            try {
                let payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                next();
            } catch (error) {
               res.status(401).json({error});
            }
        } else return res.status(401).json({err: "token required"});
    },
    currentUserLoggedIn : async (req,res,next)=> {
        let token = req.headers.authorization;
        if(token) {
            try {
                let payload = await jwt.verify(token,process.env.SECRET);
                req.user = payload;
                next();
            } catch (error) {
               res.status(401).json({error});
            }
        } else {
            req.user = {}
            next();
        }
    }

}

// const jwt = require('jsonwebtoken')

// const User = require('../models/User');



// exports.generateJwt = async (user) => {
//     const payload = {userId:user.id,email:user.email};
//     const token = await jwt.sign(payload,process.env.SECRET);
//     return token;
// }

// exports.verifyToken = async (req,res,next) => {
// const token = req.headers.authorization;
//  if(token){
//      try {
//          const payload = await jwt.verify(token,process.env.SECRET);
//          req.user = payload;
//          next()
//      } catch (error) {
//          next(error);
//      }
//  }else{
//      res.status(401).json({message:'Authentication required'});
//  }

// }
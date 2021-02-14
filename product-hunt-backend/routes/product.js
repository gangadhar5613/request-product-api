var express = require("express");
var router = express.Router();
const Product = require("../Model/Product");
const slugify = require("slugify");
const auth = require("../modules/config");
const User = require("../Model/User");
const Comment = require("../Model/Comment");
const multer = require('multer')
const cloudinaryUpload = require('../modules/cloudinary.config')

//multer config

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage : storage })





//creating product
router.post("/",auth.verifyToken,upload.single('ideathon'), async (req,res,next)=> {
    try {
        req.body.product.slug = slugify(`${req.body.product.title}`);
        req.body.product.author = req.user.userId;
         let authorDetail = await User.findById(req.user.userId);

        // cloudinary sending application
        req.body.ideathon = req.body.filename

       await cloudinaryUpload(req,res)
       console.log(res.image)

       req.body.product.images = res.image.secure_url
        let createdProduct = await Product.create(req.body.product);
        res.json({products: productData(createdProduct,authorDetail)});
    } catch (error) {
        next(error);
        console.log(error);
    }
});

// geting single product
router.get("/:slug",async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        let product = await Product.findOne({slug}).populate('author');
        res.json({products: productData(product,product.author)});
    } catch (error) {
        next(error);
    }
});

// updating product
router.put("/:slug",auth.verifyToken,async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        req.body.product.slug = slugify(`${req.body.product.title}`);
        let updatedProduct = await Product.findOneAndUpdate({slug},req.body.product,{new:true}).populate('author');
        res.json({products: productData(updatedProduct,updatedProduct.author)});
    } catch (error) {
        console.log(error)
        next(error);
    }
});

// deleting an product
router.delete("/:slug", auth.verifyToken, async(req,res,next)=> {
    try {
        let slug = req.params.slug;
        let deletedProduct = await Product.findOneAndDelete({slug});
        res.json("product deleted");
    } catch (error) {
        next(error);
    }
});
// list of all the product
router.get("/",async (req,res,next)=> {
    try {
        let products = await Product.find({}).populate('author');
        res.json({products:products.map((product) => productData(product,product.author))});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

function productData(product,author) {
    return {
        slug: product.slug,
        title: product.title,
        description: product.description,
        body: product.body,
        tagList: product.tagList,
        images: product.images,
        upvotes: product.upvotes,
        author: {
            username: author.username,
            bio: author.bio,
            image: author.image,
        }
    }
}

// creating comment

router.post("/:slug/comments", auth.verifyToken, async (req,res,next)=> {
    try {
        console.log(req.user.userId)
        let slug = req.params.slug;
        req.body.comment.author = req.user.userId;
        let createdComment = await Comment.create(req.body.comment);
        let author = await User.findById(req.user.userId);
        let product = await Product.findOneAndUpdate({slug},{$push : {comment : createdComment._id}},{new:true});
        if(!product) res.json('product not found');
        res.json({comment: commentDetail(createdComment,author)});
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// getting list of comment
router.get("/:slug/comments", async (req,res,next)=> {
    try {
        let slug = req.params.slug;
        let productComment = await Product.findOne({slug}).populate({path: 'comment', populate:{
            path:'author', model:"User"
        }});
        console.log(productComment);
        res.json({comment: productComment.comment.map((comments)=> commentDetail(comments,comments.author))});
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// deleting a comment
router.delete("/:slug/comments/:id",auth.verifyToken, async(req,res,next)=> {
    try {
        let id = req.params.id;
        let slug = req.params.slug;
        let removedCommentId = await Product.findOneAndUpdate({slug},{$pull : {comment: id }});
        let deletedComment = await Comment.findByIdAndDelete(id);
        res.json("comment deleted");
    } catch (error) {
        next(error);
    }
})

function commentDetail(comment,author) {
    return {
        body: comment.body,
        author: {
            username: author.username,
            bio: author.bio,
            image: author.image,
            following : author.following
        }
    }
}

module.exports = router;
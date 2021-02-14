const cloudinary = require('cloudinary')
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage : storage })





function cloudinaryUpload(req,res) {
        const upload = multer({ storage }).single('images')
        upload(req, res, function(err) {
        if (err) {
            return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file)

        // SEND FILE TO CLOUDINARY
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
            cloud_name:'devreddy',
            api_key:'853177596514641',
            api_secret: 'y45YMeuyFNAjKlaMNbiBn_nTTeY'
        })
        
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        
        console.log(path)
        cloudinary.uploader.upload(

            path,
            { public_id: `ideathon/${uniqueFilename}` },
            // directory and tags are optional
            function(err, image) {
                console.log('hello')
            if (err) return res.send(err)
            console.log('file uploaded to Cloudinary')
            // remove file from server
            const fs = require('fs')
            fs.unlinkSync(path)
            // return image details
            
            res.json(image)
            }
        )
        })
 }


module.exports = cloudinaryUpload
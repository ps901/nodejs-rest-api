// var express=require("express");
// var router=express.Router();
// var product = require("../models/products");
// var mongoose=require("mongoose");
// var multer=require("multer");
//
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//         const now = new Date().toISOString();
//         const date = now.replace(/:/g, '-');
//         cb(null, date + file.originalname);
//     }
// });
//
// const filefilter = (req, file, cb) => {
//   //reject a fileSize
//   if(file.mimetype=== "image/jpeg" || file.mimetype==="image/png")
//     {
//       cb(null,true);
//     }else{
//     cb(null,false);
//   }
// }
//
// const upload=multer({storage: storage,
//   limits: {
//   fileSize: 1024*1024*5 //5 MBS this is in bytes
//   },
//   fileFilter: filefilter
// });
//
// router.get("/",(req,res,next) => {
//   product.find()
//   .select("name price _id image") //send only valid data...
//   .exec()  //mandatory
//
//   //if no err
//   .then(docs =>{
//     if(docs.length >0){
//       const response= {
//         count: docs.length,
//         products: docs.map(doc => {
//           return{
//             name: doc.name,
//             price: doc.price,
//             _id: doc._id,
//             image: doc.image,
//             request: {
//               type: "GET",
//               url: "http://localhost:3000/products/"+ doc._id
//             }
//           }
//         })
//       }
//       res.status(200).json(response);
//     }
//     else{
//       res.status(404).json({
//         message: "No entries found"
//       })
//     }
//   })
//   //if err
//   .catch(err =>{
//     console.log(err);
//     res.status(500).json({
//       error: err
//     })
//   })
// });
//
// router.post("/",upload.single("productImage"),(req,res,next) => {
//
//   console.log(req.file);
//   const newproduct=new product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//     image: req.file.path
//   });
//   product.create(newproduct,function(err,prod){
//     if(err)
//       {
//         res.status(200).json({
//           message: "handling post requrest to /products",
//           error: err
//         });
//         console.log(err);
//       }
//     else{
//       message: "Created product successfully",
//       createdProduct= {
//         name: newproduct.name,
//         price: newproduct.price,
//         _id: newproduct._id,
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/products/"+ newproduct._id
//         }
//       }
//       res.status(200).json(createdProduct);
//     }
//   })
// });
//
// router.get("/:productId",(req,res,next) => {
//   const id=req.params.productId;
//   product.findById(id)
//   .select("name price _id image")
//   .exec()
//   .then(doc =>{
//     console.log(doc)
//     if(doc){
//       res.status(200).json({
//         product : doc,
//         response:{
//           type: "GET",
//           url: "http://localhost:3000/products"+doc._id
//         }
//       });
//     }else{
//       res.status(404).json({
//         message: "No valid Entry Found"
//       })
//     }
//   })
//   .catch(err => {
//     console.log(err+"error");
//     res.status(500).json({
//       error: err
//     })
//   })
// })
//
// router.patch("/:productId",(req,res,next) => {
//   const updateops ={};
//   for(var op of req.body){
//     updateops[op.propName]=op.value;
//   }
//   product.update({_id: req.params.productId} , {$set: updateops}).exec() //update only whats required
//   .then(result =>{
//     res.status(200).json({
//       message: "product updated",
//       request: {
//         request: "GET",
//         url: "http://localhost:3000/products/" + result._id
//       }
//     });
//   })
//   .catch( err=>{
//     console.log(err);
//     res.status(500).json({
//       error: err
//     })
//   })
// });
//
// router.delete("/:productId", (req,res,next)=>{
//   product.remove({_id: req.params.productId}).exec()
//   .then(result => {
//     res.status(200).json({
//       message: "product deleted",
//       request: {
//         type:"POST",
//         url: "http://localhost:3000/products",
//         body: { name : "String", price: "Number"}
//       }
//     })
//   })
//   .catch(err =>{
//     console.log(err);
//     res.status(500).json({
//       error: err
//     })
//   })
// })
// module.exports=router;


// REVISION 2

const express=require("express");
const router=express.Router();
const Product=require("../models/products");
const mongoose=require("mongoose");
const multer=require("multer");
const checkAuth=require("../middleware/check-auth");



//storage strategy
const storage=multer.diskStorage({
  destination: function(req,file, cb) {
    cb(null,"./uploads/")
  },
  filename: function(req,file,cb){
    cb(null,file.originalname)
  }
})

const fileFilter=(req,file,cb)=>{
  //accept an image else reject the image
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else
    cb(null, false);
};


const upload=multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
  fileSize: 1024*1024*5 //5mb
}}); // initialization of multer and setting the destination folder


//wrote this on own .. aise bhi likh sake ho bruh you like it
router.get("/",(req,res,next)=>{
  Product.find({}, function(err, products){
    if(err)
      console.log(err);
    else {
      const response={
        count: products.length,
        //instead of sending just the products if we need to add more content to products
        // we use map function to modify content . dekho....
        docs: products.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            image: doc.image,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/"+doc._id
            }
          }
        })
      }
      if(products.length>0)
        res.status(200).json(response);
      else {
        res.status(404).json({
          message: "No products are in database"
        })
      }
    }
  })
})

//create a handler or middleware for upload
// checkauth later because it needs parsing from before used middleware
//we pass the token in header so we need not process req.body
router.post("/" , upload.single("productImage"),checkAuth,(req,res,next)=>{
  console.log(req.file); //new file sent by middleware

  const product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    image: req.file.path
  });

  //you can put exec which turns the function into a promise
  product.save()
  .then((result)=>{
    console.log(result);
    res.status(201).json({
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request:
        {
          type: "GET",
          URL: "http://localhost:3000/products/"+result._id
        }
      },
      message: "Created producted successfully"
      })
    })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

router.get("/:productId",(req,res,next)=>{
  const id=req.params.productId;
  Product.findById(id)
  //it select items that are wanted
  .select("name price image")
  .exec()
  .then((doc) => {
    console.log(doc);
    if(doc) {
        //doc is a json so no problem
      res.status(200).json({
        product: doc,
        request: {
          type : "GET",
          desscription: "Go to the link for all products",
          url: "http://localhost/3000/products"
        }
      })
    } else {
      res.status(404).json({
        message: "No valid entry found"
      })
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
})

router.patch("/:productId",checkAuth,(req,res,next)=>{
  var id= req.params.productId;
  const updateOps={};

  //we send array of properties that we want to update and store it as a key value pair in updateOps
  for(const ops of req.body)
  {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id},{ $set: updateOps })
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: "Product updated",
      result: {
        type: "GET",
        url: "http://localhost:3000/products/"+id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });
})

router.delete("/:productId",checkAuth,(req,res,next)=>{
  var id = req.params.productId;
  Product.remove({_id: id}).exec()
  .then((result)=>{
    res.status(200).json({
      message: "product deleted",
      request:{
        type: "POST",
        url: "http://localhost:3000/products",
        body:{name: "String", price: "Number"}
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
})
module.exports=router;

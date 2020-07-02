// const express=require("express");
// const router=express.Router();
// var mongoose=require("mongoose");
// var order=require("../models/order")
// var product=require("../models/products")
//
//
// router.get("/",(req,res,next)=>{
//
//   order.find()
//   .select("product quantity _id")
//   .populate("product","name")
//   .exec()
//   .then(docs => {
//     res.status(200).json({
//       count: docs.length,
//       orders: docs.map(doc =>{
//         return{
//           id:doc._id,
//           quantity: doc._quantity,
//           product: doc.product,
//           request: {
//             type: "GET",
//             url: "http://localhost:3000/orders/"+ doc._id
//           }
//         }
//       })
//     });
//   })
//   .catch(err => {
//     res.status(500).json({
//       error: err
//     })
//   })
// });
//
//
// router.post("/",(req,res,next)=>{
//   //to make sure that we dont add id whose product doesnt exist
//   product.findById(req.body.productId)
//   .then(product => {
//     if(!product){
//       res.status(404).json({
//         message: "Product not found"
//       })
//     }
//     const neworder = new order({
//       _id: mongoose.Types.ObjectId(),
//       quantity: req.body.quantity,
//       product: req.body.productId
//     })
//
//     return neworder.save()
//     })
//     .then(result =>{
//       console.log(result);
//       res.status(200).json({
//         message: "Message Stored",
//         createdOrder: {
//           id: result._id,
//           product: result.product,
//           quantity: result.quantity
//         },
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/orders/"+result._id
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       })
//   })
// })
//
// router.get("/:orderId",(req,res,next)=>{
//   order.findById(req.params.orderId)
//   .populate("product")
//   .exec()
//   .then(order =>{
//     if(!order){
//       res.status(404).json({
//         message: "order not found"
//       })
//     }
//     res.status(200).json({
//       order: order,
//       request: {
//         type: "GET",
//         url: "http://localhost:3000/orders"
//       }
//     })
//   })
//   .catch(err=>{
//     res.status(500).json({
//       error: err
//     })
//   })
// });
//
// router.delete("/:orderId", (req,res,next)=>{
//   order.remove({_id: req.params.orderId}).exec()
//   .then(doc=>{
//     res.status(200).json({
//       message: "order deleted",
//       response: {
//         type: "POST",
//         url: "http://localhost:3000/orders",
//         body: {productId: "ID", quantity: "Number"}
//       }
//     })
//   })
//   .catch(err =>{
//     res.status(500).json({
//       error: err
//     })
//   })
// });
//
// module.exports=router;


const express=require("express");
const mongoose=require("mongoose");
const Product=require("../models/products");
const Order=require("../models/orders");
const router=express.Router();
const checkAuth=require("../middleware/check-auth");
const OrdersController=require("../controllers/orders");


//THESE ARE CONTROLLERS THAT MAKES THE CODE MUCH MORE CLEANER 
// THESE ARE NOT COMPULSORY BUT JUST MAKES THINKS EASIER
// THEY ALSO MAKE THE API AS MVC API OBVIOSLY THERE IS NO NEED OF VIEW
// ALL OTHER MIDDLEWARE SHOULD BE IN ROUTE FILE
//WE GET CLEANER ROUTE FILE AND ALL CONTROLLERS AT A PLACE
// dont forget the require files

router.get("/",checkAuth, OrdersController.order_get_all);

router.post("/",checkAuth,OrdersController.order_create);


//or you can do normally like this 

router.get("/:orderId",checkAuth,(req,res,next)=>{
  Order.findById(req.params.orderId)
  .populate("product").exec()
  .then(order => {
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://localhost:3000/orders"
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
})

router.delete("/:orderId",checkAuth,(req,res,next)=>{
  res.status(200).json({
    message: "Order deleted",
    orderId: req.params.orderId
  })
})

module.exports=router;

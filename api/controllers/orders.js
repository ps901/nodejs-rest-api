const Order=require("../models/orders");
const Product=require("../models/products");
const mongoose=require("mongoose");

exports.order_get_all= (req,res,next)=>{
    Order.find().select("product quantity _id")
    // .populate("product", "name") to get only name
    .populate("product")
    .exec()
    .then(docs=>{
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc=>{
          return ({
            _id: req._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/"+doc._id
            }
          })
        })
      });
    })
    .catch(err=>{
      res.status(500).json({
        error: err
      });
    })
  }

  exports.order_create = (req,res,next)=>{

    //to know if the productId is a valid id we take the product and first find if
    // such a product exist in the data base ...
  
    Product.findById(req.body.productId).exec()
    .then(product => {
  
      //we get null as product even when there is no found so we use this case
      //since we return then no subsequent code from then will be executed
      if(!product)
        return res.status(404).json({
          message: "Product not found"
        })
  
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      //note for .save() you get a real promise by default. for others you should do .exec
      //using exec will return a catch block
      order.save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order created successfully",
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/"+result._id
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error :err
        });
      })
    })
    .catch(err=>{
      res.status(500).json({
        message: "Product not found",
        error: err
      })
    })
  }
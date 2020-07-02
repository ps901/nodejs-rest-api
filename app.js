const express=require("express");
const app=express();
const morgan=require("morgan");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");

mongoose.connect("mongodb+srv://paarth:"+process.env.mongoPassword+"@cluster0-iraps.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

// removes the depreciation warning ... uses node default promise instead of mongoose ones
mongoose.Promise= global.Promise;

const productRoutes=require("./api/routes/product");
const orderRoutes=require("./api/routes/orders");
const userRoutes=require("./api/routes/user");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static("uploads")); can access file by localhost:3000/1.jpg
// if we need /uploads/1.jpg we do this 
app.use("/uploads",express.static("uploads"));

app.use(morgan("dev"));
// on terminal you get every request code and time
// so you will get info abt request aur kuch nahi hai


//this is used for cors error it allows request from different server and attach header to allow access to different server
// they are from browsers and are sent by browser so we dont send browser
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*"); //give access to any origin or maybe http://mysite
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization" )// can also use *
  if(req.method === "OPTIONS")
  {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
  //we go next when we dont send anything and want to go ro regular routes to proceed
})

app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/user",userRoutes);

//when we are past the above code and found no matching route
app.use((req,res,next)=>{
  const error = new Error("Not found");
  error.status=404;
  next(error);
})

//it is a middleware which handles all kinds of error like above,
// it throws error anywhere from the application
//useful when used a database
app.use((error, req, res, next)=>{
  res.status(error.status || 500)
  res.json({
    //make own setup
    error: {
      message: error.message // by default not found
    }
  })
})


module.exports=app;

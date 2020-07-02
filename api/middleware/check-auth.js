const jwt=require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        const token=req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token,process.env.JWT_KEY) //can also send ,null, and callback 
        req.userData=decoded;
        next();
    } 
    catch(error) {  
        console.log(error);
        return res.status(401).json({
            message: "Auth failed"
        })
    }
        
}

// a middleware to check if authenticated user is allowed to access the route
// jwt.decode only gives back json from token and doesnt verify
// jwt.verify verifies and decodes the given token
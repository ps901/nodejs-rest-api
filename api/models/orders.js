var mongoose=require("mongoose");
// var product=require("./products");
var orderSchema=mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
  quantity: {type: Number, default:1 }              //we are creating a relation
})

module.exports= mongoose.model("Order", orderSchema);

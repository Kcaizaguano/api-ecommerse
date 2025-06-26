import mongoose, {Schema} from "mongoose";

const CartSchema = new Schema({
    user:{type: Schema.ObjectId, ref:'user', required: true},
    product: {type : Schema.ObjectId, ref:'product', required: true},
    type_discount:{type:  Number, required:false,default:1},//1 es por porcentaje y dos  es por moneda
    discount:{type:Number,default:0},
    cantidad:{type:Number,required:true},
    variedad:{type:Schema.ObjectId,ref:'variedad',required:false},
    code_cupon:{type:String, required:false},
    code_discount:{type:String, required:false},
    price_unitario:{type:Number, required:true},
    subtotal:{type:Number, required:true},
    total:{type:Number, required:true},
},{
    timestamps:true
} );

const Cart = mongoose.model("cart", CartSchema);
export default Cart;
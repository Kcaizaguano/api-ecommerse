import mongoose, {Schema } from "mongoose";

const ProductSchema = new Schema ({
    title:{ type: String, required: true, maxlength:250 },
    sku:{ type: String, required: true },
    slug: { type: String , required: true, maxlength: 1000},
    categorie: { type: Schema.ObjectId, ref: 'categorie', required: true },
    price_soles : {  type : Number, required: true },
    price_usd : {  type : Number, required: true },
    portada: { type: String,  required:  true },
    galerias:[ { type: Object, required: false } ],
    state: { type: Number, default: 1 }, // 1 es prueba o desarrollo , 2 va  a ser publico  y 3 va hacer anulado
    stock : { type: Number, default: 0 },
    descripcion: { type: String, required: true},
    resumen: { type: String, required: true },
    tags: { type: String, required: true },
    type_inventario: { type: Number, default: 1 },
} , {
    timestamps: true,
} );

const Product = mongoose.model('product', ProductSchema);

export default Product;
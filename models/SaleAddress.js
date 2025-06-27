import mongoose , {Schema} from 'mongoose'

const SalesAddressSchema = new Schema({
    sale: {type: Schema.ObjectId, ref:'sale' ,require:true },
    name: {type: String, maxlength:250 ,require:true },
    surname: {type: String, maxlength:250 ,require:true },
    pais: {type: String, maxlength:250 ,require:true },
    address: {type: String, maxlength:250 ,require:true },
    referencia: {type: String, maxlength:250 ,require:false },
    ciudad: {type: String, maxlength:250 ,require:true },
    region: {type: String, maxlength:250 ,require:true },
    telefono: {type: String, maxlength:250 ,require:true },
    email: {type: String, maxlength:250 ,require:true },
    nota: {type: String,require:false },
},{
    timestamps:true
}
);

const SalesAddress = mongoose.model("sales_address",SalesAddressSchema);
export default SalesAddress;


import mongoose , {Schema} from 'mongoose'

const AddressClientSchema = new Schema({
    user: {type: Schema.ObjectId, ref:'user' ,require:true },
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

const AddressClient = mongoose.model("address_client",AddressClientSchema);
export default AddressClient;


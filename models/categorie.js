import mongoose , {Schema} from 'mongoose'

const CategorieSchema = new Schema({

    title: {type: String, maxlength:250 ,require:true },
    imagen:{ type: String , maxlength:250, require:true },
    state: { type: Number , maxlength:2 , default:1}

},{
    timestamps:true
}
);

const Categorie = mongoose.model("categorie",CategorieSchema);
export default Categorie;


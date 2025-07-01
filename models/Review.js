import mongoose , {Schema} from 'mongoose'

const ReviewSchema = new Schema({

    product: {type: Schema.ObjectId, ref:'product',require:true },
    sale_detail:{ type: Schema.ObjectId, ref:'sale_detail' ,require:true },
    user:{ type: Schema.ObjectId, ref:'user' ,require:true },
    cantidad: { type: Number , maxlength:2 , require:true},
    description: { type: String  , require:true},
},{
    timestamps:true
}
);

const Review = mongoose.model("review",ReviewSchema);
export default Review;


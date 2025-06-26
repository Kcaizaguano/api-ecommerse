import mongoose , {Schema} from 'mongoose'

const SliderSchema = new Schema({

    title: {type: String, maxlength:250 ,require:true },
    link: {type: String, maxlength:250 ,require:true },
    imagen:{ type: String , maxlength:250, require:true },
    state: { type: Number , maxlength:2 , default:1}

},{
    timestamps:true
}
);

const Slider = mongoose.model("sliders",SliderSchema);
export default Slider;


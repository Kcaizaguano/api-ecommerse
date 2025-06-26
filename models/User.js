import mongoose , {Schema} from 'mongoose'

const UserSchema = new Schema({
    rol:{ type:String, maxlength:30, require:true },
    name:{ type:String, maxlength:250, require:true },
    surname:{ type:String, maxlength:250, require:false },
    email:{ type:String, maxlength:250, require:true, unique:true },
    password:{ type:String, maxlength:250, require:true },
    avatar:{ type:String, maxlength:250, require:false },
    state:{ type:Number, default:1 },//1 es activo y 2 es desactivado
    phone:{ type:String, maxlength:20, require:false },
    birthday:{ type:String, maxlength:20, require:false },
},{
    timestamps:true
}
);

const User = mongoose.model("user",UserSchema);
export default User;


import models from "../models"

export default { 
    register: async (req, res) => {
        try {
            let data = req.body;
            let  exists_cupone =  await models.Cupone.findOne({code : data.code})
            if (exists_cupone) {
                res.status(200).json({ 
                    message:403,
                    message_text : "EL CODIGO DEL CUPON YA EXISTE"
                })
                return;
            }

            let cupone = await models.Cupone.create(data);
            res.status(200).json({
                message:200,
                message_text: "EL CUPON SE REGISTRO CORRECTAMENTE",
                cupone:cupone
            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },

    update: async (req, res) => {
        try {
            let data = req.body;
            let  exists_cupone =  await models.Cupone.findOne({code : data.code,_id:{$ne: data._id}  })
            if (exists_cupone) {
                res.status(200).json({ 
                    message:403,
                    message_text : "EL CODIGO DEL CUPON YA EXISTE"
                })
                return;
            }

            let cupone = await models.Cupone.findByIdAndUpdate({_id:data._id},data);
            let cuponeT = await models.Cupone.findById({_id:data._id});
            res.status(200).json({
                message:200,
                message_text: "EL CUPON SE ACTUALIZO CORRECTAMENTE",
                cupone:cuponeT
            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },

    delete: async (req, res) => {
        try {
            let _id = req.query._id;

            await models.Cupone.findByIdAndDelete({_id:_id});

            res.status(200).json({
                message:200,
                message_text: "EL CUPON SE ELIMINO CORRECTAMENTE",
            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },

    list: async (req, res) => {
        try {
            let search = req.query.search;

            let cupones = await models.Cupone.find({
                $or:[
                    {'code' : new RegExp(search,"i")}
                ]
            }).sort({'createdAt':-1});
            
            res.status(200).json({
                message:200,
                cupones: cupones,
            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },


    show: async (req, res) => {
        try {
            let cupone_id = req.query.cupone_id;
            let cupon = await models.Cupone.findOne( { _id : cupone_id })
            
            res.status(200).json({
                message:200,
                cupon: cupon,
            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },

    config: async (req, res) => {
        try {

            let Products = await models.Product.find({ state: 2 });
            let Categories = await models.Categorie.find({ state:1 });
            
            res.status(200).json({
                message:200,
                products: Products,
                categories: Categories,

            })
        }catch (error) {
            res.status(500).send({ message: 'OCURRIO UN PROBLEMA' });
        }
    },

}
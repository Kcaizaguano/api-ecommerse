
import models  from "../models";
import resources from "./resources";
import Product from "./resources/Product";


export default{
    list: async (req, res) =>{
        try {
            var TIME_NOW = req.query.TIME_NOW;

            let Sliders = await models.Slider.find({state:1});

            Sliders = Sliders.map(slider => {
                return resources.Slider.slider_list(slider);
            })

            let Categories = await models.Categorie.find({state:1});
            Categories = Categories.map(categorie => {
                return resources.Categorie.categorie_list(categorie);
            })

            let BestProducts = await models.Product.find({state:2}).sort({"createdAt":-1});
            var ObjectBestProducts = [];
            for (const Product of BestProducts) {
                let VARIEDADES = await models.Variedad.find({product : Product._id })
                ObjectBestProducts.push(resources.Product.product_list(Product,VARIEDADES));
            }

            let OursProducts = await models.Product.find({state:2}).sort({"createdAt":1});
            var ObjectOursProducts = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({product : Product._id })
                ObjectOursProducts.push(resources.Product.product_list(Product,VARIEDADES));
            }

            let FlashSale = await models.Discount.findOne({
                type_campaign:2,
                start_date_num : {$lte: TIME_NOW},
                end_date_num : {$gte: TIME_NOW}
            })

            let ProductList = [];
            if (FlashSale) {
                if (FlashSale) {
                    for (const product of FlashSale.products) {
                        var ObjecT =  await models.Product.findById({_id:product._id});
                        let VARIEDADES = await models.Variedad.find({product : product._id })
                        ProductList.push(resources.Product.product_list(ObjecT,VARIEDADES));
                    }
                }
            }
            res.status(200).json({ 
                sliders: Sliders,
                categories : Categories,
                best_products :ObjectBestProducts,
                ours_products : ObjectOursProducts,
                flashSale:FlashSale,
                campaign_products : ProductList,
            });

            
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
            console.log(error);
        }
    },
 

    show_landing_product: async( req, res) => {
        try {
            let SLUG = req.params.slug;
            console.log(SLUG);

            let Product =  await models.Product.findOne({slug:SLUG  , state :2});
            let VARIEDADES = await models.Variedad.find({product: Product._id});
            let RelatedProducts = await models.Product.find({ categorie: Product.categorie, state :2 });
            var ObjectRelatedProduct = [];
            for (const Product of RelatedProducts) {
                let VARIEDADES = await models.Variedad.find({product : Product._id })
                ObjectRelatedProduct.push(resources.Product.product_list(Product,VARIEDADES));
            }


            res.status(200).json({
                product: resources.Product.product_list(Product,VARIEDADES),
                related_products : ObjectRelatedProduct,
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
            console.log(error);
        }
    },

}
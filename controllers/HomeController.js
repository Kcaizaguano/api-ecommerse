
import { model } from "mongoose";
import models from "../models";
import resources from "./resources";
import Product from "./resources/Product";
import bycrypt from 'bcryptjs'



export default {
    list: async (req, res) => {
        try {
            var TIME_NOW = req.query.TIME_NOW;

            let Sliders = await models.Slider.find({ state: 1 });

            Sliders = Sliders.map(slider => {
                return resources.Slider.slider_list(slider);
            })

            let Categories = await models.Categorie.find({ state: 1 });
            Categories = Categories.map(categorie => {
                return resources.Categorie.categorie_list(categorie);
            });
            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: { $lte: TIME_NOW },
                end_date_num: { $gte: TIME_NOW }
            });

            let BestProducts = await models.Product.find({ state: 2 }).sort({ "createdAt": -1 });
            var ObjectBestProducts = [];
            for (const Product of BestProducts) {
                let VARIEDADES = await models.Variedad.find({ product: Product._id });
                let REVIEWS = await models.Review.find({ product: Product._id });
                let AVG_REVIEWS = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum, item) => sum + item.cantidad, 0) / REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXIST = null;
                if (CampaingDiscount) {
                    if (CampaingDiscount.type_segment == 1) { // por producto
                        let product_a = [];
                        CampaingDiscount.products.forEach(element => {
                            product_a.push(element._id);
                        });
                        if (product_a.includes(Product._id + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    } else { // por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(element => {
                            categories_a.push(element._id);
                        });
                        if (categories_a.includes(Product.categorie + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    }
                }
                ObjectBestProducts.push(resources.Product.product_list(Product, VARIEDADES, AVG_REVIEWS, COUNT_REVIEW, DISCOUNT_EXIST));
            }

            let OursProducts = await models.Product.find({ state: 2 }).sort({ "createdAt": 1 });
            var ObjectOursProducts = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({ product: Product._id })
                let REVIEWS = await models.Review.find({ product: Product._id });
                let AVG_REVIEWS = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum, item) => sum + item.cantidad, 0) / REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXIST = null;
                if (CampaingDiscount) {
                    if (CampaingDiscount.type_segment == 1) { // por producto
                        let product_a = [];
                        CampaingDiscount.products.forEach(element => {
                            product_a.push(element._id);
                        });
                        if (product_a.includes(Product._id + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    } else { // por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(element => {
                            categories_a.push(element._id);
                        });
                        if (categories_a.includes(Product.categorie + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    }
                }
                ObjectOursProducts.push(resources.Product.product_list(Product, VARIEDADES, AVG_REVIEWS, COUNT_REVIEW, DISCOUNT_EXIST));
            }

            let FlashSale = await models.Discount.findOne({
                type_campaign: 2,
                start_date_num: { $lte: TIME_NOW },
                end_date_num: { $gte: TIME_NOW }
            });

            let ProductList = [];
            if (FlashSale) {
                if (FlashSale) {
                    for (const product of FlashSale.products) {
                        var ObjecT = await models.Product.findById({ _id: product._id });
                        let VARIEDADES = await models.Variedad.find({ product: product._id })
                        ProductList.push(resources.Product.product_list(ObjecT, VARIEDADES));
                    }
                }
            }
            res.status(200).json({
                sliders: Sliders,
                categories: Categories,
                best_products: ObjectBestProducts,
                ours_products: ObjectOursProducts,
                flashSale: FlashSale,
                campaign_products: ProductList,
            });


        } catch (error) {
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
            console.log(error);
        }
    },


    show_landing_product: async (req, res) => {
        try {
            let SLUG = req.params.slug;
            let DISCOUNT_ID = req.query._id;
            console.log(SLUG);

            let Product = await models.Product.findOne({ slug: SLUG, state: 2 });
            let VARIEDADES = await models.Variedad.find({ product: Product._id });
            let REVIEWS = await models.Review.find({ product: Product._id }).populate("user");
            let AVG_REVIEWS = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum, item) => sum + item.cantidad, 0) / REVIEWS.length) : 0;
            let COUNT_REVIEW = REVIEWS.length;
            let RelatedProducts = await models.Product.find({ categorie: Product.categorie, state: 2 });
            var ObjectRelatedProduct = [];
            for (const Product of RelatedProducts) {
                let VARIEDADES = await models.Variedad.find({ product: Product._id })
                ObjectRelatedProduct.push(resources.Product.product_list(Product, VARIEDADES));
            }
            let SALE_FLASH = null;
            if (DISCOUNT_ID) {
                SALE_FLASH = await models.Discount.findById({ _id: DISCOUNT_ID });
            }
            res.status(200).json({
                product: resources.Product.product_list(Product, VARIEDADES),
                related_products: ObjectRelatedProduct,
                SALE_FLASH: SALE_FLASH,
                REVIEWS: REVIEWS,
                AVG_REVIEWS: AVG_REVIEWS,
                COUNT_REVIEW: COUNT_REVIEW,
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
            console.log(error);
        }
    },

    profile_client: async (req, res) => {
        try {
            let user_id = req.body.user_id;
            let Orders = await models.Sale.find({ user: user_id });
            let sale_orders = [];
            for (const order of Orders) {
                let detail_orders = await models.SaleDetail.find({ sale: order._id }).populate({
                    path: "product",
                    populate: {
                        path: "categorie"
                    },
                }).populate("variedad");
                let sale_address = await models.SaleAddress.find({ sale: order._id });
                let collection_detail_orders = [];
                for (const detail_order of detail_orders) {
                    let reviewS = await models.Review.findOne({ sale_detail: detail_order._id });
                    collection_detail_orders.push({
                        _id: detail_order._id,
                        product: {
                            _id: detail_order.product._id,
                            title: detail_order.product.title,
                            slug: detail_order.product.slug,
                            sku: detail_order.product.sku,
                            imagen: 'http://localhost:3000/' + 'api/products/uploads/product/' + detail_order.product.portada,
                            categorie: detail_order.product.categorie,
                            price_soles: detail_order.product.price_soles,
                            price_usd: detail_order.product.price_usd,
                        },
                        type_discount: detail_order.type_discount,
                        discount: detail_order.discount,
                        cantidad: detail_order.cantidad,
                        variedad: detail_order.variedad,
                        code_cupon: detail_order.code_cupon,
                        code_discount: detail_order.code_discount,
                        price_unitario: detail_order.price_unitario,
                        subtotal: detail_order.subtotal,
                        total: detail_order.total,
                        review: reviewS,
                    });
                }
                sale_orders.push({
                    sale: order,
                    sale_detail: collection_detail_orders,
                    sale_address: sale_address
                });
            }
            let ADDRES_CLIENT = await models.AddressClient.find({
                user: user_id
            }).sort({ 'createdAt': -1 });
            res.status(200).json({
                sale_orders: sale_orders,
                address_client: ADDRES_CLIENT,
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
            console.log(error);
        }
    },

    update_client: async (req, res) => {
        try {
            if (req.files) {
                var img_path = req.file.avatar.path;
                var name = img_path.split('\\');
                var avatar_name = name[2];
                console.log(avatar_name);
            }

            if (req.body.password) {
                req.body.password = await bycrypt.hash(req.body.password, 10);
            }

            await models.User.findByIdAndUpdate({ _id: req.body._id }, req.body);
            let User = await models.User.findOne({ _id: req.body._id });
            res.status(200).json(
                {
                    message: "SE GUARDO SU INFORMACIÓN CORRECTAMENTE ",
                    user: {
                        name: User.name,
                        surname: User.surname,
                        email: User.email,
                        _id: User._id,
                    }
                })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
        }
    },


    search_product: async (req, res) => {
        try {
            var TIME_NOW = req.query.TIME_NOW;
            let search_product = req.body.search_product;
            let OursProducts = await models.Product.find({ state: 2, "title": new RegExp(search_product, 'i') }).sort({ "createdAt": 1 });
            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: { $lte: TIME_NOW },
                end_date_num: { $gte: TIME_NOW }
            });
            var Products = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({ product: Product._id })
                let REVIEWS = await models.Review.find({ product: Product._id });
                let AVG_REVIEWS = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum, item) => sum + item.cantidad, 0) / REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXIST = null;
                if (CampaingDiscount) {
                    if (CampaingDiscount.type_segment == 1) { // por producto
                        let product_a = [];
                        CampaingDiscount.products.forEach(element => {
                            product_a.push(element._id);
                        });
                        if (product_a.includes(Product._id + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    } else { // por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(element => {
                            categories_a.push(element._id);
                        });
                        if (categories_a.includes(Product.categorie + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    }
                }
                Products.push(resources.Product.product_list(Product, VARIEDADES, AVG_REVIEWS, COUNT_REVIEW, DISCOUNT_EXIST));
            }

            res.status(200).json({
                products: Products,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
        }
    },

    config_initial: async (req, res) => {
        try {

            let categories = await models.Categorie.find({ state: 1 });
            let variedades = await models.Variedad.find({});


            res.status(200).json({
                categories: categories,
                variedades: variedades,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "OCURRIO ERROR"
            });

        }
    },

    filter_products: async (req, res) => {
        try {
            var TIME_NOW = req.query.TIME_NOW;
            let search_product = req.body.search_product;

            let categories_selecteds = req.body.categories_selecteds;
            let is_discount = req.body.is_discount;
            let variedad_selected = req.body.variedad_selected;
            let price_min = req.body.price_min;
            let price_max = req.body.price_max;

            let filter = [
                { state: 2 },
            ];
            var categories_s = [];
            var products_s = [];

            // { state: 2, "title": new RegExp(search_product, 'i') }
            if (categories_selecteds.length > 0) {
                categories_selecteds.forEach((categorie) => {
                    categories_s.push(categorie);
                });
            };
            let CampaingDiscount = await models.Discount.findOne({
                type_campaign: 1,
                start_date_num: { $lte: TIME_NOW },
                end_date_num: { $gte: TIME_NOW }
            });

            if (is_discount == 2) {
                if (CampaingDiscount.type_segment == 1) {
                    CampaingDiscount.products.forEach(element => {
                        products_s.push(element._id);
                    });
                } else {
                    CampaingDiscount.categories.forEach(element => {
                        categories_s.push(element._id);
                    });
                }
            };

            if (variedad_selected) {
                let VAR = await models.Variedad.findById({ _id: variedad_selected._id });
                if (VAR) {
                    products_s.push(VAR.product);
                }
            }
            if (categories_s.length > 0) {
                filter.push({
                    categorie:{$in: categories_s},
                });
            }
            if (products_s.length > 0) {
                filter.push({
                    _id :{$in:products_s}
                });
            }
            if (price_min > 0 && price_max > 0) {
                filter.push({
                    price_usd: { $gte: price_min, $lte: price_max },
                });
            }
            let OursProducts = await models.Product.find({ $and: filter }).sort({ "createdAt": 1 });

            var Products = [];
            for (const Product of OursProducts) {
                let VARIEDADES = await models.Variedad.find({ product: Product._id });
                let REVIEWS = await models.Review.find({ product: Product._id });
                let AVG_REVIEWS = REVIEWS.length > 0 ? Math.ceil(REVIEWS.reduce((sum, item) => sum + item.cantidad, 0) / REVIEWS.length) : 0;
                let COUNT_REVIEW = REVIEWS.length;
                let DISCOUNT_EXIST = null;
                if (CampaingDiscount) {
                    if (CampaingDiscount.type_segment == 1) { // por producto
                        let product_a = [];
                        CampaingDiscount.products.forEach(element => {
                            product_a.push(element._id);
                        });
                        if (product_a.includes(Product._id + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    } else { // por categoria
                        let categories_a = [];
                        CampaingDiscount.categories.forEach(element => {
                            categories_a.push(element._id);
                        });
                        if (categories_a.includes(Product.categorie + "")) {
                            DISCOUNT_EXIST = CampaingDiscount;
                        }
                    }
                }
                Products.push(resources.Product.product_list(Product, VARIEDADES, AVG_REVIEWS, COUNT_REVIEW, DISCOUNT_EXIST));
            }

            res.status(200).json({
                products: Products,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "OCURRIO ERROR"
            });
        }
    },



}
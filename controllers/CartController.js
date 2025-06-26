import { model } from "mongoose";
import models from "../models";
import resource from './resources'
export default {
    list: async (req, res) => {
        try {
            let user_id = req.query.user_id;
            let CARTS = await models.Cart.find({
                user: user_id,
            }).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                },
            });

            CARTS = CARTS.map((cart) => {
                return resource.Cart.cart_list(cart)
            });

            res.status(200).json({
                carts: CARTS
            });

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN ERROR",
            });
            console.log(error);
        }
    },
    register: async (req, res) => {
        try {
            let data = req.body;
            //1. VALIDAR EL PRODUCTO EXISTE EN EL CARRITO DE COMPRAS
            if (data.variedad) {
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    variedad: data.variedad,
                    product: data.product,
                });
                if (valid_cart) {
                    res.status(200).json({
                        message: 403,
                        message_text: "EL PRODUCTO CON LA VARIEDAD YA EXISTE EN EL CARRITO DE COMPRAS"
                    })
                    return;
                }
            } else {
                let valid_cart = await models.Cart.findOne({
                    user: data.user,
                    product: data.product,
                });
                if (valid_cart) {
                    res.status(200).json({
                        message: 403,
                        message_text: "EL PRODUCTO YA EXISTE EN EL CARRITO DE COMPRAS"
                    })
                    return;
                }
            }

            //2. VALIDAR SI EL STOCK ESTA DISPONIBLE
            if (data.variedad) {
                let valid_variedad = await models.Variedad.findOne({
                    _id: data.variedad,
                });
                if (valid_variedad.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "EL STOCK NO ESTA DISPONIBLE"
                    });
                    return;
                }
            } else {
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if (valid_product.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "EL STOCK NO ESTA DISPONIBLE"
                    });
                    return;
                }
            }

            let CART = await models.Cart.create(data);
            let NEW_CART = await models.Cart.findById({ _id: CART._id }).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                },
            });
            res.status(200).json({
                cart: resource.Cart.cart_list(NEW_CART),
                message_text: "EL CARRITO SE REGISTRO CON ÉXITO",
            })

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN ERROR",
            });
            console.log(error);
        }
    },
    update: async (req, res) => {
        try {
            let data = req.body;

            //2. VALIDAR SI EL STOCK ESTA DISPONIBLE
            if (data.variedad) {
                let valid_variedad = await models.Variedad.findOne({
                    _id: data.variedad,
                });
                if (valid_variedad.stock < data.cantidad) {
                    res.status(200).json({
                        message: 403,
                        message_text: "EL STOCK NO ESTA DISPONIBLE"
                    });
                    return;
                }
            } else {
                let valid_product = await models.Product.findOne({
                    _id: data.product,
                });
                if (valid_product.stock < data.cantidad) {
                    res.status(200).send({
                        message: 403,
                        message_text: "EL STOCK NO ESTA DISPONIBLE"
                    });
                    return;
                }
            }

            let CART = await models.Cart.findByIdAndUpdate({ _id: data._id }, data);
            let NEW_CART = await models.Cart.findById({ _id: CART._id }).populate("variedad").populate({
                path: "product",
                populate: {
                    path: "categorie"
                },
            });
            res.status(200).json({
                cart: resource.Cart.cart_list(NEW_CART),
                message_text: "EL CARRITO SE ACTUALIZO CON ÉXITO",
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN ERROR",
            });
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            let _id = req.params.id;
            await models.Cart.findByIdAndDelete({ _id: _id });
            res.status(200).json({
                message_text: "EL CARRITO SE ELIMINO CON ÉXITO ",
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN ERROR",
            });
            console.log(error);
        }
    },

    appyCupon: async (req, res) => {
        try {
            let data = req.body;
            //LA PRIMERA VALIDACION TIENE QUE VER CON LA EXISTENCIA DEL CUPON
            let CUPON = await models.Cupone.findOne({
                code: data.code,
            })
            if (!CUPON) {
                res.status(200).json({
                    message: 403,
                    message_text: "EL CUPON INGRESADO NO EXISTE, DIGITE OTRO NUEVAMENTE"
                })
                return;
            }
            //TINENE CON EL USO DEL CUPON --ESPERA 

            //LA PARTE OPERATIVA
            let carts = await models.Cart.find({ user: data.user_id }).populate("product");
            let products = [];
            let categories = [];
            CUPON.products.forEach((product) => {
                products.push(product._id);
            });
            CUPON.products.forEach((categorie) => {
                categories.push(categorie._id);
            });
            for (const cart of carts) {
                if (products.length > 0) {
                    if (products.includes(cart.product._id+"")) {
                        let subtotal = 0;
                        let total = 0;
                        if (CUPON.type_discount == 1) { // descuento
                            subtotal = cart.price_unitario - cart.price_unitario * (CUPON.discount * 0.01);
                        } else {//moneda
                            subtotal = cart.price_unitario - CUPON.discount;
                        }
                        total = subtotal * cart.cantidad;
                        await models.Cart.findByIdAndUpdate({ _id: cart._id }, {
                            subtotal: subtotal,
                            total: total,
                            type_discount: CUPON.type_discount,
                            discount: CUPON.discount,
                            code_cupon: CUPON.code,
                        })
                    }
                }
                if (categories.length > 0) {
                    if (categories.includes(cart.product.categorie+"")) {
                        let subtotal = 0;
                        let total = 0;
                        if (CUPON.type_discount == 1) { // descuento
                            subtotal = cart.price_unitario - cart.price_unitario * (CUPON.discount * 0.01);
                        } else {//moneda
                            subtotal = cart.price_unitario - CUPON.discount;
                        }
                        total = subtotal * cart.cantidad;
                        await models.Cart.findByIdAndUpdate({ _id: cart._id }, {
                            subtotal: subtotal,
                            total: total,
                            type_discount: CUPON.type_discount,
                            discount: CUPON.discount,
                            code_cupon: CUPON.code,
                        });
                    }
                }
            }
            res.status(200).json({
                message:200,
                message_text:"EL CUPON APLICADO CORRECTAMENTE"
            });
            
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN ERROR",
            });
            console.log(error);
        }
    },
}
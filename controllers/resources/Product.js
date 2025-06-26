export default {
    product_list: (product, variedades = []) => {

        var IMAGEN_TWO = "";
        let GALERIAS = [];

        if (product.galerias && product.galerias.length > 0) {//NUEVO POR AGREGAR
            GALERIAS = product.galerias.map((galeria) => {
                galeria.imagen = 'http://localhost:3000' + '/api/products/uploads/product/' + galeria.imagen;//*
                return galeria;
            });
            var VAL = Math.floor(Math.random() * product.galerias.length);//0,1,2
            IMAGEN_TWO = GALERIAS[VAL].imagen;
        }

        return {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            sku: product.sku,
            imagen: 'http://localhost:3000/' + 'api/products/uploads/product/' + product.portada,
            categorie: product.categorie,
            price_soles: product.price_soles,
            price_usd: product.price_usd,
            stock: product.stock,
            descripcion: product.descripcion,
            resumen: product.resumen,
            tags: product.tags ? JSON.parse(product.tags) : [],
            type_inventario: product.type_inventario,
            state: product.state,
            variedades: variedades,
            imagen_two: IMAGEN_TWO,
            galerias: GALERIAS,
        }
    }
}
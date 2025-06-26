import  routerx from 'express-promise-router'
import productController from '../controllers/ProductController'
import auth from '../middlewares/auth'
import multiparty from 'connect-multiparty';
import VariedadController from '../controllers/VariedadController';

var path = multiparty({uploadDir:'./uploads/product'})
const router = routerx();

//http://localhost:3000/api/user/

router.post("/register", [auth.verifyAdmin, path ], productController.register);

router.post("/register_imagen", [auth.verifyAdmin, path ], productController.register_imagen);
router.post("/remove_imagen", [auth.verifyAdmin, path ], productController.remove_imagen);


router.put("/update", [auth.verifyAdmin, path ], productController.update);
router.get("/list",auth.verifyAdmin,productController.list);
router.delete("/delete", auth.verifyAdmin, productController.remove)

router.get("/uploads/product/:img",productController.obtener_imagen);

router.get("/show/:id",auth.verifyAdmin,productController.show);

//VARIEDAD
router.post("/register-variedad", [auth.verifyAdmin, path ], VariedadController.register);
router.put("/update-variedad", [auth.verifyAdmin, path ], VariedadController.update);
router.delete("/delete-variedad/:id", [auth.verifyAdmin, path ], VariedadController.delete);




export default router;

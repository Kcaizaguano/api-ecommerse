import  routerx from 'express-promise-router'
import addressClientController from '../controllers/AddressClientController'
import auth from '../middlewares/auth'

const router = routerx();

//http://localhost:3000/api/user/

router.post("/register",auth.verifyEcommerce, addressClientController.register);
router.put("/update", auth.verifyEcommerce, addressClientController.update);
router.get("/list",auth.verifyEcommerce,addressClientController.list);
router.delete("/delete/:id", auth.verifyEcommerce, addressClientController.delete)

export default router;

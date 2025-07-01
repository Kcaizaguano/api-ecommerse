import routerx from "express-promise-router"
import reviewClientController from "../controllers/ReviewClientController"
import auth from "../middlewares/auth"


const router = routerx();

router.post("/register", auth.verifyEcommerce, reviewClientController.register); 
router.put("/update", auth.verifyEcommerce, reviewClientController.update); 

export default router;

import routerx from "express-promise-router"
import homeController from "../controllers/HomeController"


const router = routerx();

router.get("/list", homeController.list); 
router.get("/landing-product/:slug", homeController.show_landing_product); 



export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import storeRouter from "./store";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/orders", ordersRouter);
router.use("/store", storeRouter);

export default router;

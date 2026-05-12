import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
import storageRouter from "./storage";
import galleryRouter from "./gallery";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(galleryRouter);

export default router;

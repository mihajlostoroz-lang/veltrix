import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
import storageRouter from "./storage";
import galleryRouter from "./gallery";
import galleryPairsRouter from "./galleryPairs";
import reviewsRouter from "./reviews";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(bookingsRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(galleryRouter);
router.use(galleryPairsRouter);
router.use(reviewsRouter);

export default router;

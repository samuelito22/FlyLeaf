import express from "express";
import overviewController from "../controller/overview.controller";

const router = express.Router();

router.get("/en", overviewController.getOverviewEn)


export default router;
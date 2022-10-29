import { Router } from "express";
import { createJobTrans } from "../controllers/jobtrans-controller";

const router: Router = Router()

router.post('/', createJobTrans)

export default router
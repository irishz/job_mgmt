import { Router } from "express";
import { createJob, deleteJobById, getAllJob, getJobByDateRange, getJobByUserId, getJobResponseBy, getJobWaitApprove, getOneJobById, updateJobById } from "../controllers/job-controller";
import uploadFileMiddleware from "../middlewares/uploadFileMiddleware";

const router: Router = Router()

router.post('/', uploadFileMiddleware.array('attachments', 10), createJob)
router.get('/', getAllJob)
router.get('/date-range', getJobByDateRange)
router.get('/wait-approve', getJobWaitApprove)
router.get('/user/:id', getJobByUserId)
router.get('/:id', getOneJobById)
router.get('/response/:id', getJobResponseBy)
router.put('/:id', updateJobById)
router.delete('/:id', deleteJobById)

export default router
import { Router } from 'express';
import { createProgramType, getAllType } from '../controllers/program-controller';
const router: Router = Router()

router.post('/', createProgramType)
router.get('/', getAllType)
// router.get('/:id', getOneUser)
// router.put('/:id', updateUser)
// router.delete('/:id', deleteUser)

export default router
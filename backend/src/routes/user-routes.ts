import { Router } from 'express';
import { deleteUser, getAllUsers, getOneUser, loginUser, registerUser, updateUser } from '../controllers/user-controller'
const router: Router = Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/', getAllUsers)
router.get('/:id', getOneUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
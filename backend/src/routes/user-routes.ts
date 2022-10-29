import { Router } from 'express';
import { deleteUser, getAllUsers, getOneUser, getUserByEmpCode, loginUser, registerUser, resetUserPassword, updateUser } from '../controllers/user-controller'
const router: Router = Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/', getAllUsers)
router.get('/getuser-empcode/:emp_code', getUserByEmpCode)
router.get('/:id', getOneUser)
router.put('/resetpassword', resetUserPassword)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
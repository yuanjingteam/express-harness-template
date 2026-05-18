import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';

const router = Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.delete('/:id', userController.deleteUser);

export default router;

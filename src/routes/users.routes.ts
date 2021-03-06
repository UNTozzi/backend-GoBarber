import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middleware/ensureAuthenticated'
import uploadConfig from '../config/upload'
import { Router } from 'express'
import multer from 'multer'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body
    const userService = new CreateUserService()

    const user = await userService.execute({ name, email, password })

    delete user.password

    return response.json(user)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService()

      const user = await updateUserAvatar.execute({
        userId: request.user.id,
        avatarFilename: request.file.filename,
      })

      delete user.password

      return response.json(user)
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
  },
)

export default usersRouter

import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import AppError from '../errors/AppError'
import uploadConfig from '../config/upload'
import User from '../models/User'

interface Request {
  userId: string
  avatarFilename: string
}
class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExist) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }
    user.avatar = avatarFilename

    await userRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService

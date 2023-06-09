import { readdir } from 'fs/promises'
import path from 'path'
import { User } from './models/user'
import { genSalt, hash } from 'bcryptjs'
import { createUser } from './controllers/users'
export const fileMatcher = async (fileName: string, path: string) => {
  const files = await readdir(path)
  const [matchedFile] = files.filter((file) => file.includes(fileName))
  return matchedFile
}

export const checkFile = (file: Express.Multer.File) => {
  const fileTypes = /jpeg|jpg|png|gif|svg/

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())

  const mimeType = fileTypes.test(file.mimetype)
  switch (false) {
    case file.size < 1048576:
      throw {
        status: 400,
        message: 'file is too large',
      }
    case mimeType && extName:
      throw {
        status: 400,
        message: 'invalid file type',
      }
    default:
      return
  }
}

export const createDefaultAdmin = async () => {
  const [adminExists] = await User.find({ role: 'admin' })
  if (!adminExists) {
    const salt = await genSalt()
    const hashed = await hash('admin', salt)
    const user = await createUser(
      {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@admin.com',
        password: hashed,
        billingAddress: {
          city: 'admin town',
          street: 'admin way',
        },
        role: 'admin',
      },
      true
    )
    return user
  }
  return
}

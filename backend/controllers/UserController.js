import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export const register = async (req,res) => {
    try {
        const {nama, username, password, retypePassword} = req.body;
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(existingUser){
            return res.status(409).json({msg: 'Username sudah digunakan'})
        }

        if(password !== retypePassword){
            return res.status(400).json({msg: 'Password tidak sesuai'})
        }

        const salt = await bcrypt.genSaltSync(); 
        const hashPassword = await bcrypt.hashSync(password, salt); 

        const result = await prisma.user.create({
            data: {
                nama,
                username,
                password: hashPassword
            }
        })

        return res.status(201).json({msg: 'Registrasi berhasil', data: {nama: result.nama, username: result.username}})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat melakukan register'})
    }
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body

        const user = await prisma.user.findUnique({
            where:{
                username: username,
            }
        })

        const matchPassword =  await bcrypt.compareSync(password, user.password)

        if(!matchPassword){
            return res.status(400).json({msg: 'Username atau password salah'})
        }

        return res.status(200).json({msg: 'Login Berhasil', data: {nama: user.nama, username: user.username}})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat melakukan login'})
    }
}


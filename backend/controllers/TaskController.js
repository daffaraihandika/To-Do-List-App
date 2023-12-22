import { parseISO } from 'date-fns';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createTask = async (req,res) => {
    try {
        const { namaTask, deskripsi, dateLine, prioritas, userId, tags } = req.body;

        if (!namaTask || !dateLine || !prioritas || !userId || !tags || tags.length === 0) {
            return res.status(400).json({ msg: 'Semua field harus diisi' });
        }

        const newTask = await prisma.task.create({
            data: {
                namaTask,
                deskripsi,
                createDate: new Date(),
                dateLine: parseISO(dateLine),
                prioritas,
                isCompleted: false,
                user: {
                    connect: { id: userId }
                },
                tags: {
                    connectOrCreate: tags.map(tag => ({
                      where: { namaTag: tag.namaTag },
                      create: { namaTag: tag.namaTag, deskripsi: tag.deskripsi || '' }
                    }))
                }
            }
        })

        return res.status(201).json({msg: 'Task baru berhasil dibuat', data: {id: newTask.id, namaTask: newTask.namaTask, dateLine: newTask.dateLine, prioritas: newTask.prioritas, isCompleted: newTask.isCompleted, user: newTask.user}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat membuat task baru'})
    }
}

export const getAllTasks = async(req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const result = await prisma.task.findMany({
            where: {
                userId: userId
            },
            include: {
                tags: true,
            },
        })

        return res.status(200).json({msg: 'Berhasil menampilkan semua task', data: result})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat mengambil data tasks'})
    }
}

export const deleteTask = async (req,res) => {
    try {
        const taskId = parseInt(req.params.taskId, 10);

        const existingTask = await prisma.task.findUnique({
            where:{
                id: taskId
            }
        })

        if(!existingTask){
            return res.status(404).json({ msg: 'Task tidak ditemukan' });
        }

        await prisma.task.delete({
            where:{
                id: taskId
            }
        })

        return res.status(200).json({msg: 'Berhasil menghapus task'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat menghapus tasks'})
    }
}

export const updateTask = async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId, 10);
      const { namaTask, deskripsi, dateLine, prioritas, isCompleted, tags } = req.body;
  
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { tags: true },
      });
  
      if (!existingTask) {
        return res.status(404).json({ msg: 'Task tidak ditemukan' });
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          namaTask: namaTask || existingTask.namaTask,
          deskripsi: deskripsi || existingTask.deskripsi,
          dateLine: dateLine ? parseISO(dateLine) : existingTask.dateLine,
          prioritas: prioritas || existingTask.prioritas,
          isCompleted: isCompleted !== undefined ? isCompleted : existingTask.isCompleted,
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { namaTag: tag.namaTag },
              create: { namaTag: tag.namaTag, deskripsi: tag.deskripsi || '' }
            }))
          }
        },
        include: {
            tags: true,
        },
      });
  
      return res.status(200).json({ msg: 'Task berhasil diperbarui', data: updatedTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Terjadi kesalahan saat memperbarui task' });
    }
};
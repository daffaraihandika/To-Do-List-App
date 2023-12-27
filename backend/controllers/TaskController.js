import { parseISO, endOfDay, startOfDay } from 'date-fns';
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
              dateLine: endOfDay(parseISO(dateLine)),
              prioritas,
              isCompleted: false,
              user: {
                connect: { id: userId },
              },
              tags: {
                connectOrCreate: tags.map(tag => ({
                  where: { namaTag: tag.namaTag },
                  create: { namaTag: tag.namaTag, deskripsi: tag.deskripsi || '', userId:userId },
                })),
              },
            },
        });          

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
            orderBy:{
                dateLine: 'asc'
            }
        })

        return res.status(200).json({msg: 'Berhasil menampilkan semua task', data: result})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat mengambil data tasks'})
    }
}

export const getDetailTask = async(req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const taskId = parseInt(req.params.taskId, 10);

        const detailTask = await prisma.task.findUnique({
            where:{
                id: taskId,
                userId: userId
            },

            include:{
                tags: true
            }
        })

        if(!detailTask){
            return res.status(404).json({ msg: 'Task tidak ditemukan' });
        }

        return res.status(200).json({ msg: 'Berhasil mendapatkan detail task', data: detailTask });

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat mengambil data detail task'})
    }
}

export const deleteTask = async (req,res) => {
    try {
        const taskId = parseInt(req.params.taskId, 10);
        const userId = parseInt(req.params.userId, 10);

        const existingTask = await prisma.task.findUnique({
            where:{
                id: taskId,
                userId: userId
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
      const userId = parseInt(req.params.userId, 10);
      const { namaTask, deskripsi, dateLine, prioritas, isCompleted, tags } = req.body;
  
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        include: { tags: true },
      });
  
      if (!existingTask) {
        return res.status(404).json({ msg: 'Task tidak ditemukan' });
      }
  
      let updatedTags = existingTask.tags;
  
      if (tags) {
        // If tags are provided, map over them
        updatedTags = tags.map(tag => ({
          where: { namaTag: tag.namaTag },
          create: { namaTag: tag.namaTag, deskripsi: tag.deskripsi || '', userId: userId }
        }));
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          namaTask: namaTask || existingTask.namaTask,
          deskripsi: deskripsi || existingTask.deskripsi,
          dateLine: dateLine ? endOfDay(parseISO(dateLine)) : existingTask.dateLine,
          prioritas: prioritas || existingTask.prioritas,
          isCompleted: isCompleted !== undefined ? isCompleted : existingTask.isCompleted,
          tags: {
            ...(tags && { connectOrCreate: updatedTags }),
          },
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
  
export const getTasksByDateRange = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = parseInt(req.params.userId, 10);
  
      if (!startDate || !endDate) {
        return res.status(400).json({ msg: 'Tanggal harus diisi' });
      }

      const startDateFormatted = startOfDay(new Date(startDate))
      const endDateFormatted = endOfDay(new Date(endDate))

      if(startDateFormatted > endDateFormatted){
        return res.status(400).json({ msg: 'Start Date harus lebih kecil daripada End Date' });
      }
  
      const tasks = await prisma.task.findMany({
        where: {
          dateLine: {
            gte: startDateFormatted,
            lte: endDateFormatted,
          },
          userId: userId
        },

        include: {
            tags: true
        },

        orderBy: {
            dateLine: 'asc'
        }
      });
  
      return res.status(200).json({ msg: 'Berhasil filter task sesuai interval tanggal', data: tasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Terjadi kesalahan saat memfilter task berdasarkan interval tanggal' });
    }
};

export const filterTaskByPriority = async(req,res) => {
    try {
        const {prioritas} = req.query;
        const userId = parseInt(req.params.userId, 10);

        if (!prioritas) {
            return res.status(400).json({ msg: 'Prioritas harus diisi' });
        }

        const filterTask = await prisma.task.findMany({
            where:{
                userId: userId,
                prioritas: prioritas
            },

            orderBy:{
                dateLine: 'asc'
            },

            include:{
                tags: true
            }
        })

        if (!filterTask || filterTask.length === 0) {
            return res.status(404).json({ msg: 'Tidak ada task dengan prioritas tersebut' });
        }

        if(!filterTask){
            return res.status(400).json({ msg: 'User tidak ditemukan' });
        }

        return res.status(200).json({ msg: 'Berhasil filter task sesuai prioritas', data: filterTask });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Terjadi kesalahan saat memfilter task berdasarkan prioritas' });
    }
}

export const getCompleteTask = async(req,res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        const completeTask = await prisma.task.findMany({
            where:{
                userId: userId,
                isCompleted: true
            },
            include:{
                tags: true
            },
            orderBy:{
                dateLine: 'asc'
            }
        })

        return res.status(200).json({ msg: 'Berhasil mendapatkan completed task', data: completeTask });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Terjadi kesalahan saat mendapatkan data completed task' });
    }
}

export const getIncompleteTask = async(req,res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        const completeTask = await prisma.task.findMany({
            where:{
                userId: userId,
                isCompleted: false
            },
            include:{
                tags: true
            },
            orderBy:{
                dateLine: 'asc'
            }
        })

        return res.status(200).json({ msg: 'Berhasil mendapatkan complete task', data: completeTask });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Terjadi kesalahan saat mendapatkan data completed task' });
    }
}
  
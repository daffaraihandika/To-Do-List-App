import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTag = async (req, res) => {
    try {
        const { namaTag, deskripsi, userId } = req.body;

        if (!namaTag) {
            return res.status(400).json({ msg: 'Nama tag harus diisi' });
        }

        const newTag = await prisma.tag.upsert({
            where: { namaTag },
            update: { deskripsi: deskripsi || '' },
            create: { namaTag, deskripsi: deskripsi || '', userId },
        });

        return res.status(201).json({ msg: 'Tag baru berhasil dibuat', data: newTag });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Terjadi kesalahan saat membuat tag baru' });
    }
};

export const getAllTags = async(req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const allTags = await prisma.tag.findMany({
            where:{
                userId: userId
            },
            orderBy:{
                namaTag: 'asc'
            },
            include:{
                tasks: true
            }
        })

        return res.status(200).json({msg: 'Berhasil menampilkan semua tag', data: allTags})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Terjadi kesalahan saat mengambil data tag'})
    }
}

export const getDetailTags = async(req,res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const tagsId = parseInt(req.params.tagsId, 10);

        const detailTags = await prisma.tag.findUnique({
            where: {
                id: tagsId,
                userId: userId
            },
            include:{
                tasks: true
            }
        })

        if(!detailTags){
            return res.status(404).json({ msg: 'Tag tidak ditemukan' });
        }

        return res.status(200).json({ msg: 'Berhasil mendapatkan detail tag', data: detailTags });

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'Terjadi kesalahan saat mengambil data detail tag'})
    }
}

export const updateTags = async(req,res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const tagsId = parseInt(req.params.tagsId, 10);

        const { namaTag, deskripsi } = req.body;

        const existingTag = await prisma.tag.findUnique({
            where:{
                id: tagsId,
                userId: userId
            }
        })

        if(!existingTag){
            return res.status(404).json({ msg: 'Tag tidak ditemukan' });
        }

        const tagWithSameName = await prisma.tag.findFirst({
            where: {
                userId: userId,
                namaTag: namaTag,
                id: { not: tagsId }
            }
        });

        if (tagWithSameName) {
            return res.status(404).json({ msg: 'Tag tersebut sudah ada' });
        }

        const result = await prisma.tag.update({
            where:{
                userId: userId,
                id: tagsId
            },
            data:{
                namaTag: namaTag || existingTag.namaTag,
                deskripsi: deskripsi || existingTag.deskripsi,
                userId: userId
            }
        })

        return res.status(200).json({ msg: 'Tag berhasil diperbarui', data: result });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Terjadi kesalahan saat memperbarui tag' });
    }
}

export const deleteTags = async(req,res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const tagsId = parseInt(req.params.tagsId, 10);

        const existingTag = await prisma.tag.findUnique({
            where:{
                id: tagsId,
                userId: userId
            }
        })

        if(!existingTag){
            return res.status(404).json({ msg: 'Tag tidak ditemukan' });
        }
        
        await prisma.tag.delete({
            where:{
                id: tagsId,
                userId: userId
            }
        })

        return res.status(200).json({msg: 'Berhasil menghapus tag'})

    } catch (error) {
        console.log(error)
    }
}
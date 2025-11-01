import prisma from "../lib/prisma";

interface TaskInput {
   title: string;
   completed?: boolean;
   categoryKindId: string;
   categoryTypeId: string;
   categoryCollectId: string;
}

export const TaskService = {
   async create(data: TaskInput, userId: string) {
      const { categoryKindId, categoryTypeId, categoryCollectId, ...rest } = data;

      return prisma.task.create({
         data: {
            ...rest,
            userId: userId,
            categoryKindId,
            categoryTypeId,
            categoryCollectId,
         },
      });
   },

   async findAll(userId: string) {
      return prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
         include: {
            categoryKind: true,
            categoryType: true,
            categoryCollect: true,
         },
      });
   },

   async findOne(taskId: string, userId: string) {
      const task = await prisma.task.findUnique({
         where: { id: taskId, userId },
      });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      return task;
   },

   async update(taskId: string, userId: string, data: Partial<TaskInput>) {
      const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      return prisma.task.update({
         where: { id: taskId },
         data,
      });
   },

   async delete(taskId: string, userId: string) {
      const task = await prisma.task.findUnique({ where: { id: taskId, userId } });

      if (!task) {
         throw new Error("Tugas tidak ditemukan atau bukan milik Anda.");
      }

      await prisma.task.delete({ where: { id: taskId } });
      return { message: "Tugas berhasil dihapus" };
   },
};

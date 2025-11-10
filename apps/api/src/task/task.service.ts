import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
   constructor(private readonly prisma: PrismaService) {}

   async create(dto: CreateTaskDto, userId: string) {
      const { categoryIds, ...rest } = dto;

      return this.prisma.task.create({
         data: {
            ...rest,
            userId: userId,
            categories: {
               connect: categoryIds.map(id => ({ id: id })),
            },
         },
      });
   }

   async findAll(userId: string) {
      return this.prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: 'desc' },
         include: {
            categories: {
               select: { id: true, title: true, typeId: true },
            },
         },
      });
   }

   async findOne(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({
         where: { id: taskId, userId },
         include: {
            categories: {
               select: { id: true, title: true, typeId: true },
            },
         },
      });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      return task;
   }

   async update(taskId: string, userId: string, dto: UpdateTaskDto) {
      const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      const { categoryIds, ...rest } = dto;
      const updateData: Prisma.TaskUpdateInput = rest;

      if (categoryIds) {
         updateData.categories = {
            set: categoryIds.map(id => ({ id: id })),
         };
      }

      return this.prisma.task.update({
         where: { id: taskId },
         data: updateData,
      });
   }

   async remove(taskId: string, userId: string) {
      const task = await this.prisma.task.findFirst({ where: { id: taskId, userId } });

      if (!task) {
         throw new NotFoundException('Tugas tidak ditemukan.');
      }

      await this.prisma.task.delete({ where: { id: taskId } });
      return { message: 'Tugas berhasil dihapus' };
   }
}

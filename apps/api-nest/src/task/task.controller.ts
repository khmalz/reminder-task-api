import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class TaskController {
   constructor(private readonly taskService: TaskService) {}

   @Post()
   create(@Body() createTaskDto: CreateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.create(createTaskDto, userId);
   }

   @Get()
   findAll(@GetUser('sub') userId: string) {
      return this.taskService.findAll(userId);
   }

   @Get(':id')
   findOne(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.findOne(id, userId);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.update(id, userId, updateTaskDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.remove(id, userId);
   }
}

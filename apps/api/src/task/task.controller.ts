import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateTaskSwagger, FindAllTasksSwagger, FindOneTaskSwagger, UpdateTaskSwagger, DeleteTaskSwagger } from './swagger/task.swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UsePipes(
   new ValidationPipe({
      whitelist: true,
      transform: true,
   }),
)
export class TaskController {
   constructor(private readonly taskService: TaskService) {}

   @Post()
   @CreateTaskSwagger()
   create(@Body() createTaskDto: CreateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.create(createTaskDto, userId);
   }

   @Get()
   @FindAllTasksSwagger()
   findAll(@GetUser('sub') userId: string) {
      return this.taskService.findAll(userId);
   }

   @Get(':id')
   @FindOneTaskSwagger()
   findOne(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.findOne(id, userId);
   }

   @Patch(':id')
   @UpdateTaskSwagger()
   update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser('sub') userId: string) {
      return this.taskService.update(id, userId, updateTaskDto);
   }

   @Delete(':id')
   @DeleteTaskSwagger()
   remove(@Param('id') id: string, @GetUser('sub') userId: string) {
      return this.taskService.remove(id, userId);
   }
}

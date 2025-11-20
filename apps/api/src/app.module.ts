import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
      }),
      PrismaModule,
      AuthModule,
      CategoryModule,
   ],
   controllers: [AppController],
   providers: [AppService, PrismaService],
})
export class AppModule {}

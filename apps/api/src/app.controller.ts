import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('1. Health')
@Controller()
export class AppController {
   constructor(private readonly appService: AppService) {}

   @Get()
   @ApiOperation({ summary: 'API health check', description: 'Returns API status and timestamp' })
   @ApiResponse({
      status: 200,
      description: 'API is healthy',
      schema: {
         example: {
            status: 'ok',
            message: 'API is healthy',
            timestamp: '2024-06-14T12:34:56.789Z',
         },
      },
   })
   getHealth() {
      return this.appService.getHealth();
   }
}

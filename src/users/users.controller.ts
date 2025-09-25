import { Controller, Post, Body, Get, Query, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import type { Request } from 'express';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    async signUp(@Body() data: any, @Req() req: Request) {
        const ret = await this.usersService.create(data);
        req.session.userId = ret?.id;
        return ret;
    }

    @Post('createUser')
    createUser(@Body() data: any) {
        return this.usersService.create(data);
    }

    @Get()
    async getUsers(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('field') field?: string,
    @Query('search') search?: string,
    ) {
        if (!req.session.userId) {
            return {
            success: false,
            message: 'User not authenticated.',
            users: [],
            };
        }

        const users = await this.usersService.getUsers(+page, +limit, field, search);

        return {
            success: true,
            ...users,
        };
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.usersService.delete(id);
    }
    
    @Patch(':id')
    async updateUser(
    @Param('id') id: number,
    @Body() data: Partial<User>,
    ) {
        return this.usersService.update(id, data);
    }
}

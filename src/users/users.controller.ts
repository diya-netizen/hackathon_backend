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
    async getUsers(@Query() query, @Req() req: Request,) {
        if(!req.session.userId){
            return { message: 'User not authenticated.', success: false};
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;

        const users = await this.usersService.getUsers(page, limit);

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

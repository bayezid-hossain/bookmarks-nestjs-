import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../../src/auth/decorator';
import { CreateBookmarkDto } from './dto';
import { dot } from 'node:test/reporters';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }
    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }
    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId)
    }

    @Patch(':id')
    editBookmarkById(@Param('id', ParseIntPipe) bookmarkId: number, @GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.editBookmarkById(userId, dto, bookmarkId)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number,) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
    }
}

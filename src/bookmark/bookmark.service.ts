import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId, ...dto
            }
        })
        return bookmark
    }

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId
            }
        })
    }
    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookmarkId
            }
        })
    }

    async editBookmarkById(userId: number, dto: EditBookmarkDto, bookmarkId: number) {
        //get the bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException("Access to the bookmark denied")
        }
        //check if user owns the bookmark, if so then edit
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            }, data: {
                ...dto
            }
        })
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        //get the bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException("Access to the bookmark denied")
        }
        //check if user owns the bookmark, if so then delete
        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        })
    }
}

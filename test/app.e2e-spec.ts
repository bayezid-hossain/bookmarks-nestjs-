import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import passport from 'passport';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],

    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    await app.init()
    await app.listen(3000)
    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl("http://localhost:3000")
  });
  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'me.bayezid@gmail.com',
      password: '123'
    }
    describe('Signup', () => {
      const url: string = "/auth/signup"
      it('should throw if email is empty', () => {
        return pactum.spec().post(url,).withBody({
          password: dto.password
        }).expectStatus(400)

      })
      it('should throw if password is empty', () => {
        return pactum.spec().post(url,).withBody({
          email: dto.email
        }).expectStatus(400)

      })
      it('should throw if no body is provided', () => {
        return pactum.spec().post(url,).expectStatus(400)

      })
      it("Should signup", () => {

        return pactum.spec().post(url,).withBody(dto).expectStatus(201)
      })
    })
    describe('Signin', () => {
      const url: string = "/auth/signin"
      it('should throw if email is empty', () => {
        return pactum.spec().post(url,).withBody({
          password: dto.password
        }).expectStatus(400)

      })
      it('should throw if password is empty', () => {
        return pactum.spec().post(url,).withBody({
          email: dto.email
        }).expectStatus(400)

      })
      it('should throw if no body is provided', () => {
        return pactum.spec().post(url,).expectStatus(400)

      })
      it("Should signin", () => {

        return pactum.spec().post(url,).withBody(dto).expectStatus(200).stores("userAt", "access_token")
      })
    })

  })
  describe('User', () => {
    describe('Getme', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').withBearerToken(`$S{userAt}`).expectStatus(200)
      })
    })
    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: "Bayezid",
        email: "me.bayezid@gmail.com"
      }
      it('should edit current user', () => {
        return pactum.spec().patch('/users').withBody(dto).withBearerToken(`$S{userAt}`).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum.spec().get('/bookmarks').withBearerToken(`$S{userAt}`).expectStatus(200).expectBody([])
      })
    })
    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: "First bookmark",
        link: "http://m.youtube.com/wr3224e4", description: "Nothing to describe"
      }
      it('should create bookmark', () => {
        return pactum.spec().post('/bookmarks').withBody(dto).withBearerToken(`$S{userAt}`).expectStatus(201).stores('bookmarkId', 'id')

      })
    })
    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum.spec().get('/bookmarks').withBearerToken(`$S{userAt}`).expectStatus(200).expectJsonLength(1)
      })
    })
    describe('Get Bookmark by ID', () => {
      it('should get bookmark by id', () => {
        return pactum.spec().get('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withBearerToken(`$S{userAt}`).expectStatus(200).expectBodyContains('$S{bookmarkId}')
      })
    })
    describe('Edit Bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: "Edited First bookmark",
        link: "http://m.youtube.com/edited", description: "Nothing to describe(Edited)"
      }
      it('should edit and update bookmark', () => {
        return pactum.spec().patch('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withBody(dto).withBearerToken(`$S{userAt}`).expectStatus(200).expectBodyContains(dto.description).expectBodyContains(dto.title)

      })
    })
    describe('Delete Bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum.spec().delete('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withBearerToken(`$S{userAt}`).expectStatus(204)

      })

      it('should get empty bookmarks', () => {
        return pactum.spec().get('/bookmarks').withBearerToken(`$S{userAt}`).expectStatus(200).expectBody([])

      })
    })
  })

})
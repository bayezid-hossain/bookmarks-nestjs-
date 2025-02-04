import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import passport from 'passport';
import { EditUserDto } from 'src/user/dto';
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
    describe('Create Bookmark', () => {

    })
    describe('Get Bookmarks', () => {

    })
    describe('Get Bookmark by ID', () => {

    })
    describe('Edit Bookmark by id', () => {

    })
    describe('Delete Bookmark by id', () => {

    })
  })

})
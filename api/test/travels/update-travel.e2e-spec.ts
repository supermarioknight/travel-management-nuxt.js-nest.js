import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Update Travel (e2e)', () => {
  let app: INestApplication;
  let travelsRepo: EntityRepository<Travel>;
  let jwtService: JwtService;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, jwtService, teardown } = await testSetup());
  });

  afterEach(async () => {
    await teardown();
  });

  test('requires auth', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        variables: {
          data: {
            id: faker.datatype.uuid(),
            name: faker.lorem.sentence(),
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
      });
  });

  test('forbidden to traveler', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.TRAVELER,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            id: faker.datatype.uuid(),
            name: faker.lorem.sentence(),
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
      });
  });

  test('travel not found', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ORGANIZER,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            id: faker.datatype.uuid(),
            name: faker.lorem.sentence(),
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('404');
      });
  });

  test('slug already exists', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ORGANIZER,
    });

    const conflictingSlug = faker.lorem.slug();

    await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: conflictingSlug,
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
      isPublic: true,
    });

    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
      isPublic: true,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            id: travelId,
            slug: conflictingSlug,
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('409');
        expect(res.body.errors[0].message).toBe(`slug-already-exists`);
      });
  });

  test('success', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ORGANIZER,
    });

    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
      isPublic: true,
    });

    const data = {
      id: travelId,
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: { data },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.updateTravel).toBeDefined();
        expect(res.body.data.updateTravel.id).toBeDefined();

        const travel = await travelsRepo.findOne(travelId);

        expect(travel).toBeDefined();
        expect(travel.name).toBe(data.name);
        expect(travel.slug).toBe(data.slug);
        expect(travel.description).toBe(data.description);
        expect(travel.numberOfDays).toBe(data.numberOfDays);
      });
  });
});

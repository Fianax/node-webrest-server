import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';
import { todo } from 'node:test';

describe('routes.ts', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    })

    const todo1 = {text: 'hola 1'}
    const todo2 = {text: 'hola 2'}

    test('should return api/todo', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        })

        const {body} = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[0].completedAt).toBeNull();
    });

    test('should return api/todos/:id', async () => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const {body} = await request(testServer.app)
            .get(`/api/todos/${todo.id}`)
            .expect(200);

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: todo.completedAt
        });
    });

    test('should return api/todos/:id not found', async () => {
        const {body} = await request(testServer.app)
            .get(`/api/todos/99999`)
            .expect(404);

        expect(body).toEqual({ error: 'Todo con el id 99999 no se encontro' });
    });

    test('create new todo', async () => {
        const {body} = await request(testServer.app)
            .post(`/api/todos/`)
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        })
    });

    test('create ERROR to new todo', async () => {
        const {body} = await request(testServer.app)
            .post(`/api/todos/`)
            .send({})
            .expect(400);

        expect(body).toEqual({ error: 'Text is requerido'})
    });

    test('create ERROR to new todo', async () => {
        const {body} = await request(testServer.app)
            .post(`/api/todos/`)
            .send({text: ''})
            .expect(400);

        expect(body).toEqual({ error: 'Text is requerido'})
    });

    test('update todo', async () => {
        const todo = await prisma.todo.create({
            data: todo1
        });

        const {body} = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({text: 'hola', completedAt: '2003-06-06'})
            .expect(200);

        expect(body).toEqual(
            { 
                id: expect.any(Number), 
                text: 'hola', 
                completedAt: '2003-06-06T00:00:00.000Z' 
            }
        )
    });

    test('update todo ERROR 404', async () => {
        const {body} = await request(testServer.app)
            .put(`/api/todos/99999999`)
            .send({text: 'hola', completedAt: '2003-06-06'})
            .expect(404);

        console.log(body);

        expect(body).toEqual({error: "Todo con el id 99999999 no se encontro",})
    });

    test('update todo ONLY date', async () => {
        const todo = await prisma.todo.create({
            data: todo1
        });

        const {body} = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({completedAt: '2003-06-06'})
            .expect(200);

        expect(body).toEqual(
            { 
                id: expect.any(Number), 
                text: todo1.text, 
                completedAt: '2003-06-06T00:00:00.000Z' 
            }
        )
    });

    test('delete todo', async () => {
        const todo = await prisma.todo.create({
            data: todo1
        });

        const {body} = await request(testServer.app)
            .delete(`/api/todos/${todo.id}`)
            .expect(200);

        expect(body).toEqual(
            { 
                id: expect.any(Number), 
                text: 'hola 1', 
                completedAt: null 
            }
        )
    });

    test('delete ERROR 404 todo', async () => {
        const {body} = await request(testServer.app)
            .delete(`/api/todos/999999`)
            .expect(404);

        expect(body).toEqual({error: "Todo con el id 999999 no se encontro"})
    });
})
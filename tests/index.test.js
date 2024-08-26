// __tests__/index.test.js
const request = require('supertest');
const express = require('express');
const { app, server } = require('../src/index');

describe('Project API', () => {
  let projects = [
    { id: 1, title: 'Project 1', owner: 'Owner 1' },
    { id: 2, title: 'Project 2', owner: 'Owner 2' }
  ];

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    app.projects = [...projects];
  });

  test('GET / should return root route message', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Root route is empty.' });
  });

  test('GET /projects should return all projects', async () => {
    const res = await request(server).get('/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(projects);
  });

  test('GET /projects/:id should return a project by id', async () => {
    const res = await request(server).get('/projects/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(projects[0]);
  });

  test('GET /projects/:id should return 404 if project not found', async () => {
    const res = await request(server).get('/projects/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Project not found' });
  });

  test('POST /projects should create a new project', async () => {
    const newProject = { title: 'Project 3', owner: 'Owner 3' };
    const res = await request(server).post('/projects').send(newProject);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 3, ...newProject });
  });

  test('PUT /projects/:id should update a project', async () => {
    const updatedProject = { title: 'Updated Project 1', owner: 'Updated Owner 1' };
    const res = await request(server).put('/projects/1').send(updatedProject);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, ...updatedProject });
  });

  test('PUT /projects/:id should return 404 if project not found', async () => {
    const updatedProject = { title: 'Updated Project 999', owner: 'Updated Owner 999' };
    const res = await request(server).put('/projects/999').send(updatedProject);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Project not found' });
  });

  test('PATCH /projects/:id should update specific fields', async () => {
    const res = await request(server).patch('/projects/1').send({ title: 'Patched Project 1' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, title: 'Patched Project 1', owner: 'Owner 1' });
  });

  test('PATCH /projects/:id should return 404 if project not found', async () => {
    const res = await request(server).patch('/projects/999').send({ title: 'Patched Project 999' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Project not found' });
  });

  test('DELETE /projects/:id should delete a project', async () => {
    const res = await request(server).delete('/projects/1');
    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  test('DELETE /projects/:id should return 404 if project not found', async () => {
    const res = await request(server).delete('/projects/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'Project not found' });
  });
});
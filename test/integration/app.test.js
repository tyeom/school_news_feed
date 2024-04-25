import mongoose from 'mongoose';
import { it, expect, afterAll } from '@jest/globals';
import request from 'supertest';

const {server, serverClose} = require('../../src/index');

afterAll(async () => {
    serverClose();
    await mongoose.connection.close();
});

// Signup Test
it("POST /auth/signup - 회원가입, 상태코드: 200", async () => {
    const res = await request(server).post('/api/auth/signup').send(
        {
            "firstName": "test3",
            "lastName": "test3",
            "userName": "test3",
            "email": "test3@example.com",
            "password": "123"
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
    expect(res.body.data.newUser.userName).toBe("test3");
});

let userTokenByStudent;
let userTokenByAdmin;

// Signin Test
it("POST /auth/signin - 일반 유저 로그인, 상태코드: 200", async () => {
    const res = await request(server).post('/api/auth/signin').send(
        {
            "userName": "test3",
            "password": "123"
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
    userTokenByStudent = res.body.data.tokens.accessToken.token;
});

// Signin Test [관리자]
it("POST /auth/signin - 관리자 로그인, 상태코드: 200", async () => {
    const res = await request(server).post('/api/auth/signin').send(
        {
            "userName": "admin",
            "password": "1234"
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
    userTokenByAdmin = res.body.data.tokens.accessToken.token;

});

let schoolId;

// School Create Test [관리자]
it("POST /school/create -  학교 생성, 상태코드: 200", async () => {
    const res = await request(server)
    .post('/api/school/create')
    .set("Authorization", `Bearer ${userTokenByAdmin}`)
    .send(
        {
            "region": "서울",
            "schoolName": "테스트 중학교",
            "educationLevel": "middle"
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
    schoolId = res.body.data.school.id;
});

// School Create Test [관리자]
it("POST /school/create -  중복 이름 학교 생성, 상태코드: 400", async () => {
    const res = await request(server)
    .post('/api/school/create')
    .set("Authorization", `Bearer ${userTokenByAdmin}`)
    .send(
        {
            "region": "서울",
            "schoolName": "테스트 중학교",
            "educationLevel": "middle"
        });
        
    // 예상 400
    expect(res.statusCode).toBe(400);
});

// Subscribe [학생]
it("POST /student/subscribe -  학교 소식 구독, 상태코드: 200", async () => {
    const res = await request(server)
    .post('/api/student/subscribe')
    .set("Authorization", `Bearer ${userTokenByStudent}`)
    .send(
        {
            "schoolId": schoolId
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
});

// News Create Test [관리자]
it("POST /news/create -  소식 생성, 상태코드: 200", async () => {
    const res = await request(server)
    .post('/api/news/create')
    .set("Authorization", `Bearer ${userTokenByAdmin}`)
    .send(
        {
            "title": "소식 생성 테스트",
            "content": "내용",
            "school": schoolId
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
});

// Unsubscribe [학생]
it("POST /student/unsubscribe -  학교 소식 구독 취소, 상태코드: 200", async () => {
    const res = await request(server)
    .post('/api/student/unsubscribe')
    .set("Authorization", `Bearer ${userTokenByStudent}`)
    .send(
        {
            "schoolId": schoolId
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
});

// News Create Test [관리자]
it("POST /news/create - 소식 생성2, 상태코드: 200", async () => {
    const res = await request(server)
    .post('/api/news/create')
    .set("Authorization", `Bearer ${userTokenByAdmin}`)
    .send(
        {
            "title": "소식 생성 테스트2",
            "content": "내용",
            "school": schoolId
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
});

// 구독중인 학교 소식 보기 [학생]
it("GET /student/news/{schoolId} -  구독중인 학교 소식 보기, 상태코드: 200", async () => {
    const res = await request(server)
    .get(`/api/student/news/${schoolId}`)
    .set("Authorization", `Bearer ${userTokenByStudent}`)
    .send(
        {
            "schoolId": schoolId
        });
        
    // 예상 200
    expect(res.statusCode).toBe(200);
    const news = res.body.data.schoolNews;
    // 소식 개수 1개 [구독 취소 상태이기에 더 이상 새로운 소식은 못본다.]
    expect(news.length).toBe(1);
});
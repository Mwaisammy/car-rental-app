 import { CustomerTable } from "../../src/Drizzle/schema";
 import db from '../../src/Drizzle/db'
 import { eq } from 'drizzle-orm'
import app from "../../src";
import  request  from "supertest";
import bcrypt from "bcryptjs";


 const testUser = {
    firstName:"reg",
    lastName: "user",
    email:"reguser@email.com",
    password: "regpass123",
    phoneNumber: '1234567890', 
    address: '123 Test St'

 }

 afterAll( async () => {
    //Clean up test user
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()
 })

 describe('Post auth/register', () => {
    it("should register a new user successfully", async() => {
        const res = await request(app)
        .post("/auth/register")
        //send to db
        .send({
            ...testUser,
            password: bcrypt.hashSync(testUser.password, 10)
        })

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty("message", "User created successfully and verification code sent to email")


    })


    it("should fail when a user is registered more than once", async() => {
      //register a user 
       await request(app)
        .post("/auth/register")
        .send({
            ...testUser,
            password: bcrypt.hashSync(testUser.password, 10)
        })

        //try to register same user again

      const res = await request(app)
        .post("/auth/register")
        .send({
            ...testUser,
            password: bcrypt.hashSync(testUser.password, 10)
        })

        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty("message", "User with this email already exists")

    })
 })
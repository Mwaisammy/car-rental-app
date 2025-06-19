import request from 'supertest'
import bcrypt from 'bcrypt'
import app from "../../src/index"
import { CustomerTable } from '../../src/Drizzle/schema'
import db from '../../src/Drizzle/db'
import { eq } from 'drizzle-orm'

//Create test user
let testUser = {
    firstName:"test",
    lastName: "user",
    email:"testuser@email.com",
    password: "testpass123",
    phoneNumber: '1234567890', 
    address: '123 Test St'


}

//Hash user's password
beforeAll( async() => {
    const hashedPassword = bcrypt.hashSync(testUser.password, 10)
    await db.insert(CustomerTable).values({
        ...testUser,
        password: hashedPassword    
    })
})

//Delete created user
afterAll( async() => {
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()
})

describe("Post /auth/login", () => {
    it("should return a user and return a token", async() => {
        const res = await request(app)
        .post("/auth/login")
        .send(
            {
               email: testUser.email,
               password: testUser.password 
            }
        )


        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("token")
        expect(res.body.user).toEqual(
            expect.objectContaining({
                user_id:expect.any(Number),
                first_name: testUser.firstName,
                last_name: testUser.lastName
            })
        )
    })

    it("should fail with wrong password", async() => {
        const res = await request(app)
        .post("/auth/login")
        .send({
            email: testUser.email,
            password: "wrongpassword"
        })

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({"message": "Invalid credentials"})
    })

    it("should fail with non-existent user", async() => {
        const res =await request(app)
        .post("/auth/login")
        .send({
            email: 'nouser@email.com',
            password: 'testpass123'
        })

        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual({message: "user not found"})
    })

})




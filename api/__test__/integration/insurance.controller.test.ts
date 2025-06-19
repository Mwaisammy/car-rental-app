import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { CustomerTable, CarTable, InsuranceTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";
import { drizzle } from "drizzle-orm/singlestore";


let token: string;
let customerID: number;
let insuranceid: number;
let carid: number




const testUser = {
    firstName: "Purity",
    lastName: 'Mwende',
    email: 'puritymwende@email.com',
    password: 'mwendepurity432',
    phoneNumber: '1234567890', 
    address: '123 Test St'

}

const carTest =  { 
    carModel: "Toyota Corolla",
    year: "2020-01-01", 
    color: "Red", 
    rentalRate: "50.00",
    availability: true, locationID: 1 
}

       

beforeAll(async ()=> {
    //Create a test user

    const hashedPassword = bcrypt.hashSync(testUser.password, 10 );
    const [user] = await db.insert(CustomerTable).values({
        ...testUser,
        password: hashedPassword,
        role: 'admin',
        isVerified: true

    }).returning()
    customerID = user.customerID

    const [car] = await db.insert(CarTable).values({
        ...carTest,
       

    }).returning()
    carid = car.carID




    //Login to get the token
    const res = await request(app)
    .post("/auth/login")
    .send({
        email: testUser.email,
        password: testUser.password
    })

    token = res.body.token
})


afterAll(async () => {
    await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID))
      await db.delete(CarTable).where(eq(CarTable.carID, carid));
    
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()

})


describe("insurance API Integration Test", () => {
    it("should create a insurance", async () => {
      const insuranceData = {
          carID: carid,
          customerID: customerID,
          insuranceProvider: "ABC Insurance",
          policyNumber: "12345", 
          startDate: "2024-01-01",
          endDate: "2024-12-31"
      }
         


        const res = await request(app)
            .post("/insurance")
            .set("Authorization",  `Bearer ${token}`)
            .send(insuranceData)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("message")
         if (res.body.data && res.body.data.insuranceID) {
                insuranceid = res.body.data.insuranceID;
            } else if (res.body.insuranceID) {
                insuranceid = res.body.insuranceID;
            } else if (res.body.id) {
                insuranceid = res.body.id;
            } else {
               
                const createdInsurance = await db.select()
                    .from(InsuranceTable)
                    .orderBy(InsuranceTable.insuranceID);
                insuranceid = createdInsurance[createdInsurance.length - 1].insuranceID;
            }
            
         
            expect(insuranceid).toBeDefined();
            expect(insuranceid).toBeGreaterThan(0);
    })

    it("should get all insurances", async() => {
        const res = await request(app)
            .get("/insurances")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("insurances:", res.body.data)

    })

    it("should get a insurance by id", async() => {
        //  const insuranceid = 1
         const res = await request(app)
            .get(`/insurance/${insuranceid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)

    })

    it("should update a insurance", async() => {
        const updated = {
            insuranceModel: "Porshe Cayenne",
            year:"2025-06-09",
        }
         const res = await request(app)
            .get(`/insurance/${insuranceid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a todo", async() => {
        const res = await request(app)
        .delete(`/insurance/${insuranceid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
    })

    //Negative tests
    it("should not get a insurance with an invalid id", async () => {
        const res = await request(app)
            .get('/insurance/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a insurance with an invalid id", async () => {
        const res = await request(app)
            .put('/insurance/invalid_id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not delete a insurance with an invalid id", async () => {
        const res = await request(app)
            .delete('/insurance/99999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })


     it("should return 404 for non-existent insurance", async () => {
        const res = await request(app)
          .get("/insurance/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 404 when deleting non-existent insurance", async () => {
        const res = await request(app)
          .delete("/insurance/invalid_id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
      });



})
 


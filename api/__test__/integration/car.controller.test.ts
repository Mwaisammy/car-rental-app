import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { CustomerTable, CarTable, LocationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";


let token: string;
let customerID: number;
let carid: number;
let locationid : number




const testUser = {
    firstName: "Purity",
    lastName: 'Mwende',
    email: 'puritymwende@email.com',
    password: 'mwendepurity432',
    phoneNumber: '1234567890', 
    address: '123 Test St'

}

const locationTest =  { 
    locationName: "Nairobi",
    address: "123 Nairobi", 
    contactNumber: "1234567890"
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

    const [location] = await db.insert(LocationTable).values({
        ...locationTest,
       

    }).returning()
    locationid = location.locationID




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
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()

})



describe("car API Integration Test", () => {
      it("should create a car", async () => {
       

const carData = {
    carModel: "Toyota Corolla",
    year: "2020-01-01",
    color: "Red",
    rentalRate: "50.00",
    availability: true, 
    locationID: locationid 
}

const res = await request(app)
.post("/car")
.set("Authorization",  `Bearer ${token}`)
.send(carData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.carid) {
        carid = res.body.data.carid;
    } else if (res.body.carid) {
        carid = res.body.carid;
    } else if (res.body.id) {
        carid = res.body.id;
    } else {
       
        const createdCars = await db.select()
            .from(CarTable)
            .orderBy(CarTable.carID);
        carid = createdCars[createdCars.length - 1].carID;
    }
    
 
    expect(carid).toBeDefined();
    expect(carid).toBeGreaterThan(0);

})

    it("should get all cars", async() => {
        const res = await request(app)
            .get("/cars")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("cars:", res.body.data)

    })

    it("should get a car by id", async() => {
        //  const carid = 1
         const res = await request(app)
            .get(`/car/${carid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)

    })

    it("should update a car", async() => {
        const updated = {
            carModel: "Porshe Cayenne",
            year:"2025-06-09",
        }
         const res = await request(app)
            .get(`/car/${carid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a car", async() => {
        const res = await request(app)
        .delete(`/car/${carid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
    })

    //Negative tests
    it("should not get a car with an invalid id", async () => {
        const res = await request(app)
            .get('/car/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a car with an invalid id", async () => {
        const res = await request(app)
            .put('/car/999999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })

    it("should not delete a car with an invalid id", async () => {
        const res = await request(app)
            .delete('/car/99999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })
     it("should return 404 for non-existent car", async () => {
        const res = await request(app)
          .get("/car/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 400 when deleting non-existent car", async () => {
        const res = await request(app)
          .delete("/car/898989")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
      });



})
 


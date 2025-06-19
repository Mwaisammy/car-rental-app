import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { LocationTable, CarTable, CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";


let token: string;
let customerID: number;
let locationid: number;
let carid : number;




const testUser = {
    firstName: "Purity",
    lastName: 'Mwende',
    email: 'puritymwende@email.com',
    password: 'mwendepurity432',
    phoneNumber: '1234567890', 
    address: '123 Test St'
}

const carTest = {
           
            carModel: "Porshe 911",
            year:"2025-06-09",
            color:"orange",
            rentalRate: "50.00",
            availability: true,
            locationID: 3,

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
            ...carTest
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
  
  await db.delete(CarTable).where(eq(CarTable.carID, carid));
    await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID))
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()

})



describe("location API Integration Test", () => {
    it("should create a location", async () => {
       

       const locationData = {
    locationName: "Nakuru",
     address: "789 Nakuru", 
     contactNumber: "5555555555" 
}

const res = await request(app)
.post("/location")
.set("Authorization",  `Bearer ${token}`)
.send(locationData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.locationid) {
        locationid = res.body.data.locationid;
    } else if (res.body.locationid) {
        locationid = res.body.locationid;
    } else if (res.body.id) {
        locationid = res.body.id;
    } else {
       
        const createdLocations = await db.select()
            .from(LocationTable)
            .orderBy(LocationTable.locationID);
        locationid = createdLocations[createdLocations.length - 1].locationID;
    }
    
 
    expect(locationid).toBeDefined();
    expect(locationid).toBeGreaterThan(0);

})

    it("should get all locations", async() => {
        const res = await request(app)
            .get("/locations")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("locations:", res.body.data)

    })

    it("should get a location by id", async() => {
        //  const locationid = 1
         const res = await request(app)
            .get(`/location/${locationid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)

    })

    it("should update a location", async() => {
        const updated = {
           locationName: "Nyeri", 
           address: "321 Nyeri",
        }
         const res = await request(app)
            .put(`/location/${locationid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a location", async() => {
        const res = await request(app)
        .delete(`/location/${locationid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
     })

    //Negative tests
    it("should not get a location with an invalid id", async () => {
        const res = await request(app)
            .get('/location/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a location with an invalid id", async () => {
        const res = await request(app)
            .put('/location/999999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })

    it("should not delete a location with an invalid id", async () => {
        const res = await request(app)
            .delete('/location/99999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })


     it("should return 404 for non-existent location", async () => {
        const res = await request(app)
          .get("/location/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 404 when deleting non-existent location", async () => {
        const res = await request(app)
          .delete("/location/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
      });



})
 


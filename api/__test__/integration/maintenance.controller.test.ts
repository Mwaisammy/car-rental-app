import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { MaintenanceTable, CarTable, CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";


let token: string;
let customerID: number;
let maintenanceid: number;
let carid : number;
let bookingid: number;




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



describe("Maintenance API Integration Test", () => {
    it("should create a maintenance", async () => {
       

       const maintenanceData = {
    carID: carid, 
    maintenanceDate: "2024-06-05",
     amount: "250.00", 
     maintenanceMethod: "Credit Card"  
}

const res = await request(app)
.post("/maintenance")
.set("Authorization",  `Bearer ${token}`)
.send(maintenanceData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.maintenanceid) {
        maintenanceid = res.body.data.maintenanceid;
    } else if (res.body.maintenanceid) {
        maintenanceid = res.body.maintenanceid;
    } else if (res.body.id) {
        maintenanceid = res.body.id;
    } else {
       
        const createdmaintenances = await db.select()
            .from(MaintenanceTable)
            .orderBy(MaintenanceTable.maintenanceID);
        maintenanceid = createdmaintenances[createdmaintenances.length - 1].maintenanceID;
    }
    
 
    expect(maintenanceid).toBeDefined();
    expect(maintenanceid).toBeGreaterThan(0);

})

    it("should get all maintenances", async() => {
        const res = await request(app)
            .get("/maintenances")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("maintenances:", res.body.data)

    })

    it("should get a maintenance by id", async() => {
        //  const maintenanceid = 1
         const res = await request(app)
            .get(`/maintenance/${maintenanceid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)

    })

    it("should update a maintenance", async() => {
        const updated = {
            maintenanceDate: "2024-06-03", 
           description: "Brake inspection and fluid top-up" 
        }
         const res = await request(app)
            .put(`/maintenance/${maintenanceid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a maintenance", async() => {
        const res = await request(app)
        .delete(`/maintenance/${maintenanceid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(204)
     })

    //Negative tests
    it("should not get a maintenance with an invalid id", async () => {
        const res = await request(app)
            .get('/maintenance/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a maintenance with an invalid id", async () => {
        const res = await request(app)
            .put('/maintenance/invaid_id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not delete a maintenance with an invalid id", async () => {
        const res = await request(app)
            .delete('/maintenance/invalid_id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

     it("should return 404 for non-existent maintenance", async () => {
        const res = await request(app)
          .get("/maintenance/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 404 when deleting non-existent maintenance", async () => {
        const res = await request(app)
          .delete("/maintenance/invalid_id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
      });



})
 


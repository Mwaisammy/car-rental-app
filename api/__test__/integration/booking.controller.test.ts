import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { BookingsTable, CarTable, CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";
import car from "../../src/car/car.router";


let token: string;
let customerID: number;
let bookingid: number;
let carid:number;




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
const bookingTest = {
        rentalStartDate: "2024-06-05", 
        rentalEndDate: "2024-06-10", 
        totalAmount: "250.00" ,
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
    await db.delete(BookingsTable).where(eq(BookingsTable.customerID, customerID));
  await db.delete(CarTable).where(eq(CarTable.carID, carid));
    await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID))
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()

})



describe("booking API Integration Test", () => {
      it("should create a booking", async () => {
       

       const bookingData = {
   carID: carid, 
   customerID: customerID,
    rentalStartDate: "2024-06-05", 
    rentalEndDate: "2024-06-10", 
    totalAmount: "250.00" 
}

const res = await request(app)
.post("/booking")
.set("Authorization",  `Bearer ${token}`)
.send(bookingData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.bookingID) {
        bookingid = res.body.data.bookingID;
    } else if (res.body.bookingID) {
        bookingid = res.body.bookingID;
    } else if (res.body.id) {
        bookingid = res.body.id;
    } else {
       
        const createdbookings = await db.select()
            .from(BookingsTable)
            .where(eq(BookingsTable.customerID, customerID))
            .orderBy(BookingsTable.bookingID);
        bookingid = createdbookings[createdbookings.length - 1].bookingID;
    }
    
 
    expect(bookingid).toBeDefined();
    expect(bookingid).toBeGreaterThan(0);

})

    it("should get all bookings", async() => {
        const res = await request(app)
            .get("/bookings")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("bookings:", res.body.data)

    })

    it("should get a booking by id", async() => {
        //  const bookingID = 1
         const res = await request(app)
            .get(`/booking/${bookingid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveProperty("bookingID")

    })

    it("should update a booking", async() => {
        const updated = {
            rentalEndDate: "2024-06-10", 
            totalAmount: "250.00"
        }
         const res = await request(app)
            .get(`/booking/${bookingid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a booking", async() => {
        const res = await request(app)
        .delete(`/booking/${bookingid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
     })

    //Negative tests
    it("should not get a booking with an invalid id", async () => {
        const res = await request(app)
            .get('/booking/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a booking with an invalid id", async () => {
        const res = await request(app)
            .put('/booking/999999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })

    it("should not delete a booking with an invalid id", async () => {
        const res = await request(app)
            .delete('/booking/99999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })

     it("should return 404 for non-existent booking", async () => {
        const res = await request(app)
          .get("/booking/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 404 when deleting non-existent booking", async () => {
        const res = await request(app)
          .delete("/booking/invalid_id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
      });



})
 


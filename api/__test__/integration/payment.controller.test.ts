import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { PaymentTable, CarTable, CustomerTable, BookingsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";


let token: string;
let customerID: number;
let paymentid: number;
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
     const [booking] = await db.insert(BookingsTable).values({
           carID: carid, 
        customerID: customerID,
        rentalStartDate: "2024-06-05", 
        rentalEndDate: "2024-06-10",
        totalAmount: "250.00"
        }).returning()
        bookingid = booking.bookingID




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



describe("Payment API Integration Test", () => {
    it("should create a payment", async () => {
       

       const paymentData = {
    bookingID: bookingid, 
    paymentDate: "2024-06-05",
     amount: "250.00", 
     paymentMethod: "Credit Card"  
}

const res = await request(app)
.post("/payment")
.set("Authorization",  `Bearer ${token}`)
.send(paymentData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.paymentid) {
        paymentid = res.body.data.paymentid;
    } else if (res.body.paymentid) {
        paymentid = res.body.paymentid;
    } else if (res.body.id) {
        paymentid = res.body.id;
    } else {
       
        const createdPayments = await db.select()
            .from(PaymentTable)
            .orderBy(PaymentTable.paymentID);
        paymentid = createdPayments[createdPayments.length - 1].paymentID;
    }
    
 
    expect(paymentid).toBeDefined();
    expect(paymentid).toBeGreaterThan(0);

})

    it("should get all payments", async() => {
        const res = await request(app)
            .get("/payments")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("payments:", res.body.data)

    })

    it("should get a payment by id", async() => {
        //  const paymentid = 1
         const res = await request(app)
            .get(`/payment/${paymentid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)

    })

    it("should update a payment", async() => {
        const updated = {
            amount: "500.00",
             paymentMethod: "M-pesa"
        }
         const res = await request(app)
            .put(`/payment/${paymentid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a payment", async() => {
        const res = await request(app)
        .delete(`/payment/${paymentid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
     })

    //Negative tests
    it("should not get a payment with an invalid id", async () => {
        const res = await request(app)
            .get('/payment/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a payment with an invalid id", async () => {
        const res = await request(app)
            .put('/payment/invaid_id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not delete a payment with an invalid id", async () => {
        const res = await request(app)
            .delete('/payment/invalid_id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

     it("should return 404 for non-existent payment", async () => {
        const res = await request(app)
          .get("/payment/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
       
      });

       it("should return 404 when deleting non-existent payment", async () => {
        const res = await request(app)
          .delete("/payment/invalid_id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
      });



})
 


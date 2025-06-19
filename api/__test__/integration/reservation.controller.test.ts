import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { ReservationTable, CarTable,  CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";


let token: string;
let customerID: number;
let reservationid: number;
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
  
    await db.delete(ReservationTable).where(eq(ReservationTable.customerID, customerID));
  await db.delete(CarTable).where(eq(CarTable.carID, carid));
    await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID))
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email))
    await db.$client.end()

})



describe("reservation API Integration Test", () => {
    it("should create a reservation", async () => {
       

       const reservationData = {
    carID: carid,
    customerID: customerID,
    reservationDate: "2024-06-05",
    pickupDate: "2024-06-09", 
    returnDate: "2024-06-14"
}

const res = await request(app)
.post("/reservation")
.set("Authorization",  `Bearer ${token}`)
.send(reservationData)

expect(res.status).toBe(201)
expect(res.body).toHaveProperty("message")

 if (res.body.data && res.body.data.reservationID) {
        reservationid = res.body.data.reservationID;
    } else if (res.body.reservationID) {
        reservationid = res.body.reservationID;
    } else if (res.body.id) {
        reservationid = res.body.id;
    } else {
       
        const createdReservations = await db.select()
            .from(ReservationTable)
            .where(eq(ReservationTable.customerID, customerID))
            .orderBy(ReservationTable.reservationID);
        reservationid = createdReservations[createdReservations.length - 1].reservationID;
    }
    
 
    expect(reservationid).toBeDefined();
    expect(reservationid).toBeGreaterThan(0);

})

    it("should get all reservations", async() => {
        const res = await request(app)
            .get("/reservations")
            .set("Authorization",  `Bearer ${token}`)
       


        expect(res.status).toBe(200)
        expect(res.body.data).toBeInstanceOf(Array)
        expect(res.body.data.length).toBeGreaterThan(0);
        console.log("reservations:", res.body.data)

    })

    it("should get a reservation by id", async() => {
        //  const reservationID = 1
         const res = await request(app)
            .get(`/reservation/${reservationid}`)
            .set("Authorization",  `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveProperty("reservationID")

    })

    it("should update a reservation", async() => {
        const updated = {
            pickupDate: "2020-04-06", 
        returnDate: "2025-05-06"
        }
         const res = await request(app)
            .put(`/reservation/${reservationid}`)
            .set("Authorization",  `Bearer ${token}`)
            .send(updated)

            expect(res.status).toBe(200)
          
    })

    it("should delete a reservation", async() => {
        const res = await request(app)
        .delete(`/reservation/${reservationid}`)
         .set("Authorization",  `Bearer ${token}`)

    expect(res.status).toBe(200)
     })

    //Negative tests
    it("should not get a reservation with an invalid id", async () => {
        const res = await request(app)
            .get('/reservation/invalid-id')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(400) 
    })

    it("should not update a reservation with an invalid id", async () => {
        const res = await request(app)
            .put('/reservation/999999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })

    it("should not delete a reservation with an invalid id", async () => {
        const res = await request(app)
            .delete('/reservation/99999')
            .set("Authorization",  `Bearer ${token}`)

        expect(res.status).toBe(404) 
    })



})
 


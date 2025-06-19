import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import app from "../../src";
import  request  from "supertest";



let token: string;
let customerID: number;

const testCustomer = {
        firstName: "Test",
        lastName: "Customer",
        email: "testcustomer@email.com",
        password: "testpassword123",
        phoneNumber: "9876543210",
        address: "456 Test Ave"
      };

beforeAll(async () => {
        // Create a test customer
       const hashedPassword = bcrypt.hashSync(testCustomer.password, 10 );
    const [user] = await db.insert(CustomerTable).values({
        ...testCustomer,
        password: hashedPassword,
        role: 'admin',
        isVerified: true

    }).returning()
    customerID = user.customerID

        // Login to get token
        const res = await request(app)
          .post("/auth/login")
          .send({
            email: testCustomer.email,
            password: testCustomer.password
          });
        token = res.body.token;
      });

      afterAll(async () => {
        await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID));
      });


describe("Customer API Integration Test", () => {
     

      it("should get all customers", async () => {
        const res = await request(app)
          .get("/customers")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((c: any) => c.customerID === customerID)).toBe(true);
      });

      it("should get a customer by id", async () => {
        const res = await request(app)
          .get(`/customer/${customerID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        
      });

      it("should return 400 for invalid customer id", async () => {
        const res = await request(app)
          .get("/customer/invalid-id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        // expect(res.body.message).toBe("Invalid ID");
      });

      it("should return 404 for non-existent customer", async () => {
        const res = await request(app)
          .get("/customer/999999")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        // expect(res.body.message).toBe("Customer not found");
      });

      it("should update a customer", async () => {
        const updatedData = {
          firstName: "Updated",
          lastName: "Customer"
        };
        const res = await request(app)
          .put(`/customer/${customerID}`)
          .set("Authorization", `Bearer ${token}`)
          .send(updatedData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Customer updated successfully");
      });

      it("should return 400 when updating with invalid id", async () => {
        const res = await request(app)
          .put("/customer/invalid-id")
          .set("Authorization", `Bearer ${token}`)
          .send({ firstName: "Invalid" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid ID");
      });

      it("should return 404 when updating non-existent customer", async () => {
        const res = await request(app)
          .put("/customer/invalid_id")
          .set("Authorization", `Bearer ${token}`)
          .send({ firstName: "Ghost" });

        expect(res.status).toBe(400);
      });

      it("should delete a customer", async () => {
        // Create a customer to delete
        const [toDelete] = await db.insert(CustomerTable).values({
          ...testCustomer,
          email: "deletecustomer@email.com"
        }).returning();
        const res = await request(app)
          .delete(`/customer/${toDelete.customerID}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Customer deleted successfully");
      });

      it("should return 400 when deleting with invalid id", async () => {
        const res = await request(app)
          .delete("/customer/invalid-id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid ID");
      });

      it("should return 404 when deleting non-existent customer", async () => {
        const res = await request(app)
          .delete("/customer/invalid_id")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
      });
    });



 


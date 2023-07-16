import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import { DB_URI } from "../config/config";
import { PHONE_ALREADY_EXISTS_ERR, PHONE_IS_AVAILABLE } from "../errors";

beforeEach(async () => {
  await mongoose.connect(DB_URI);
});

describe("POST /auth/users/phoneExist", () => {
  it("should verify a phone number available", async () => {
    const res = await request(app).post("/auth/users/phoneExist").send({
      phone: "55555",
    });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe("success");
    expect(res.body.message).toBe(PHONE_IS_AVAILABLE);
  });
  it("should verify a phone number unavailable", async () => {
    const res = await request(app).post("/auth/users/phoneExist").send({
      phone: "32323232",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message).toBe(PHONE_ALREADY_EXISTS_ERR);
  });
});
afterEach(async () => {
  await mongoose.connection.close();
});

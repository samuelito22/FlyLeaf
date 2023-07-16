import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import { DB_URI } from "../config/config";
import { EMAIL_ALREADY_EXISTS_ERR, EMAIL_IS_AVAILABLE } from "../errors";

beforeEach(async () => {
  await mongoose.connect(DB_URI);
});

describe("POST /auth/users/emailExist", () => {
  it("should verify an email available", async () => {
    const response = await request(app).post("/auth/users/emailExist").send({
      email: "marlon1@gmail.com",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.type).toBe("success");
    expect(response.body.message).toBe(EMAIL_IS_AVAILABLE);
  });

  it("should verify an email unavailable", async () => {
    const response = await request(app).post("/auth/users/emailExist").send({
      email: "marlon@gmail.com",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.type).toBe("error");
    expect(response.body.message).toBe(EMAIL_ALREADY_EXISTS_ERR);
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

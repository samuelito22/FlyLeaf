import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import { DB_URI } from "../config/config";
import {
  EMAIL_ALREADY_EXISTS_ERR,
  PASSWORD_MUST_MATCH,
  PHONE_ALREADY_EXISTS_ERR,
} from "../errors";

beforeEach(async () => {
  await mongoose.connect(DB_URI);
});

describe("POST /auth/users/register", () => {
  it("should not be available the phone number, already taken", async () => {
    const res = await request(app).post("/auth/users/register").send({
      name: "MgeovanyDev",
      email: "marlon@gmail.com",
      phone: "04040404",
      password: "Testing123@",
      password2: "Testing123@",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message).toBe(PHONE_ALREADY_EXISTS_ERR);
  });

  it("should not be available the email, already taken", async () => {
    const res = await request(app).post("/auth/users/register").send({
      name: "MgeovanyDev",
      email: "marlondev@gmail.com",
      phone: "03030303",
      password: "Testing123@",
      password2: "Testing123@",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message).toBe(EMAIL_ALREADY_EXISTS_ERR);
  });

  it("should not be available the password, they don't match", async () => {
    const res = await request(app).post("/auth/users/register").send({
      name: "MgeovanyDev",
      email: "marlondev@gmail.com",
      phone: "03030303",
      password: "Testing123@",
      password2: "Testing@",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message.password2).toBe(PASSWORD_MUST_MATCH);
  });
});
afterEach(async () => {
  await mongoose.connection.close();
});

import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import { DB_URI } from "../config/config";
import { EMAIL_NOT_FOUND_ERR, PASSWORD_INCORRECT } from "../errors";

beforeEach(async () => {
  await mongoose.connect(DB_URI);
});

describe("POST /auth/users/login", () => {
  it("should not found email", async () => {
    const res = await request(app).post("/auth/users/login").send({
      email: "marlon1@gmail.com",
      password: "2332",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message).toBe(EMAIL_NOT_FOUND_ERR);
  });

  it("should have incorrect password", async () => {
    const res = await request(app).post("/auth/users/login").send({
      email: "marlon@gmail.com",
      password: "2332",
    });

    expect(res.status).toBe(400);
    expect(res.body.type).toBe("error");
    expect(res.body.message).toBe(PASSWORD_INCORRECT);
  });

  it("should have email and password correct", async () => {
    const res = await request(app).post("/auth/users/login").send({
      email: "marlondev@gmail.com",
      password: "Testing123@",
    });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe("success");
    expect(res.body.token).toBeDefined();
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

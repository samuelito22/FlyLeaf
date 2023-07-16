import app from "../app";
import request from "supertest";

describe("Google authentication route", () => {
  it("should return a 200 status code when GET /google is called", async () => {
    const response = await request(app).get("/auth/users/google/");

    expect(response.status).toBe(302);
  });
});

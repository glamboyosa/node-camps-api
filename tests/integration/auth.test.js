const request = require("supertest");
const { User } = require("../../models/user");
const { Speaker } = require("../../models/speaker");
let server;
describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Speaker.remove({});
    server.close();
  });
  it("should return 401", async () => {
    const res = await request(server)
      .post("/api/speakers")
      .send({ fullname: "speaker1" });
    expect(res.status).toBe(401);
  });
  it("should return 400 if the token is invalid", async () => {
    const token = null;
    const res = await request(server)
      .post("/api/speakers")
      .set("x-auth-token", token)
      .send({ fullname: "speaker1" });
    expect(res.status).toBe(400);
  });
});

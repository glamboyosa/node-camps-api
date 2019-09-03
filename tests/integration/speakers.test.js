let request = require("supertest");
const { Speaker } = require("../../models/speaker");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;
describe("/api/speakers", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Speaker.remove({});
  });
  describe("GET", () => {
    it("should return list of speakers", async () => {
      Speaker.collection.insertMany([
        { fullname: "speaker1" },
        { fullname: "speaker2" }
      ]);
      const res = await request(server).get("/api/speakers");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.fullname === "speaker1")).toBeTruthy();
    });
  });
  describe("GET :ID", () => {
    it("should return the given speaker if valid id is passed", async () => {
      const speaker = new Speaker({ fullname: "speaker1" });
      await speaker.save();
      const res = await request(server).get("/api/speakers/" + speaker._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("fullname", speaker.fullname);
    });
    it("should return 404 if the id is invalid", async () => {
      const res = await request(server).get("/api/speakers/" + 2);
      expect(res.status).toBe(404);
    });
  });
  describe("POST", () => {
    it("should return 401 if the user is not logged in", async () => {
      const res = await request(server)
        .post("/api/speakers")
        .send({ fullname: "speaker1" });
      expect(res.status).toBe(401);
    });
    it("should save to DB if valid genre is set", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/speakers")
        .set("x-auth-token", token)
        .send({ fullname: "speaker1" });
      const speaker = await Speaker.find({ fullname: "speaker1" });
      expect(speaker).not.toBeNull();
    });
    it("should return the speaker if it is valid", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post("/api/speakers")
        .set("x-auth-token", token)
        .send({ fullname: "speaker1" });

      expect(res.body).toHaveProperty("_id");
    });
  });
  describe("PUT /:ID", () => {
    it("should return 401 if not authorized", async () => {
      const speaker = new Speaker({ fullname: "speaker1" });
      const res = await request(server)
        .put("/api/speakers/" + speaker._id)
        .send({ fullname: "Speaker1" });
      expect(res.status).toBe(401);
    });
    it("should return 404 if not found", async () => {
      const speaker = new Speaker({ fullname: "speaker1" });
      await speaker.save();
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .put("/api/speakers/" + mongoose.Types.ObjectId())
        .set("x-auth-token", token)
        .send({ fullname: "Speaker1" });
      expect(res.status).toBe(404);
    });
    // it("should return 404 if invalid ID", async () => {
    //   const speaker = new Speaker({ fullname: "speaker1" });
    //   await speaker.save();
    //   const user = {
    //     _id: mongoose.Types.ObjectId().toHexString(),
    //     isAdmin: true
    //   };
    //   const token = new User(user).generateAuthToken();
    //   const res = await request(server)
    //     .put("/api/speakers/" + 1)
    //     .set("x-auth-token", token)
    //     .send({ fullname: "Speaker1" });
    //   expect(res.status).toBe(404);
    // });
    it("should return save speaker to db if it is valid", async () => {
      const speaker = new Speaker({ fullname: "speaker1" });
      await speaker.save();
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .put("/api/speakers/" + 2)
        .set("x-auth-token", token)
        .send({ fullname: "Speaker1" });
      const speakerr = await Speaker.findById(speaker._id);
      expect(speakerr).not.toBeNull();
    });
    it("should return the speaker if input is valid", async () => {
      const speaker = new Speaker({ fullname: "speaker1" });
      await speaker.save();
      const user = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = new User(user).generateAuthToken();
      const res = await request(server)
        .put("/api/speakers/" + speaker._id)
        .set("x-auth-token", token)
        .send({ fullname: "Speaker1" });
      expect(res.body).toHaveProperty("_id");
    });
  });
});

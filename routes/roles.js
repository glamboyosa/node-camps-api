const express = require("express");
const router = express.Router();
const { Roles, Validate } = require("../models/role");

router.get("/", async (req, res) => {
  //Error logging works :)
  // throw new Error("Something happened");
  const role = await Roles.find();
  res.send(role);
});

router.post("/", async (req, res) => {
  const { error } = Validate(req.body);
  console.log(error);
  if (error) {
    res.sendStatus(404).send(error);
  }
  let role = new Roles({
    role: req.body.role
  });
  role = await role.save();
  res.send(role);
});
router.put("/:id", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) res.status(404).send(error);

  const role = await Roles.findByIdAndUpdate(
    req.params.id,

    {
      role: req.body.role
    },
    { new: true }
  );
  if (!role) res.sendStatus(404).send("Bad Request");
  res.send(role);
});
router.delete("/:id", async (req, res) => {
  const role = await Roles.findByIdAndRemove(req.params.id);
  if (!role) res.Status(404).send("Bad Request");
  res.send(role);
});
module.exports = router;

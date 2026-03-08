var { User, Listing, Request, Asset } = require("../models/models");
var { hashSync } = require("bcryptjs");

async function getSingleUser(req, res, next) {
  try {
    let user = await User.findByPk(parseInt(req.params.id), {
      include: [{ model: Listing, include: [Asset] }, Request],
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

async function createSingleUser(req, res, next) {
  try {
    let user = await User.create({
      email: req.fields.email,
      password: hashSync(req.fields.password, 15),
      firstname: req.fields.firstname,
      lastname: req.fields.lastname,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

async function updateSingleUser(req, res, next) {
  try {
    let user = await User.update(
      {
        email: req.fields.email,
        password: hashSync(req.fields.password, 15),
        firstname: req.fields.firstname,
        lastname: req.fields.lastname,
      },
      {
        where: {
          id: parseInt(req.params.id),
        },
        returning: true,
      },
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

module.exports = {
  createSingleUser,
  getSingleUser,
  updateSingleUser,
};

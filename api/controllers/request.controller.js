const { Request } = require("../models/models");

async function createRequest(req, res, next) {
  try {
    await Request.create({
      userId: req.fields.userid,
      requestItem: req.fields.requestItem,
      offerItem: req.fields.offerItem,
    });
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

async function getUserRequests(req, res, next) {
  try {
    let requestData = await Request.findAll({
      where: {
        userId: req.params.id,
      },
    });
    res.json(requestData);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

async function getAllRequests(req, res, next) {
  try {
    let requestData = await Request.findAll();
    res.json(requestData);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

async function deleteUserRequest(req, res, next) {
  try {
    await Request.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

module.exports = {
  createRequest,
  getUserRequests,
  deleteUserRequest,
  getAllRequests,
};

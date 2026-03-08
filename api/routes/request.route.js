const {
  createRequest,
  getUserRequests,
  deleteUserRequest,
  getAllRequests,
} = require("../controllers/request.controller");
var { isAuthorized } = require("../middleware/auth");

module.exports = function (router) {
  router.post("/api/v1/requests", isAuthorized, createRequest);
  router.get("/api/v1/requests", getAllRequests);
  router.get("/api/v1/requests/:id", isAuthorized, getUserRequests);
  router.delete("/api/v1/requests/:id", isAuthorized, deleteUserRequest);
};

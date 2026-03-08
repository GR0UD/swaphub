var { DataTypes, Model } = require("sequelize");
var { sequelize } = require("../config/database");

class Listing extends Model {}
class User extends Model {}
class Asset extends Model {}
class Newsletter extends Model {}
class Category extends Model {}
class Request extends Model {}

Listing.init(
  {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
  },
  { sequelize, modelName: "listing" },
);

Category.init(
  {
    name: DataTypes.TEXT,
  },
  { sequelize, modelName: "category" },
);

User.init(
  {
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    firstname: DataTypes.TEXT,
    lastname: DataTypes.TEXT,
  },
  { sequelize, modelName: "user" },
);

Asset.init(
  {
    url: DataTypes.TEXT,
  },
  { sequelize, modelName: "asset" },
);

Newsletter.init(
  {
    email: DataTypes.TEXT,
  },
  { sequelize, modelName: "newsletter" },
);

Request.init(
  {
    requestItem: DataTypes.INTEGER,
    offerItem: DataTypes.INTEGER,
  },
  { sequelize, modelName: "request" },
);

Request.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Request, { foreignKey: "userId" });

Listing.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Listing, { foreignKey: "userId" });

Listing.belongsTo(Asset, { foreignKey: "assetId" });
Asset.hasOne(Listing, { foreignKey: "assetId" });

Listing.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Listing, { foregnKey: "categoryId" });

sequelize
  .sync({ force: false })
  .then(function () {
    console.log("Tabels created");
  })
  .catch(function (error) {
    console.error(error);
  });

module.exports = {
  Listing,
  User,
  Asset,
  Newsletter,
  Category,
  Request,
};

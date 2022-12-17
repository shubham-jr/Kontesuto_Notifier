// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// dotenv.config({ path: "./env/config.env" });

console.log(process.env);

const app = require("./app");
const port = process.env.PORT || 3333;

// const DB = process.env.DATABASE.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log("database connected....");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

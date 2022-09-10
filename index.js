const dotenv = require("dotenv");
dotenv.config({ path: "./env/config.env" });

const app = require("./app");
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

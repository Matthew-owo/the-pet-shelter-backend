import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 10888;

app.listen(PORT, () => {
  console.log(`Koa started, listening on port ${PORT}`);
});

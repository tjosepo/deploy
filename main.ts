import { get, listen } from "./deps.ts";

const App = () => {
  get("/", (ctx) => {
    ctx.response.body = "Hello world!!";
  });
};

listen(App, { port: 8080 });

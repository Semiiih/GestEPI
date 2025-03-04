//********** Imports **********//
import express from "express";
import cors from "cors";
import * as middlewares from "./middlewares";
import epiController from "./pages/epiController";
import usersController from "./pages/usersController";
import EpiCheckController from "./pages/EpiCheckController";
import epiTypesController from "./pages/epiTypesController";
import usersTypesController from "./pages/usersTypesController";
import checkStatusController from "./pages/checkStatusController";

require("dotenv").config();

//********** Server **********//
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
// Initializing express.
const app = express();
// Enable CORS
app.use(cors(options));
// Middleware to parse json throught requests.
app.use(express.json());

app.use("/episChecks", EpiCheckController);
app.use("/epiTypes", epiTypesController);
app.use("/epis", epiController);
app.use("/users", usersController);
app.use("/usersTypes", usersTypesController);
app.use("/checkStatus", checkStatusController);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;

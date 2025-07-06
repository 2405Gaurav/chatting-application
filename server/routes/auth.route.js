import { Router } from "express";
import {login, signup} from "../controllers/authcontroller.js";

const authRoute=Router();

authRoute.post('/signup',signup);
authRoute.post('/login',login);
authRoute.post('/login',lougou);

export default authRoute;

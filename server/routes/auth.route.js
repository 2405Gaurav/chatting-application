import { Router } from "express";
import {login, signup} from "../controllers/authcontroller.js";

const authRoute=Router();

authRoute.post('/signup',signup);
authRoute.post('/login',login);
authRoute.post('/logout',verifyToken,logout);
authRoute.post('/streal',verifyToken,streal);

export default authRoute;

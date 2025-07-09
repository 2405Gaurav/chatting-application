import { Router } from "express";
import {login, signup,getuserInfo} from "../controllers/authcontroller.js";
import { verifyToken } from "../middlewares/Auth.js";

const authRoute=Router();

authRoute.post('/signup',signup);
authRoute.post('/login',login);
authRoute.get('/user-info', verifyToken, getuserInfo);


export default authRoute;

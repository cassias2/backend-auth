import CryptoJS from "crypto-js";
import { config } from "dotenv";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import UserController from "./controllers/UserController";
import auth from "./middlewares/auth";
import prismaInstance from "./utils/prismaInstance";

const router = Router();
config();

// Generates the token
router.post("/login", async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      response.status(400).send("All fields are required!");
    }

    // Tries to find the user by its email
    const user = await prismaInstance.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return response.status(404).json({
        statusCode: 404,
        message: "Invalid credentials!",
      });
    }
    // TODO: Improve this technique
    const rawStoredPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.FRONT_END_SECRET_KEY || ""
    ).toString(CryptoJS.enc.Utf8);
    const rawPassword = CryptoJS.AES.decrypt(
      password,
      process.env.FRONT_END_SECRET_KEY || ""
    ).toString(CryptoJS.enc.Utf8);
    console.log({ rawPassword, rawStoredPassword });

    if (rawPassword === rawStoredPassword) {
      // Creates the token
      const token = jwt.sign(
        {
          userId: user.id,
          email,
        },
        process.env.TOKEN_KEY || "",
        {
          expiresIn: "2h",
        }
      );

      response.setHeader("access-token", token);
      return response.status(201).json({
        token,
      });
    }

    return response.status(401).json({
      statusCode: 401,
      message: "Invalid credentials",
    });
  } catch (e) {
    console.error(e);
    return response.status(400).send();
  }
});

// Creates a user (Must be out of authentication middleware)
router.post("/user", UserController.store);

// TODO: Insert here the authentication middleware
// Auth middleware
router.use(auth);

router.get("/user", UserController.index);
router.get("/user/:id", UserController.show);
router.patch("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);

export default router;

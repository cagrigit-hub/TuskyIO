import { Password } from "./../services/password";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "@tm-cakitomakito/common";
import { BadRequestError } from "@tm-cakitomakito/common";
import pclient from "../services/pclient";
const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUserQuery = await pclient.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const existingUser = existingUserQuery.rows[0];
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    const hashed = await Password.toHash(password);
    const userQuery = await pclient.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashed]
    );
    const user = userQuery.rows[0];
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };

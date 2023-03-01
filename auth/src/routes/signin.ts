import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@tm-cakitomakito/common";
import { BadRequestError } from "@tm-cakitomakito/common";
import jwt from "jsonwebtoken";
import pclient from "../services/pclient";

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUserQuery = await pclient.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const existingUser = existingUserQuery.rows[0];
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    // generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY as string
    );
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };

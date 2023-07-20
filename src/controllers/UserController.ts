import { Request, Response } from "express";
import prismaInstance from "../utils/prismaInstance";

class UserController {
  async store(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;
      console.log({ name });
      if (name == null || email == null) {
        return response.status(400).send({
          statusCode: 400,
          message: "Some fields are invalid or missing!",
        });
      }

      // Check whether email is unique
      const userExists = await prismaInstance.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists) {
        return response.status(400).json({
          statusCode: 400,
          message: "Current e-mail has already been taken!",
        });
      }

      // Creates the user
      const user = await prismaInstance.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      return response.status(201).json(user);
    } catch (e) {
      console.log(e);
      return response.status(400).send({
        statusCode: 400,
        message: "User could not be registered!",
      });
    }
  }

  async index(request: Request, response: Response) {
    try {
      const users = await prismaInstance.user.findMany();

      return response.status(200).send(users);
    } catch (e) {
      console.error(e);
      return response.status(404).send();
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const user = await prismaInstance.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      return response.status(200).send(user);
    } catch (e) {
      console.error(e);
      return response.status(404).send();
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;
      const { id } = request.params;

      if (name == null && password == null) {
        return response.status(400).send({
          statusCode: 400,
          message: "Some fields are invalid or missing!",
        });
      }

      // Checks whether the current e-mail is already taken (Conflict status code)
      // const userExists = await prismaInstance.user.findUnique({
      //   where: {
      //     email
      //   }
      // });

      // if (userExists) {
      //   return response.status(409).json({
      //     statusCode: 409,
      //     message: 'E-mail has already been taken'
      //   })
      // }

      // Updates the user, in case the data is valid
      const updatedUser = await prismaInstance.user.update({
        data: {
          name,
          email,
          password,
        },
        where: {
          id: Number(id),
        },
      });

      return response.status(200).json(updatedUser);
    } catch (e) {
      console.error(e);
      return response.status(400).send();
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await prismaInstance.user.delete({
        where: {
          id: Number(id),
        },
      });

      response.status(204).send();
    } catch (e) {
      response.status(404).send();
    }
  }
}

export default new UserController();

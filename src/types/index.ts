import { User } from "@prisma/client";

export interface UserDTO extends User {}

export interface ResponseDTO<T> {
  status: number;
  message: string;
  data: T;
}
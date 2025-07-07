import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import {  PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// const router = 
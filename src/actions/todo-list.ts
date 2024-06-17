"use server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { formDataToJSON } from "@/utils/common";
import form from "@/components/form";

const prisma = new PrismaClient();

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function getTodoList() {
  return await prisma.card.findMany();
}

export async function createdCard(state: State, payload: any) {
  try {
    const id = await prisma.card.create({
      data: payload,
    });
    console.log(id);
    return {
      message: null,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }
}

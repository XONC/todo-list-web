"use server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { formDataToJSON } from "@/utils/common";
import form from "@/components/form";
import { useMappingDB } from "@/components/hooks/commonHooks";
import type { DBResponse } from "@/types/commonType";

const prisma = new PrismaClient();

/**
 * 返回todoList
 * @param state
 * @param payload
 */
export async function fetchTodoList(payload: any) {
  return useMappingDB(
    async () =>
      await prisma.card.findMany({
        where: {
          status: payload.status,
        },
      }),
  );
}

/**
 * 创建card
 * @param state
 * @param payload
 */
export async function createdCard(
  state: DBResponse<string | null>,
  payload: any,
) {
  return useMappingDB(async () => {
    const res = await prisma.card.create({
      data: payload,
    });
    return res.uuid;
  });
}

/**
 * 更新卡片
 * @param payload
 */
export async function updateCard(payload: any) {
  const id = payload.id;
  delete payload.id;
  return useMappingDB(async () => {
    const res = await prisma.card.update({
      where: {
        id: id,
      },
      data: payload,
    });
    return res.uuid;
  });
}

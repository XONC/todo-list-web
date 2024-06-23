import { ExportError } from "next/dist/export";
import { useFormState } from "react-dom";
import { createdCard } from "@/actions/todo-list";
import type { DBResponse } from "@/types/commonType";

export function useEmit<T>(props: T) {
  /**
   * 事件
   * @param name
   * @param params
   */
  return (name: keyof T, params?: unknown) => {
    if (props[name] && typeof props[name] === "function") {
      (props[name] as Function)(params);
    }
  };
}

export const initialState = <T>(): DBResponse<T | null> => ({
  code: 200,
  data: null,
  message: "成功",
});

/**
 * 校验是否通过
 * @param state
 */
export function isVerifyIsSuccess(state: Omit<DBResponse<null>, "data">) {
  if (state.code !== 200) {
    console.error(state.message);
  }
  return state.code === 200;
}

/**
 * 映射数据库
 * @param callback
 */
export async function useMappingDB<T>(
  callback: () => Promise<T>,
): Promise<DBResponse<T | null>> {
  const handler = useHandler();
  try {
    const res = await callback();
    return handler.success(res);
  } catch (e) {
    return handler.fail(e as Error);
  }
}

/**
 * 处理错误
 */
export function useHandler() {
  /**
   * 失败的处理函数
   */
  function fail(msg?: string | Error): DBResponse<null> {
    return {
      code: 500,
      data: null,
      message: msg ? (typeof msg === "string" ? msg : msg.message) : "失败",
    };
  }

  /**
   * 成功的处理函数
   */
  function success<T>(data: T): DBResponse<T> {
    return {
      code: 200,
      data: data,
      message: "成功",
    };
  }

  return {
    success,
    fail,
  };
}

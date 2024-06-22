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

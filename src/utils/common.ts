export const getStatusColorObj = (status: number) => {
  const colorObj = {
    color: "",
    className: "",
    style: "",
  };
  switch (status) {
    case 0:
      return {
        color: "#dad7cd",
        className: "",
        style: "",
      };
  }
};

/**
 * 获取两个值中的真值，如果两个都不是真值，则返回null，如果两个都是真值，返回第二个值
 * @param value
 * @param value1
 */
export const getTureValue = <T, M>(value: T, value1: M) => {
  if (!!value1) {
    return value1;
  } else if (!!value) {
    return value;
  } else {
    return null;
  }
};

/**
 * 组装表单参数
 * @param obj
 */
export const getFormData = (
  obj: object,
  method: "get" | "post" | "GET" | "POST",
) => {
  const form =
    method.toLowerCase() === "get" ? new URLSearchParams() : new FormData();
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    form.append(key, obj[key]);
  });
  return method.toLowerCase() === "get" ? form.toString() : form;
};

/**
 * 表单转换为json参数
 * @param formData
 */
export const formDataToJSON = (formData: FormData) => {
  const payload = {};

  for (const key in Array.from(formData.keys())) {
    // @ts-ignore
    payload[key] = formData.get(key);
  }
  console.log(payload);
  return payload;
};

/**
 * 合并类名
 * @param arg
 */
export const classNameMarge = (
  arg: Array<string | undefined> | Record<string, boolean | undefined>,
) => {
  if (Array.isArray(arg)) {
    return arg.filter((item) => typeof item === "string" && !!item).join(" ");
  } else {
    let str = "";
    Object.keys(arg).forEach((key) => {
      if (arg[key]) {
        str += key;
      }
    });
    return str;
  }
};

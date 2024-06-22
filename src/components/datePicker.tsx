"use client";
import { classNameMarge } from "@/utils/common";
import Input from "@/components/input";
import DatePicker from "@/components/datePicker";
import Popover from "@/components/popover";
import { createRef, useEffect, useState } from "react";
import ImageIcon from "@/components/imageIcon";
import * as repl from "repl";
import { now } from "mongodb/src/utils";

type Common = {
  type: "month" | "year" | "date" | "timestamp";
  valueFormatter:
    | "YYYY"
    | "YYYY-MM"
    | "YYYY-MM-DD"
    | "YYYY-MM-DD hh"
    | "YYYY-MM-DD hh:mm"
    | "YYYY-MM-DD hh:mm:ss";
  onChange: (val: string) => void;
};

type Props = {
  value: string;
} & Common;

type Calendar = {
  show: boolean;
} & Common;
// 初始年份
const primeYear = 1970;
const formatterTag = ["YYYY", "MM", "DD", "hh", "mm", "ss"];
/**
 * 日历组件
 * @param props
 * @constructor
 */
function Calendar(props: Calendar) {
  const [isMounted, setIsMounted] = useState(false);
  const [dateSpans, setDateSpans] = useState<number[]>([]);
  const [currentValue, setCurrentValue] = useState(0);
  // 当type为year 需要用页码去控制年份，一页9个年份
  const [pageNumber, setPageNumber] = useState(0);
  // 当前年份
  const [tagYear, setTagYear] = useState(new Date().getFullYear());
  // 当前月份
  const [tagMonth, setTagMonth] = useState(add0(new Date().getMonth() + 1));
  // 当前天数
  const [tagDay, setTagDay] = useState(add0(new Date().getDate()));

  useEffect(() => {
    if (!isMounted) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if (props.type === "year") {
        getYearSpan(year);

        changeValue(year);
      } else if (props.type === "month") {
        emitChangeValue(month);

        getMonthSpan(month);
      } else if (props.type === "date") {
        getDaySpan(day);

        changeValue(day);
      }
    } else {
      setIsMounted(true);
    }
  }, []);

  /**
   * 选中ui
   * @param span
   */
  function clickSpan(span: number) {
    changeValue(span);
  }

  /**
   * 统一处理ui的展示值
   * @param value
   */
  function changeValue(value: number) {
    /**
     * 对月份和年份进行初始化
     */
    if (props.type === "year") {
      setTagYear(value);
      // 当值改变时，需要加页码置为初始值
      setPageNumber(0);
    } else if (props.type === "month") {
      setTagMonth(add0(value));
    } else if (props.type === "date") {
      setTagDay(add0(value));
    }

    emitChangeValue(value);
    // 设置ui使用的值
    setCurrentValue(value);
  }

  /**
   * 切换顶部年月份
   * @param direction
   */
  function onChangeWrp(direction: 0 | 1) {
    const index = currentValue % 9;
    const anchor = dateSpans.at(index === 0 ? -1 : index - 1) as number;
    if (props.type === "year") {
      if (direction === 0) {
        getYearSpan(anchor - 9);
        setPageNumber(pageNumber - 1);
      } else {
        getYearSpan(anchor + 9);
        setPageNumber(pageNumber + 1);
      }
    } else if (props.type === "month") {
      onChangeYearWrp(direction);
    } else if (props.type === "date") {
      onChangeMonthWrp(direction);
    }
  }

  /**
   * 切换年
   * @param direction
   * @param _year
   */
  function onChangeYearWrp(direction: 0 | 1, _year?: number) {
    if (direction === 0) {
      setTagYear(tagYear - 1);
      emitChangeValue(tagYear - 1, "year");
    } else {
      setTagYear(tagYear + 1);
      emitChangeValue(tagYear + 1, "year");
    }

    if (props.type === "date" || props.type === "timestamp") {
      getDaySpan();
    }
  }

  /**
   * 设置月份
   * @param direction
   * @param _year
   */
  function onChangeMonthWrp(direction: 0 | 1, _year?: number) {
    let month;
    if (direction === 0) {
      if (parseInt(tagMonth) - 1 < 1) {
        month = 12;
        setTagYear(tagYear - 1);
      } else {
        month = parseInt(tagMonth) - 1;
      }
      setTagMonth(add0(month));
      emitChangeValue(month, "month");
    } else {
      if (parseInt(tagMonth) + 1 > 12) {
        month = 1;
        setTagYear(tagYear + 1);
      } else {
        month = parseInt(tagMonth) + 1;
      }
      setTagMonth(add0(month));
      emitChangeValue(month, "month");
    }

    if (props.type === "date" || props.type === "timestamp") {
      getDaySpan();
    }
  }

  /**
   * 获取当前时间的字符串，之后容易进行替换
   */
  function getDateObj(_value?: number, _type?: Props["type"]) {
    const date = new Date();
    const type = _type || props.type;
    const value = _value ? add0(_value) : add0(currentValue);
    return {
      y: type === "year" ? value : add0(tagYear),
      m: type === "month" ? value : tagMonth,
      d: type === "date" ? value : tagDay,
      h: add0(date.getHours()),
      min: add0(date.getMinutes()),
      s: add0(date.getSeconds()),
    };
  }

  /**
   * 补0
   * @param value
   */
  function add0(value: number | string) {
    return String(value).length < 2 ? "0" + String(value) : String(value);
  }

  /**
   * 对输出的值进行格式化
   * @param value
   * @param _type
   */
  function emitChangeValue(value: number, _type?: Props["type"]) {
    const type = _type || props.type;
    let result = "";
    const dateObj = getDateObj(value, type);
    //@ts-ignore
    const index = formatterTag.findIndex(
      (str) => props.valueFormatter.indexOf(str) === -1,
    );
    const tagArr = index === -1 ? formatterTag : formatterTag.slice(0, index);
    result = tagArr.reduce((prev, item, index, self) => {
      switch (item) {
        case "YYYY":
          prev += dateObj.y;
          break;
        case "MM":
          prev += "-" + dateObj.m;
          break;
        case "DD":
          prev += "-" + dateObj.d;
          break;
        case "hh":
          prev += " " + dateObj.h;
          break;
        case "mm":
          prev += ":" + dateObj.min;
          break;
        case "ss":
          prev += ":" + dateObj.s;
          break;
      }
      return prev;
    }, "");
    props.onChange(result);
  }

  /**
   * 年份的ui
   * @param year
   */
  function getYearSpan(year: number) {
    let arr: Array<number> = new Array(9);
    // 获取当前年份在9宫格中的位置
    // 当num = 0 时，在最后一位
    const num = (year - primeYear) % 9;

    for (let i = 0; i < arr.length; i++) {
      if (num === 0) {
        arr[i] = year - (8 - i);
      } else {
        arr[i] = year - (num - 1 - i);
      }
    }

    setDateSpans(arr);
  }

  /**
   * 月份的ui
   * @param month
   */
  function getMonthSpan(month?: number) {
    setDateSpans([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }

  /**
   * 日期的ui
   * @param date
   */
  function getDaySpan(date?: number) {
    const arr = [];
    const dateObj = getDateObj();
    const days = new Date(
      parseInt(dateObj.y),
      parseInt(dateObj.m) + 1,
      0,
    ).getDate();
    for (let i = 0; i < days; i++) {
      arr.push(i + 1);
    }
    setDateSpans(arr);
  }

  return (
    <div className={classNameMarge(["calender", props.type])}>
      <div className={classNameMarge(["calender__arrow"])}>
        <div className={"arrow-box"}>
          <ImageIcon
            style={{
              fontWeight: "bold",
              display:
                props.type === "year" || props.type === "month"
                  ? "none"
                  : "block",
            }}
            size={12}
            icon={"icon-cemianzhankai"}
            onClick={() => onChangeYearWrp(0)}
          ></ImageIcon>
          <ImageIcon
            size={20}
            icon={"icon-zuojiantou"}
            onClick={() => onChangeWrp(0)}
          ></ImageIcon>
        </div>
        <span className={"text"}>
          {props.type === "year" || props.type === "month"
            ? tagYear
            : tagYear + "-" + tagMonth}
        </span>
        <div className={"arrow-box"}>
          <ImageIcon
            size={20}
            icon={"icon-youjiantou"}
            onClick={() => onChangeWrp(1)}
          ></ImageIcon>
          <ImageIcon
            style={{
              fontWeight: "bold",
              display:
                props.type === "year" || props.type === "month"
                  ? "none"
                  : "block",
            }}
            size={12}
            icon={"icon-cemianzhankai"}
            className={"is-reversal"}
            onClick={() => onChangeYearWrp(1)}
          ></ImageIcon>
        </div>
      </div>
      <div className={classNameMarge(["calender__main"])}>
        {dateSpans.map((item) => {
          return (
            <div
              style={{
                width:
                  props.type === "year"
                    ? "33.33%"
                    : props.type === "month"
                      ? "25%"
                      : props.type === "date"
                        ? "16.66%"
                        : "100%",
              }}
              key={item}
              className={classNameMarge([
                "calender__item",
                currentValue === item ? "is-select" : "",
              ])}
            >
              <span onClick={() => clickSpan(item)}>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default (props: Props) => {
  const inputRef = createRef<HTMLDivElement>();
  const [showPopover, setShowPopover] = useState(false);
  return (
    <>
      <div
        ref={inputRef}
        className={classNameMarge(["date-picker"])}
        onClick={() => setShowPopover(!showPopover)}
      >
        <Input readOnly value={props.value}></Input>
      </div>
      <Popover show={showPopover} parentRef={inputRef}>
        <Calendar
          show={showPopover}
          valueFormatter={props.valueFormatter}
          type={props.type}
          onChange={(val) => props.onChange(val)}
        />
      </Popover>
    </>
  );
};

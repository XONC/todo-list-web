"use client";
import { classNameMarge } from "@/utils/common";
import Input from "@/components/input";
import DatePicker from "@/components/datePicker";
import Popover from "@/components/popover";
import { createRef, useEffect, useState } from "react";
import ImageIcon from "@/components/imageIcon";
import * as repl from "repl";
import { now } from "mongodb/src/utils";
import { useEmit } from "@/components/hooks/commonHooks";

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
  onClick?: (val: number) => void;
};

type Props = {
  value: string;
} & Common;

type Calendar = {
  show: boolean;
} & Common;

type DateSpan = {
  name: number;
  code: number;
  type: string;
  year?: number;
  month?: number;
  reDraw?: boolean;
  hiddenMark?: boolean;
};
// 初始年份
const primeYear = 1970;
const formatterTag = ["YYYY", "MM", "DD", "hh", "mm", "ss"];
/**
 * 日历组件
 * @param props
 * @constructor
 */
function Calendar(props: Calendar) {
  const emit = useEmit<Calendar>(props);
  const weeks = ["一", "二", "三", "四", "五", "六", "日"];
  const [isMounted, setIsMounted] = useState(false);
  const [dateSpans, setDateSpans] = useState<Array<DateSpan>>([]);
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
        getMonthSpan(month);

        changeValue(month);
      } else if (props.type === "date") {
        getDaySpan({});

        changeValue(day);
      }
    } else {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    emitChangeValue();
  }, [tagYear, tagMonth, tagDay]);

  /**
   * 选中ui
   * @param span
   */
  function clickSpan(span: number, spanItem: DateSpan) {
    if (spanItem.reDraw) {
      if (props.type === "date") {
        getDaySpan({
          year: spanItem.year,
          month: spanItem.month,
        });
        if (spanItem.month) {
          setTagMonth(add0(spanItem.month));
        }
        if (spanItem.year) {
          setTagYear(spanItem.year);
        }
      } else if (props.type === "month") {
        getMonthSpan();
      } else if (props.type === "year") {
        getYearSpan(spanItem.year as number);
      }
    }
    emit("onClick", span);
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

    // 设置ui使用的值
    setCurrentValue(value);
  }

  /**
   * 切换顶部年月份
   * @param direction
   */
  function onChangeWrp(direction: 0 | 1) {
    const index = currentValue % 9;
    const anchor = dateSpans.at(index === 0 ? -1 : index - 1)?.code as number;
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
    const year = direction === 0 ? tagYear - 1 : tagYear + 1;

    if (props.type === "date" || props.type === "timestamp") {
      getDaySpan({ year });
    }

    setTagYear(year);
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
    } else {
      if (parseInt(tagMonth) + 1 > 12) {
        month = 1;
        setTagYear(tagYear + 1);
      } else {
        month = parseInt(tagMonth) + 1;
      }
    }

    if (props.type === "date" || props.type === "timestamp") {
      getDaySpan({ month });
    }

    setTagMonth(add0(month));
  }

  /**
   * 获取当前时间的字符串，之后容易进行替换
   */
  function getDateObj() {
    const date = new Date();
    return {
      y: add0(tagYear),
      m: tagMonth,
      d: tagDay,
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
   */
  function emitChangeValue() {
    let result = "";
    const dateObj = getDateObj();
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
    emit("onChange", result);
  }

  /**
   * 年份的ui
   * @param year
   */
  function getYearSpan(year: number) {
    let arr: Array<DateSpan> = new Array(9);
    // 获取当前年份在9宫格中的位置
    // 当num = 0 时，在最后一位
    const num = (year - primeYear) % 9;

    for (let i = 0; i < arr.length; i++) {
      if (num === 0) {
        arr[i] = {
          code: year - (8 - i),
          name: year - (8 - i),
          type: "year",
        };
      } else {
        arr[i] = {
          code: year - (num - 1 - i),
          name: year - (num - 1 - i),
          type: "year",
        };
      }
    }

    setDateSpans(arr);
  }

  /**
   * 月份的ui
   * @param month
   */
  function getMonthSpan(month?: number) {
    let arr: DateSpan[] = [];

    setDateSpans(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => ({
        code: item,
        name: item,
        type: "month",
      })),
    );
  }

  /**
   * 日期的ui
   * @param date
   */
  function getDaySpan({ year, month }: { year?: number; month?: number }) {
    const arr: DateSpan[] = [];
    const dateObj = getDateObj();
    const nowYear = year || parseInt(dateObj.y);
    const nowMonth = month || parseInt(dateObj.m);
    // 当前月的最后一天
    const nowDate = new Date(nowYear, nowMonth, 0);
    // 上月的最后一天
    const prevDate = new Date(nowYear, nowMonth - 1, 0);
    const days = nowDate.getDate();
    const week = nowDate.getDay();
    // 处理天数时，需要掐头去尾
    // 如果上个月是周日
    const prevDay = prevDate.getDate();
    const prevWeek = prevDate.getDay();
    if (prevWeek) {
      for (let i = 0; i < prevWeek; i++) {
        console.log();
        arr.push({
          name: prevDay - (prevWeek - i) + 1,
          code: prevDay - (prevWeek - i) + 1,
          year: nowYear,
          month: nowMonth - 1,
          type: "prev-day",
          reDraw: true,
          hiddenMark: true,
        });
      }
    }
    for (let i = 0; i < days; i++) {
      arr.push({
        name: i + 1,
        code: i + 1,
        type: "day",
      });
    }
    if (week) {
      console.log("days % 7", week);
      for (let i = 0; i < 7 - week; i++) {
        arr.push({
          name: i + 1,
          code: i + 1,
          year: nowYear,
          month: nowMonth + 1,
          type: "next-day",
          reDraw: true,
          hiddenMark: true,
        });
      }
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
        {props.type === "date" &&
          weeks.map((item) => {
            return (
              <div
                key={item}
                className={classNameMarge(["calender__item", "week"])}
                style={{
                  width: "14.28%",
                }}
              >
                {<span>{item}</span>}
              </div>
            );
          })}
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
                        ? "14.28%"
                        : "100%",
              }}
              key={item.type + item.code}
              className={classNameMarge([
                "calender__item",
                currentValue === item.code && !item.hiddenMark
                  ? "is-select"
                  : "",
                item.hiddenMark ? "hidden-mark" : "",
              ])}
            >
              <span onClick={() => clickSpan(item.code, item)}>
                {item.code}
              </span>
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

  function onClick(val: number) {
    setShowPopover(false);
  }
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
          onClick={(val) => onClick(val)}
        />
      </Popover>
    </>
  );
};

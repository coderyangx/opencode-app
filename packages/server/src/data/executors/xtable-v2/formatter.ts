export const formatters = [
  {
    // 多行文本
    columnType: 1,
    format: (val) => {
      if (Array.isArray(val)) {
        return val
          .map((item) => {
            if (item.type === "link") {
              return `[${item.value}](${item.link})`;
            }
            return item.value;
          })
          .join("");
      }
      return val;
    },
  },
  {
    // 数字
    columnType: 2,
  },
  {
    // 单选
    columnType: 3,
    format: (val, config) => {
      if (!val) {
        return null;
      }
      return val;
    },
  },
  {
    columnType: 4, // people
  },
  {
    // 多选
    columnType: 5,
  },
  {
    // 附件
    columnType: 6,
  },
  {
    // 日期
    columnType: 7,
  },
  {
    // 货币
    columnType: 8,
  },
  {
    // 公式
    columnType: 9,
  },
];

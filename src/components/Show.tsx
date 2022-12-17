import styles from "styles/app.module.scss";
import Chart from "./echarts";
import Clock from "./echarts/Clock";
const Show: React.FC = () => {
  const option = {
    title: {
      text: "近七天休息情况",
    },
    tooltip: {},
    legend: {
      data: ["销量"],
    },
    xAxis: {
      data: ["day1", "day2", "day3", "day4", "day5", "day6", "day7"],
      axisLabel: {
        interval: 0, //横轴信息全部显示
        rotate: -30, //-30度角倾斜显示
      },
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [22, 20, 36, 10, 10, 20, 30],
        label: {
          show: true,
          position: "top",
          textStyle: {
            fontSize: "10px",
            color: "#fff",
          },
        },

        itemStyle: {
          normal: {
            //这里是重点
            color: function (params: any) {
              //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
              var colorList = [
                "rgb(9, 200, 105)",
                "rgb(9, 200, 105)",
                "rgb(9, 200, 105)",
                "rgb(9, 200, 105)",
              ];
              if (params.dataIndex >= colorList.length) {
                params.dataIndex = params.dataIndex - colorList.length;
              }
              return colorList[params.dataIndex];
            },
          },
        },
      },
    ],
  };

  return (
    <div className={styles.right}>
      <Clock />
      <Chart option={option} />
    </div>
  );
};
export default Show;

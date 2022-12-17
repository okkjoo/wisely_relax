import styles from "styles/app.module.scss";
import Chart from "./echarts";
import Clock from "./echarts/Clock";
interface IShow {
  thing2cnt: Map<string, number>;
}
const Show: React.FC<IShow> = ({ thing2cnt }) => {
  const Xdata = [...thing2cnt.keys()];
  const Ydata = [...thing2cnt.values()];
  const option = {
    title: {
      text: "do something",
    },
    tooltip: {},
    legend: {
      data: ["次数"],
    },
    xAxis: {
      data: Xdata,
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
    yAxis: {
      show: false,
    },
    series: [
      {
        name: "次数",
        type: "bar",
        data: Ydata,
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

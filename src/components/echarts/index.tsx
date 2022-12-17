import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

echarts.use([GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

const Chart: React.FC<any> = ({ option, getChart }) => {
  const chartRef: React.RefObject<HTMLDivElement> = useRef(null);
  useEffect(() => {
    const myChart = echarts.init(chartRef.current!);
    getChart && getChart(myChart);
    myChart.setOption(option);
  }, [option]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "50%",
      }}
    ></div>
  );
};
export default Chart;

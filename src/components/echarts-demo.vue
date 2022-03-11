<script setup>
import { ref, onMounted } from "vue"
import { init } from "echarts"
import axios from "axios"

const getData = () => {
  return axios.get("/services/v1/lineChart").then((res) => {
    const { contract, diff, prcVwap, tradeDate } = res.data
    return {
      contract,
      diff,
      prcVwap,
      tradeDate,
    }
  })
}

const getChartOption = () => {
  return getData().then(({ contract, prcVwap, diff, tradeDate }) => {
    const option = {
      legend: {
        data: ["方坯", "螺纹钢", "价差"],
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let con = params[0]
          let prc = params[1]
          let diff = params[2] 
          return `<div style="    display: flex;
    flex-direction: column;
    align-items: flex-start;">
              <div style="align-self: center;
    margin-bottom: 4px;
    font-size: 16px;">${con.axisValue}</div>
              <div>${prc.marker} 螺纹钢: ${prc.value}</div>
              <div>${con.marker} 方坯 : ${con.value}</div>
              <div>${diff.marker} 价差 : ${diff.value}</div>
             </div>
             `
        },
      },
      xAxis: [
        {
          type: "category",
          data: tradeDate,
        },
      ],
      yAxis: [
        {
          type: "value",
          scale: true,
          splitArea: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: "方坯",
          type: "line",
          data: contract,
        },
        {
          name: "螺纹钢",
          type: "line",
          data: prcVwap,
        },
        {
          name: "价差",
          type: "line",
          data: diff,
        },
      ],
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
          minValueSpan: 10,
        },
        {
          show: true,
          type: "slider",
          bottom: 60,
          start: 0,
          end: 100,
          minValueSpan: 10,
        },
      ],
    }
    return option
  })
}

const initEcharts = async () => {
  const chartDom = document.querySelector(".echarts-demo")
  const myChart = init(chartDom)
  const option = await getChartOption()
  option && myChart.setOption(option)
}

onMounted(initEcharts)

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <div class="echarts-demo" style="height: 400px"></div>
</template>

<style scoped></style>

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
        data: ["方坯", "螺纹钢"],
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let con = params[0]
          let prc = params[1]
          let diffmarker = `<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;\"></span>`
          return `<div style="    display: flex;
    flex-direction: column;
    align-items: flex-start;">
              <div>${prc.marker} 螺纹钢: ${prc.value}</div>
              <div>${con.marker} 方坯 : ${con.value}</div>
              <div>${diffmarker} 价差 : ${prc.value - con.value}</div>
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

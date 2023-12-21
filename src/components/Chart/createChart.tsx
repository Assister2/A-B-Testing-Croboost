import React, { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { loadTokens } from "../../utils"
import Spinner from "../Spinner"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartOptions = (chartTitle: string) => {
  return {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 3,
      },
    },
    
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: 'start',
        display: false, 
      },
      title: {
        display: false,
        text: chartTitle, // Dynamic chart title
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'gray', // Set the color of the x-axis grid lines
          borderWidth: 10, // Set the width of the x-axis grid lines
        },
        categoryPercentage: 0.8,
        barPercentage: 0.8,
        min: 0,
        // max: 100,
        ticks: {
          beginAtZero: true,
          callback: function(value) {
            return `${value}%`;
          }
        }

      },
      y: {
        grid: {
          color: 'gray',
          borderWidth: 10,
           // Set the color of the y-axis grid lines
        },
        ticks: {
          display: false, // Hide the y-axis labels
        },
        categoryPercentage: 0.8,
        barPercentage: 0.8,
      },
    },
    labels: {
      display: false,
    },
  }
}

export interface CreateProps {
    deviceTypes: string[],
    device: string,
    setDevice : React.Dispatch<React.SetStateAction<string>>,
    timeFrames: string[],
    time: string,
    setTime : React.Dispatch<React.SetStateAction<string>>,
    data: number[],
    title: string,
    dataKey: string[]
}

const CreateChart = ({deviceTypes, device, setDevice, timeFrames, time, setTime, data, title, dataKey} : CreateProps) => {
    console.log("Title",title, device, time, data)
    const colors = ["#A9E0F1", "#F5D6FF"]
    const borderColors = ["#1686AA", "#7E269A"]
    const  chartData = {
      labels: [title],
      datasets: data.map((d, i) => ({
          label: dataKey[i],
          data: [d],
          backgroundColor: colors[i],
          borderColor: borderColors[i], 
      })),
    }
  const SelectDeviceOption = (option: string) => {
    setDevice(option)
  }
  const SelectTimeOption = (option: string) => {
    setTime(option)
  }
  const variantName= dataKey[0];
  const compareValue = data[0]<data[1];
  const options_device = deviceTypes.map((deviceType) => {
  return (
    <option value={deviceType} key={deviceType} style={{ backgroundColor: "#232426" }}>{deviceType}</option>
    );
  });
  const timeFrame = {
    data_all_time: "All Time",
    data_days_001: "1 Day",
    data_days_007: "7 Days",
    data_days_030: "30 Days",
    data_days_090: "90 Days"
  };
  const options_time = Object.keys(timeFrame).map((key) => {
    return (
      <option value={key} key={key} style={{ backgroundColor: "#232426" }}>{timeFrame[key]}</option>
    );
  });
  return (
    <div className="bg-[#00000042] p-[26.6px] w-full flex flex-col gap-[26.5px] rounded-[7.746px]">
      <section className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[19.875px] font-bold text-white leading-6">{title}</h1>
          <h3 className="text-[14px] leading-[16.8px] text-white">{variantName} has a { compareValue == true ? "higher" : "lower"} {title == "Conversion Rate" ? "conversion":
          title == "Bounce Rate" ? "bounce rate" : "engagement" }</h3>
        </div>
        <div className="flex flex-row gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <h5 className="text-[#FFFFFF]/50 text-[12px] font-bold leading-[120%]">Device</h5>
            <select id={`${title} Device`} 
              onChange={(event) => SelectDeviceOption(event.target.value)} 
              className="w-[126px] h-[31px] rounded-[4px] text-[#FFFFFF]/[0.7] text-[12px] leading-[14.4px] font-medium bg-[#FFFFFF]/[0.16] p-2 shadow-[0_4px_15px_0px_rgba(0,0,0,0.06)]" placeholder="All Devices">
              {options_device}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="text-[#FFFFFF]/50 text-[12px] font-bold leading-[120%]">Time Period</h5>
            <select id={`${title} Time`} 
              onChange={(event) => SelectTimeOption(event.target.value)} 
              className="w-[126px] h-[31px] rounded-[4px] bg-[#FFFFFF]/[0.16] text-[#FFFFFF]/[0.7] text-[12px] leading-[14.4px] font-medium  p-2 shadow-[0_4px_15px_0px_rgba(0,0,0,0.06)]" placeholder="Last 30Days">
              {options_time}
            </select>
          </div>
        </div>
      </section>
      
      <Bar
        options={chartOptions(title)}
        data={chartData}
        width={4}
        height={1}
        className="bg-[#232426] rounded-[5.836px] pt-[15px]"
      />
      <h5 className="text-[#cfd2d3] text-[12px] mt-[26.5px]">Data last synced 2 hours ago</h5>
    </div>
  )
}


export default CreateChart

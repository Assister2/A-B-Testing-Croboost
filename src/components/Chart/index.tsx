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
import { getChartData } from "../../client/abtest"
import DotLoader  from "react-spinners/ClipLoader";

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
        max: 100,
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
    }
  }
}

const createChart = (data: number[], title: string, dataKey: string[]) => {
  const colors = ["#A9E0F1", "#F5D6FF"]
  const borderColors = ["#1686AA", "#7E269A"]
  const chartData = {
    labels: ["Variant"],
    datasets: data.map((d, i) => ({
      label: dataKey[i],
      data: [d], // Convert to percentage
      backgroundColor: colors[i],
      borderColor: borderColors[i], 
    })),
  }

  return (
    <div className="bg-[#00000042] p-[26.6px]">
      <h1 className="text-[19.875px] font-bold text-white leading-6 mb-[26.6px]">{title}</h1>
      <Bar
        options={chartOptions(title)}
        data={chartData}
        width={4}
        height={1}
      />
      <h5 className="text-[#cfd2d3] text-[12px] mt-[26.5px]">Data last synced 2 hours ago</h5>
    </div>
  )
}

export interface ChartProps {
  id: string
}

const Chart = ({ id }: ChartProps) => {
  // console.log(id)
  const [notification, setNotification] = useState(null)
  const [allData, setAllData] = useState([])
  const [chartData, setChartData] = useState([])
  const [engagementData, setEngagementData] = useState([])
  const [bounceData, setBounceData] = useState([])
  const [syncDate, setSyncDate] = useState();
  const [loading, setLoading] = React.useState(true);

  const showNotification = (message: any) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const closeNotification = () => {
    setNotification(null)
  }

  useEffect(() => {
    const tokens = loadTokens()
    if (tokens) {
      getChartData(tokens.id_token, id)
        .then((tests) => {
          const { data } = tests
          const parsedData = JSON.parse(data)
          // setSyncDate(test[0]*1000);
          const filteredArray = parsedData.filter(
            (item: any) => item.Variant !== "Overall"
          )
          setAllData(filteredArray)
          setLoading(false);
          console.log(filteredArray)
        })
        .catch((err) => {
          console.log(err)
          showNotification("Data not Found")
        })
    } else {
      window.location.href = "/login"
    }
  }, [id])

  useEffect(() => {
    if (allData.length > 0) {
      const conversionData: any = allData.map((data: any) =>
        Number(data.Average_Conversion_Rate.replace("%",""))
      )
      console.log(conversionData)
      setChartData(conversionData)
      const engagementData: any = allData.map((data: any) =>
        Number(data.Bounce_Rate.replace("%",""))
      )
      setEngagementData(engagementData)
      const bounceData: any = allData.map((data: any) =>
        Number(data.Average_Event_Count)
      )
      setBounceData(bounceData)
    }
  }, [allData])

  return (
    <div className="p-5 bg-main min-w-screen min-h-screen">
        { loading ? (
              <div className="flex justify-center items-center h-[100vh]">
                <DotLoader  
                color="red"
                />
              </div>
              )
              :
              <>
                {notification && (
                  <div
                    id="toast-warning"
                    className="absolute top-4 right-4 w-80 p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark-bg-gray-800 flex items-center"
                    role="alert"
                  >
                    <div className="w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark-bg-orange-700 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-sm font-normal">{notification}</div>
                    <button
                      type="button"
                      onClick={closeNotification}
                      className="ml-auto -mx-1.5 -my-1.5 p-1.5 hover-bg-gray-100 rounded-full focus-ring-2 focus-ring-gray-300 inline-flex items-center justify-center h-8 w-8 dark-bg-gray-800 dark-hover-bg-gray-700"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-x-[10px] gap-y-[25px]">
                  {createChart(chartData, "Conversion Rate", [
                    "Original",
                    "Variant",
                  ])}
                  {createChart(engagementData, "Bounce Rate", [
                    "Original",
                    "Variant",
                  ])}
                  {createChart(bounceData, "Engagement", [
                    "Original",
                    "Variant",
                  ])}
                </div>
              </>
        }
    </div>
  )
}

export default Chart

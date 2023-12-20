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
import Chart from "../Chart"
import { Bar } from "react-chartjs-2"
import InsightsItem from "./item"
import { loadTokens, Tokens, resetTokens} from "../../utils"
import { ABTest, getChartData, getInsightsData, getInsightsNames, getTests, getUserData } from "../../client/abtest"
import {
  updateTest,
} from "../../client/abtest"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import Spinner from "../Spinner"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartOptions = (chartTitle: string) => {
  return {
    indexAxis: "x" as const,
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
      y: {
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
      x: {
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
export interface ChartProps {
  id: string
}

export default function App() {
  // console.log(id)
  const [notification, setNotification] = useState(null)
  const [allData, setAllData] = useState([])
  const [nameData, setNameData] = useState([])
  const [userId, setUserId] = useState();
  const [loading, setLoading] = React.useState(true);
  const [timeFrames, setTimeFrames] = React.useState([]);
  const [deviceTypes, setDeviceTypes] = React.useState([]);

  const [addTypeData, setAddTypeData] = React.useState([]);
  const [originalAddTypeData, setOriginalAddTypeData] = React.useState([]);
  const [addTypeDevice, setAddTypeDevice] = React.useState<string| undefined>("");
  const [addTypeTime, setAddTypeTime] = React.useState<string| undefined>("");

  const [sourceData, setSourceData] = React.useState([]);
  const [originalSourceData, setOriginalSourceData] = React.useState([]);
  const [sourceDevice, setSourceDevice] = React.useState<string| undefined>("");
  const [sourceTime, setSourceTime] = React.useState<string| undefined>("");
  
  const [sourceURLData, setSourceURLData] = React.useState([]);
  const [originalSourceURLData, setOriginalSourceURLData] = React.useState([]);
  const [sourceURLDevice, setSourceURLDevice] = React.useState<string| undefined>("");
  const [sourceURLTime, setSourceURLTime] = React.useState<string| undefined>("");
  
  const [stockTypeData, setStockTypeData] = React.useState([]);
  const [originalStockTypeData, setOriginalStockTypeData] = React.useState([]);
  const [stockTypeDevice, setStockTypeDevice] = React.useState<string| undefined>("");
  const [stockTypeTime, setStockTypeTime] = React.useState<string| undefined>("");
  
  const [sectionData, setSectionData] = React.useState([]);
  const [originalSectionData, setOriginalSectionData] = React.useState([]);
  const [sectionDevice, setSectionDevice] = React.useState<string| undefined>("");
  const [sectionTime, setSectionTime] = React.useState<string| undefined>("");
  
  const [internalReferralData, setInternalReferralData] = React.useState([]);
  const [originalInternalReferralData, setOriginalInternalReferralData] = React.useState([]);
  const [internalReferralDevice, setInternalReferralDevice] = React.useState<string| undefined>("");
  const [internalReferralTime, setInternalReferralTime] = React.useState<string| undefined>("");
  
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
      getTests(tokens.id_token)
        .then((tests: any) => {
          // console.log("test",tests, tests[0]["user_id"])
          setUserId(tests[0]["user_id"])
        })
        .catch((err) => {
          console.log("err",err)
        })
      getInsightsNames(tokens.id_token, "128c6645-93eb-4583-9c90-231e20cea7d5")
        .then((data) => {
          
          setNameData(data["insights"])
          // console.log("InsightNames",data["insights"], nameData)
          data["insights"].map((names) => {
            getInsightsData(tokens?.id_token, "128c6645-93eb-4583-9c90-231e20cea7d5", names["name"])
            .then((itemData) => {
              // console.log("Insight Data", itemData)
              switch(names["name"]){
                case "_add_type":
                  setOriginalAddTypeData(itemData)
                  break;
                case "_source":
                  setOriginalSourceData(itemData)
                  break;
                case "_sourceurl":
                  setOriginalSourceURLData(itemData)
                  break;
                case "_stock_type":
                  setOriginalStockTypeData(itemData)
                  break;
                case "_section_clicked":
                  setOriginalSectionData(itemData)
                  break;
                case "_internal_referral":
                  setOriginalInternalReferralData(itemData)
                  break;
              }
              const meta = itemData.meta
              const selected_timeframe = meta.timeframe_names[0]
              const selected_device = meta.device_names[0]
              setTimeFrames(meta.timeframe_names)
              setDeviceTypes(meta.device_names)
              const selected_timeframe_data = itemData[selected_timeframe]
              const selected_timeframe_and_device_data = selected_timeframe_data.filter(
                (item) => item.device == selected_device
              )
              switch(names["name"]){
                case "_add_type":
                  // console.log("ADD_TYPE",selected_timeframe_and_device_data);
                  setAddTypeDevice(selected_device)
                  setAddTypeTime(selected_timeframe)
                  const Data1: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setAddTypeData(Data1)
                  break;
                case "_source":
                  setSourceDevice(selected_device)
                  setSourceTime(selected_timeframe)
                  const Data2: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setSourceData(Data2)
                  break;
                case "_sourceurl":
                  setSourceURLDevice(selected_device)
                  setSourceURLTime(selected_timeframe)
                  const Data3: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setSourceURLData(Data3)
                  break;
                case "_stock_type":
                  setStockTypeDevice(selected_device)
                  setStockTypeTime(selected_timeframe)
                  const Data4: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setStockTypeData(Data4)
                  break;
                case "_section_clicked":
                  setSectionDevice(selected_device)
                  setSectionTime(selected_timeframe)
                  const Data5: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setSectionData(Data5)
                  break;
                case "_internal_referral":
                  
                  setInternalReferralDevice(selected_device)
                  setInternalReferralTime(selected_timeframe)
                  const Data6: any = selected_timeframe_and_device_data.map((data: any) =>
                    Number(data.share*100)
                  )
                  setInternalReferralData(Data6)
                  break;
              }
              setLoading(false); 
            })
            .catch((err) => {
              console.log(err)
            })
         })
        })
        .catch((err) => {
            console.log(err)
        })

    } else {
      window.location.href = "/login"
    }
  }, [])

  useEffect(() => {
    if(addTypeDevice != "" || addTypeTime != ""){
      console.log("BEFORE", addTypeData)
      const addTypeData_Time = originalAddTypeData[addTypeTime]
      console.log("Change", addTypeData_Time, addTypeDevice, addTypeTime)
      if(addTypeData_Time != null && addTypeData_Time.length > 0){
        const addTypeData_Time_Device = addTypeData_Time.filter(
          (item) => item.device == addTypeDevice
        )
        console.log("addTypeDATA", addTypeData_Time_Device)
        const Data: any = addTypeData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setAddTypeData(Data)
      }
    }
  }, [addTypeDevice, addTypeTime])

  useEffect(() => {
    if(sourceDevice != "" || sourceTime != ""){
      const sourceData_Time = originalSourceData[sourceTime]
      if(sourceData_Time != null && sourceData_Time.length > 0){
        const sourceData_Time_Device = sourceData_Time.filter(
          (item) => item.device == sourceDevice
        )
        const Data: any = sourceData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setSourceData(Data)
      }
    }
  }, [sourceDevice, sourceTime])

  useEffect(() => {
    if(sourceURLDevice != "" || sourceURLTime != ""){
      const sourceURLData_Time = originalSourceURLData[sourceURLTime]
      if(sourceURLData_Time != null && sourceURLData_Time.length > 0){
        const sourceURLData_Time_Device = sourceURLData_Time.filter(
          (item) => item.device == sourceURLDevice
        )
        const Data: any = sourceURLData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setSourceURLData(Data)
      }
    }
  }, [sourceURLDevice, sourceURLTime])

  useEffect(() => {
    if(stockTypeDevice != "" || stockTypeTime != ""){
      const stockTypeData_Time = originalStockTypeData[stockTypeTime]
      if(stockTypeData_Time != null && stockTypeData_Time.length > 0){
        const stockTypeData_Time_Device = stockTypeData_Time.filter(
          (item) => item.device == sourceDevice
        )
        const Data: any = stockTypeData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setStockTypeData(Data)
      }
    }
  }, [stockTypeDevice, stockTypeTime])

  useEffect(() => {
    if(sectionDevice != "" || sectionTime != ""){
      const sectionData_Time = originalSectionData[sectionTime]
      if(sectionData_Time != null && sectionData_Time.length > 0){
        const sectionData_Time_Device = sectionData_Time.filter(
          (item) => item.device == sectionDevice
        )
        const Data: any = sectionData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setSectionData(Data)
      }
    }
  }, [sectionDevice, sectionTime])

  useEffect(() => {
    if(internalReferralDevice != "" || internalReferralTime != ""){
      const internalReferralData_Time = originalInternalReferralData[internalReferralTime]
      if(internalReferralData_Time != null && internalReferralData_Time.length > 0){
        const internalReferralData_Time_Device = internalReferralData_Time.filter(
          (item) => item.device == internalReferralDevice
        )
        const Data: any = internalReferralData_Time_Device.map((data: any) =>
          Number(data.share*100)
        )
        setStockTypeData(Data)
      }
    }
  }, [internalReferralDevice, internalReferralTime])
  return (
    <div className="p-5 bg-main min-w-screen min-h-screen bg-[#1b1d1f]">
        { loading ? (
              <div className="flex justify-center items-center h-[100vh]">
                <Spinner  
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
                {/* <div className="flex flex-col w-[405px] p-[23.39px] gap-[23.39px] bg-[#00000042] mb-[22.54px]">
                  <h1 className="text-[17.429px] font-bold leading-[20.915px] text-[#FFFFFF]">Overview</h1>
                  <div className="flex flex-col gap-[7.75px]">
                    <h5 className="text-[11.619px] font-bold text-[#FFFFFF]/[0.7]">Total Number of Sessions</h5>
                    <h5 className="text-[13.556px] text-[#FFFFFF]">{sessionCount}</h5>
                  </div>
                </div> */}
                <h1 className="text-[24px] leading-[28.8px] font-bold my-[31px] text-white">Insights</h1>
                <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-x-[10px] gap-y-[25px]">
                  {nameData.map((name) => {
                    switch(name["name"]){
                      case "_add_type":
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: addTypeDevice, setDevice: setAddTypeDevice,
                          timeFrames: timeFrames, time: addTypeTime, setTime: setAddTypeTime, data: addTypeData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                      case "_source":
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: sourceDevice, setDevice: setSourceDevice,
                          timeFrames: timeFrames, time: sourceTime, setTime: setSourceTime, data: sourceData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                      case "_sourceurl":
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: sourceURLDevice, setDevice: setSourceURLDevice,
                          timeFrames: timeFrames, time: sourceURLTime, setTime: setSourceURLTime, data: sourceURLData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                      case "_stock_type":
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: stockTypeDevice, setDevice: setStockTypeDevice,
                          timeFrames: timeFrames, time: stockTypeTime, setTime: setStockTypeTime, data: stockTypeData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                      case "_section_clicked":
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: sectionDevice, setDevice: setSectionDevice,
                          timeFrames: timeFrames, time: sectionTime, setTime: setSectionTime, data: sectionData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                      case "_internal_referral":  
                        return (
                          InsightsItem({deviceTypes: deviceTypes, device: internalReferralDevice, setDevice: setInternalReferralDevice,
                          timeFrames: timeFrames, time: internalReferralTime, setTime: setInternalReferralTime, data: internalReferralData,
                          title: name["name"], dataKey:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']})
                        )
                        break;
                    }
                    
                  })}
                  
                </div>
              </>
        }
    </div>
  )
}



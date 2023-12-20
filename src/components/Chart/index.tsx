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
import { getChartData, getTestData } from "../../client/abtest"
import Spinner from "../Spinner"
import CreateChart from "./createChart"

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

const other = (data: number[], title: string, dataKey: string[]) => {
  const colors = ["#A9E0F1", "#F5D6FF"]
  const borderColors = ["#1686AA", "#7E269A"]
  const chartData = {
    labels: [title],
    datasets: data.map((d, i) => ({
      label: dataKey[i],
      data: [d],
      backgroundColor: colors[i],
      borderColor: borderColors[i], 
    })),
  }

  const variantName= dataKey[1];
  const compareValue = data[0]<data[1];
  const deviceTypes = ["All", "Tablet", "Mobile", "Desktop"]
  const timeFrames = ["All", "Days 1", "Days 7", "Days 30", "Days 90"]
  const options_device = deviceTypes.map((deviceType) => {
  return (
    <option value={deviceType} key={deviceType}>{deviceType}</option>
    );
  });
  const options_time = timeFrames.map((timeFrame) => {
    return (
      <option value={timeFrame} key={timeFrame}>{timeFrame}</option>
    );
  });

  return (
    <div className="bg-[#00000042] p-[26.6px] w-full flex flex-col gap-[26.5px]">
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
              className="w-[126px] h-[31px] rounded-[4px] text-[#FFFFFF]/[0.7] text-[12px] leading-[14.4px] font-medium bg-[#FFFFFF]/[0.16] p-2 shadow-[0_4px_15px_0px_rgba(0,0,0,0.06)]" placeholder="All Devices">
              <option key="all" value="all">All Devices</option>
              {options_device}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="text-[#FFFFFF]/50 text-[12px] font-bold leading-[120%]">Time Period</h5>
            <select id={`${title} Time`}  
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

export interface ChartProps {
  id: string
}

const Chart = ({ id }: ChartProps) => {
  const [notification, setNotification] = useState(null)
  const [allData, setAllData] = useState([])
  const [selectData, setSelectData] = useState([])
  const [chartData, setChartData] = useState([])
  const [engagementData, setEngagementData] = useState([])
  const [bounceData, setBounceData] = useState([])

  const [syncDate, setSyncDate] = useState();
  const [sessionCount, setSessionCount] = React.useState<undefined | number>(0);
  const [sessionDesktopCount, setSessionDesktopCount] = React.useState<undefined | number>(0);
  const [sessionMobileCount, setSessionMobileCount] = React.useState<undefined | number>(0);
  const [sessionTabletCount, setSessionTabletCount] = React.useState<undefined | number>(0);
  const [loading, setLoading] = React.useState(true);
  const [timeFrames, setTimeFrames] = React.useState([]);
  const [deviceTypes, setDeviceTypes] = React.useState([]);
  const [names, setNames] = React.useState([]);
  const [conversionDevice, setConversionDevice] = React.useState<string| undefined>("");
  const [engagementDevice, setEngagementDevice] = React.useState<string| undefined>("");
  const [bounceDevice, setBounceDevice] = React.useState<string| undefined>("");
  
  // const [conversionTime, setConversionTime] = React.useState("");
  const [conversionTime, setConversionTime] = React.useState<string | undefined>("");
  const [engagementTime, setEngagementTime] = React.useState<string| undefined>("");
  const [bounceTime, setBounceTime] = React.useState<string| undefined>("");

  const [conversingData, setConversingData] = React.useState([]);
  const [engagingData, setEngagingData] = React.useState([]);
  const [bouncingData, setBouncingData] = React.useState([]);

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
    console.log("ID",id)
    const tokens = loadTokens()
    if (tokens) {
      getChartData(tokens.id_token, id)
        .then((tests) => {
          const { data } = tests
          const parsedData = JSON.parse(data)
          console.log("SDFSDKLFSLDKFLSDKF", parsedData)
          const filteredArray = parsedData.filter(
            (item: any) => item.Variant !== "Overall"
          )
          const filteredArray_overall = parsedData.filter(
            (item:any) => item.Variant === "Overall"
          )
          setSessionCount(filteredArray_overall[0].Session_Count);
          setAllData(filteredArray)
          setLoading(false);
        })
        .catch((err) => {
          console.log(err)
          showNotification("Data not Found")
        })
      getTestData(tokens.id_token, "fd08ee8d-df53-43ac-b689-64c7c45bfa05")
        .then((data) =>{
          setSelectData(data)
          console.log("ASDALSKDJAKLSDJLAKSD",data)
          const meta = data.meta
          const selected_timeframe = meta.timeframe_names[0]
          const selected_device = meta.device_names[0]
          const sample_names = meta.sample_names;
          setNames(sample_names)
          // console.log("names",sample_names)
          setTimeFrames(meta.timeframe_names)
          setDeviceTypes(meta.device_names)
          const selected_timeframe_data = data[selected_timeframe]
          const filterForDesktop = selected_timeframe_data.filter(
            (item: any) => item.device === "Desktop"
          )
          
          const filterForMobile = selected_timeframe_data.filter(
            (item: any) => item.device === "Mobile"
          )
          const filterForTablet = selected_timeframe_data.filter(
            (item: any) => item.device === "Tablet"
          )
          let sumDesktop = 0, sumMobile = 0, sumTablet = 0
          filterForDesktop.map((countItem) => {
            sumDesktop += countItem["session_count"]
          })
          setSessionDesktopCount(sumDesktop)
          filterForTablet.map((countItem) => {
            sumTablet += countItem["session_count"]
          })
          setSessionTabletCount(sumTablet)
          filterForMobile.map((countItem) => {
            sumMobile += countItem["session_count"]
          })
          setSessionMobileCount(sumMobile)
          const selected_timeframe_and_device_data = selected_timeframe_data.filter(
            (item) => item.device == selected_device
          )
          // console.log(selected_timeframe, selected_device)
          // console.log(selected_timeframe_and_device_data)
          const conversionData: any = selected_timeframe_and_device_data.map((data: any) =>
            Number(data.conversion_average)
          )
          const engagementData: any = selected_timeframe_and_device_data.map((data: any) =>
            Number(data.bounce_average)
          )
          const bounceData: any = selected_timeframe_and_device_data.map((data: any) =>
            Number(data.link_clicks_average + data.page_views_average)
          )
          setConversionDevice(selected_device)
          setConversionTime(selected_timeframe)
          setBounceDevice(selected_device)
          setBounceTime(selected_timeframe)
          setEngagementDevice(selected_device)
          setEngagementTime(selected_timeframe)
          setConversingData(conversionData)
          setEngagingData(engagementData)
          setBouncingData(bounceData)
          // console.log("FIRST", conversionData, engagementData, bounceData)
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
      const session_Count: any = allData.map((data:any) =>
        Number(data.Session_Count)
      )
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

  useEffect(() => {
    if(conversionDevice != "" || conversionTime != ""){
      const conversingData_time = selectData[conversionTime]
      if(conversingData_time != null && conversingData_time.length >0){
        const conversingData_time_device = conversingData_time.filter(
          (item) => item.device == conversionDevice
        )
        // console.log("CONVERSINGDATA", conversingData_time_device)
        const conversionData: any = conversingData_time_device.map((data: any) =>
          Number(data.conversion_average) * 1000
        )
        setConversingData(conversionData)
      }
    }
  }, [conversionDevice, conversionTime])
  useEffect(() => {
    if(bounceDevice != "" || bounceTime != ""){
      const bouncingData_time = selectData[bounceTime]
      if(bouncingData_time != null && bouncingData_time.length > 0){
        const bouncingData_time_device = bouncingData_time.filter(
          (item) => item.device == bounceDevice
        )
        // console.log("bouncingDATA", bouncingData_time_device)
        const bounceData: any = bouncingData_time_device.map((data: any) =>
          Number(data.link_clicks_average + data.page_views_average) * 10
        )
        setBouncingData(bounceData)
      }
    }
  }, [bounceDevice, bounceTime])

  useEffect(() => {
    if(engagementDevice != "" || engagementTime != ""){
      const engagingData_time = selectData[engagementTime]
      if(engagingData_time != null && engagingData_time.length > 0){
        const engagingData_time_device = engagingData_time.filter(
          (item) => item.device == engagementDevice
        )
        // console.log("engagingDATA", engagingData_time_device)
        const engagementData: any = engagingData_time_device.map((data: any) =>
          Number(data.bounce_average) * 100
        )
        setEngagingData(engagementData)
      }
    }
  }, [engagementDevice, engagementTime])
  return (
    
    <div className="p-5 bg-main min-w-screen min-h-screen">
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
            <div className="flex flex-col w-full p-[23.39px] gap-[23.39px] rounded-[7.746px] max-w-[882px] bg-[#00000042] mb-[22.54px]">
              <h1 className="text-[17.429px] font-bold leading-[20.915px] text-[#FFFFFF]">Overview</h1>
              <div className="flex flex-row justify-start gap-[23px]">
                <div className="flex flex-col gap-[7.75px] w-[190px]">
                  <h5 className="text-[11.619px] font-bold text-[#FFFFFF]/[0.7]">Total Number of Sessions</h5>
                  <h5 className="text-[13.556px] text-[#FFFFFF]">{sessionCount}</h5>
                </div>
                <div className="flex flex-col gap-[7.75px] w-[190px]">
                  <h5 className="text-[11.619px] font-bold text-[#FFFFFF]/[0.7]">Desktop Sessions</h5>
                  <h5 className="text-[13.556px] text-[#FFFFFF]">{sessionDesktopCount}</h5>
                </div>
                <div className="flex flex-col gap-[7.75px] w-[190px]">
                  <h5 className="text-[11.619px] font-bold text-[#FFFFFF]/[0.7]">Mobile Sessions</h5>
                  <h5 className="text-[13.556px] text-[#FFFFFF]">{sessionMobileCount}</h5>
                </div>
                <div className="flex flex-col gap-[7.75px] w-[190px]">
                  <h5 className="text-[11.619px] font-bold text-[#FFFFFF]/[0.7]">Tablet Sessions</h5>
                  <h5 className="text-[13.556px] text-[#FFFFFF]">{sessionTabletCount}</h5>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-x-[10px] gap-y-[25px]">
              {/* {other(chartData, "Conversion Rate", [
                "Original",
                "Variant",
              ])}
              {other(engagementData, "Bounce Rate", [
                "Original",
                "Variant",
              ])}
              {other(bounceData, "Engagement", [
                "Original",
                "Variant",
              ])} */}
              {CreateChart( { deviceTypes: deviceTypes, device : conversionDevice, setDevice :  setConversionDevice, 
              timeFrames: timeFrames, time : conversionTime, setTime : setConversionTime , data : conversingData, 
               title: "Conversion Rate", dataKey : names })}

              {CreateChart( { deviceTypes: deviceTypes, device : bounceDevice, setDevice :  setBounceDevice, 
              timeFrames: timeFrames, time : bounceTime, setTime : setBounceTime , data : bouncingData, 
               title: "Bounce Rate", dataKey : names })}

              {CreateChart( { deviceTypes: deviceTypes, device : engagementDevice, setDevice :  setEngagementDevice, 
              timeFrames: timeFrames, time : engagementTime, setTime : setEngagementTime , data : engagingData, 
               title: "Engagement", dataKey : names })}
            </div>
          </>
        }
    </div>
  )
}

export default Chart

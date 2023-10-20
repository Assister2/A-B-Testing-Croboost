import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { loadTokens } from "../../utils";
import { getChartData } from "../../client/abtest";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = (chartTitle: any) => {
  return {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: chartTitle, // Dynamic chart title
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
  };
};

const createChart = (data: any, title: any, dataKey: any) => {
  const colors = ["#ff6347", "#006CA5"];
  const chartData = {
    labels: ['Variant'],
    datasets: data.map((d: any, i: any) => ({
      label: dataKey[i],
      data: [d * 100], // Convert to percentage
      backgroundColor: colors[i],
      barThickness: 55,
    })),
  };

  return (
    <div>
      <h1 className='text-2xl font-light'>{title}</h1>
      <Bar options={chartOptions(title)} data={chartData} width={4} height={1} />
    </div>
  );
};

const Chart = (id: any) => {
  // console.log(id)
  const [notification, setNotification] = useState(null);
  const [allData, setAllData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [bounceData, setBounceData] = useState([]);

  const showNotification = (message: any) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };


  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const tokens = loadTokens();
    if (tokens) {
      getChartData(tokens.id_token, "80242517-ac80-4b41-8318-b7197599ceba")
        .then((tests) => {
          const { data } = tests;
          const parsedData = JSON.parse(data);
          const filteredArray = parsedData.filter((item: any) => item.Variant !== "Overall");
          setAllData(filteredArray);
        })
        .catch((err) => {
          console.log(err);
          showNotification('Data not Found');
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      const conversionData: any = allData.map((data: any) => Number(data.Average_Conversion_Rate));
      setChartData(conversionData);
      const engagementData: any = allData.map((data: any) => Number(data.Average_Event_Count));
      setEngagementData(engagementData);
      const bounceData: any = allData.map((data: any) => Number(data.Bounce_Rate));
      setBounceData(bounceData);
    }
  }, [allData]);

  return (
    <div className='p-5 bg-main min-w-screen min-h-screen'>
      {notification && (
        <div
          id="toast-warning"
          className="absolute top-4 right-4 w-80 p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark-bg-gray-800 flex items-center"
          role="alert"
        >
          <div className="w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark-bg-orange-700 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
              />
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
      <div className='grid'>
        {createChart(chartData, 'Conversion Rate %', ["Green Button Homepage", "Purple Button Homepage"])}
        {createChart(engagementData, 'Avg. Event count', ["Green Button Homepage", "Purple Button Homepage"])}
        {createChart(bounceData, 'Bounce Rate %', ["Green Button Homepage", "Purple Button Homepage"])}
      </div>
    </div>
  );
};

export default Chart;

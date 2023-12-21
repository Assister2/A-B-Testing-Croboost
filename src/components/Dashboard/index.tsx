import React, { useEffect } from "react"
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
import { loadTokens, Tokens, resetTokens} from "../../utils"
import { ABTest, getChartData, getTests, getUserData } from "../../client/abtest"
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

export const options = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Conversion Rate",
    },
  },
}

export default function App() {
  const [currentData, setCurrentData] = React.useState<ABTest[]>([])
  const [previousData, setPreviousData] = React.useState<ABTest[]>([])
  const [cardView, setCardView] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [selectedTest, setSelectedTest] = React.useState<ABTest | undefined>(
    undefined
  )
  const [sessionCount,setSessionCount] = React.useState<undefined | number>(0);
  const [userData, setUserData] = React.useState<Tokens | undefined>(undefined)

  useEffect(() => {
    const tokens = loadTokens()

    if (tokens) {
      setUserData(tokens)
      getTests(tokens.id_token)
        .then((tests: any) => {
          // Sort the tests by creation date
          tests.sort((a: any, b: any) => {
            return (
              new Date(b.iso_created_at).getTime() -
              new Date(a.iso_created_at).getTime()
            )
          })

          // Separate the tests into current and previous based on is_live property
          const currentTests = tests.filter(
            (test: any) => test.is_live === true
          )
          const previousTests = tests.filter(
            (test: any) => test.is_live === false
          )

          setCurrentData(currentTests)
          setPreviousData(previousTests)
          setLoading(false);
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      window.location.href = "/login"
    }
  }, [])

  const formatISODate = (isoDate: string) => {
    const date: any = new Date(isoDate)
    const currentDate: any = new Date()
    const timeDifference = currentDate - date
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) // Calculate days

    if (daysDifference === 0) {
      return "Live since today"
    } else {
      return `Live since  ${daysDifference} day${
        daysDifference !== 1 ? "s" : ""
      } ago`
    }
  }
  const formatCreateDate = (isoDate: string) =>{
    const date: any = new Date(isoDate)
    const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December']
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return `Created ${months[month]} ${day}, ${year}`
  }
  function sessionCount_number(selectedTest?: ABTest){
    const tokens = loadTokens()
    if(selectedTest?.record_id && tokens){
      getChartData(tokens.id_token, selectedTest?.record_id)
        .then((tests) =>{
          const {data} = tests;
          const parsedData =JSON.parse(data)
          const filteredArray = parsedData.filter(
            (item:any) => item.Variant === "Overall"
          )
          setSessionCount(filteredArray[0].Session_Count);
        })
        .catch((err)=>{
          console.log(err)
        })
    }
  }
  function handleButtonClick(test: ABTest) {
    setCardView(false);
    setSelectedTest(test)
    sessionCount_number(test)
  }

  const endTest = async () => {
    if (userData && selectedTest) {
      const res = await updateTest(
        userData.id_token,
        selectedTest.record_id,
        selectedTest.title,
        false
      )
      if (res.status == "OK") {
        window.location.replace('/dashboard');
      }
    }
  }

  return (
    <div className="p-5 bg-[#1b1d1f] min-w-screen min-h-screen">
      { loading ? 
        (<div className="flex justify-center items-center h-[100vh]">
          <Spinner/>
        </div>
        )
        :
        <>
        {/* {
          !cardView && selectedTest?.is_live ?
          <a className="flex w-[70px] p-2 justify-center cursor-pointer items-center gap-[10px] absolute right-[31px] top-[69px] rounded-[4px] bg-[#6F1111] text-white text-[12px] font-bold hover:bg-opacity-50" onClick={()=>{endTest()}}>End Test</a>
          :
          ""
          // <a className="flex w-[134px] p-2 justify-center items-center gap-[10px] absolute right-[31px] top-[69px] rounded-[4px] bg-[#10503D] text-white text-[12px] font-bold hover:bg-opacity-50" href={'/create'}>New A/B Test</a>
        } */}

        {cardView && <>
        {currentData.length > 0 ? (
          <>

            <h5 className="mb-5 text-2xl font-bold tracking-tight dark:text-gray-900 text-white ml-4">
              Live Tests
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6 gap-3 ml-4">
              {currentData.map((test, index) => {
                // const cardId = uuidv4();
                {console.log("adsasdfasdf",test)}
                return (
                  <Card className="w-full rounded-[7.746px] bg-[#303133] text-white border-0" key={index}>
                    <CardHeader>
                      <div className="gap-2 flex flex-row">
                        <div className="w-4 h-4 rounded-[100%] bg-[#10503d] mb-4"></div>
                        <h3 className="text-[12px] leading-[14.4px] font-medium">Live</h3>
                      </div>
                      <h2 className="text-[18px] leading-[25.2px] font-bold capitalize ">
                        {test.title}
                      </h2>
                      <CardDescription className="text-[#FFFFFF]/[0.7] h-[48px]">
                        <h4 className="text-[10px] leading-[14px] mb-1 font-bold">{(test.description == '' || test.description == null)? "" : "DESCRIPTION"}</h4>
                        <h3 className="text-[14px] leading-[19.6px]">{(test.description == null || test.description == '') ? "" : test.description}</h3>
                        
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col items-start">
                      <Button
                        variant="outline"
                        className="rounded-[4px] bg-white hover:bg-[#FFFFFF33] text-[14px] font-bold text-black hover:text-black px-6 py-2 mb-4 border-0"
                        onClick={() => handleButtonClick(test)}
                      >
                        View Data
                      </Button>
                      <h4 className="text-[10px] leading-[14px]">{formatISODate(test.iso_created_at)}</h4>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          ""
        )}

        {previousData.length > 0 ? (
          <div className="mt-5">
            <h5 className="mb-5 text-2xl font-bold tracking-tight dark:text-gray-900 text-white ml-4">
            Completed Tests
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6 gap-3 ml-4">
              {previousData.map((test, index) => (
                <Card className="w-full  rounded-[7.746px] bg-[#303133] text-white border-0" key={index}>
                  <CardHeader>
                    <div className="gap-2 flex flex-row">
                      <div className="w-4 h-4 rounded-[100%] bg-[#F3ABAB] mb-4"></div>
                      <h3 className="text-[12px] leading-[14.4px] font-medium">Completed</h3>
                    </div>
                    <h2 className="text-[18px] leading-[25.2px] font-bold capitalize ">
                        {test.title}
                    </h2>
                    <CardDescription className="text-[#FFFFFF]/[0.7] h-[48px]">
                      <h4 className="text-[10px] leading-[14px] mb-1 font-bold">{(test.description == '' || test.description == null)? "" : "DESCRIPTION"}</h4>
                      <h3 className="text-[14px] leading-[19.6px]">{(test.description == null || test.description == '') ? "     " : test.description}</h3>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col items-start">
                    <Button
                      variant="outline"
                      className="rounded-[4px] bg-white hover:bg-[#FFFFFF33] text-[14px] font-bold text-black hover:text-black mb-4 px-6 py-2 border-0"
                      onClick={() => handleButtonClick(test)}
                    >
                      View Data
                    </Button>
                    <h4 className="text-[10px] leading-[14px]">{formatCreateDate(test.iso_created_at)}</h4>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        </>}

        {!cardView &&
                      <div className="flex flex-row justify-between w-full">
                        <div className="text-[12px] leading-6 underline text-white cursor-pointer ml-[20px]" onClick={() => setCardView(true)}>
                          Back to all live tests
                        </div>
                        {
                        !cardView && selectedTest?.is_live ?
                        <a className="flex w-[70px] p-2 justify-center cursor-pointer items-center gap-[10px] rounded-[4px] bg-[#6F1111] text-white text-[12px] font-bold hover:bg-opacity-50" onClick={()=>{endTest()}}>End Test</a>
                        :
                        ""}
                      </div>}
        {!cardView && 
                      <h5 className="flex mt-5 mb-5 text-2xl font-bold tracking-tight dark:text-gray-900 text-white ml-5">
                      {selectedTest?.title}
                      </h5>}
        {!cardView && <div className="w-full ">
          {selectedTest && <Chart id={selectedTest.record_id} />}
        </div>}
        </>
      }
      
    </div>
  )
}

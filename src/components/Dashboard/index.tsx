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
import { loadTokens } from "../../utils"
import { ABTest, getTests, getUserData } from "../../client/abtest"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
  const [selectedTest, setSelectedTest] = React.useState<ABTest | undefined>(
    undefined
  )

  useEffect(() => {
    const tokens = loadTokens()
    if (tokens) {
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
      return "Started today"
    } else {
      return `Started  ${daysDifference} day${
        daysDifference !== 1 ? "s" : ""
      } ago`
    }
  }

  function handleButtonClick(test: ABTest) {
    // Do something with the recordId, like recording it or using it in your application.
    console.log("Button clicked with record_id:", test.record_id)
    setCardView(false);
    setSelectedTest(test)

    // const dashboardUrl = `dashboard/${recordId}`

    // window.location.href = dashboardUrl
  }

  return (

    <div className="p-5 bg-[#132632] min-w-screen min-h-screen">
      <a className="flex w-[134px] p-2 justify-center items-center gap-[10px] absolute right-[31px] top-[69px] rounded-[4px] bg-[#10503D] text-white text-[12px] font-bold hover:bg-opacity-50" href={'/create'}>New A/B Test</a>

      {cardView && <>
      {currentData.length > 0 ? (
        <>
          {" "}
          <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ml-4">
            Current A/B Tests
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6 gap-3 ml-4">
            {currentData.map((test, index) => {
              // const cardId = uuidv4();
              return (
                <Card className="w-full rounded-xl" key={index}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-normal capitalize">
                      {test.title} Test
                    </CardTitle>
                    <CardDescription className="text-sm font-bold">
                      {formatISODate(test.iso_created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="rounded-full bg-blue-800 text-white text-xs px-6 py-2 hover:bg-blue-700 hover:text-white border-0"
                      onClick={() => handleButtonClick(test)}
                    >
                      View Data
                    </Button>
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
          <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ml-4">
            Previous A/B Tests
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6 gap-3 ml-4">
            {previousData.map((test, index) => (
              <Card className="w-full rounded-xl" key={index}>
                <CardHeader>
                  <CardTitle className="text-2xl font-normal capitalize">
                    {test.title} Test
                  </CardTitle>
                  <CardDescription className="text-sm font-bold">
                    {formatISODate(test.iso_created_at)}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="rounded-full bg-blue-800 text-white text-xs px-6 py-2 hover:bg-blue-700 hover:text-white border-0"
                    onClick={() => handleButtonClick(test)}
                  >
                    View Data
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      </>}

      {!cardView && <Button
                      variant="outline"
                      className="rounded-full bg-blue-800 text-white text-xs px-6 py-2 hover:bg-blue-700 hover:text-white border-0"
                      onClick={() => setCardView(true)}
                    >
                      View Card
                    </Button>}
      {!cardView && <div className="grid grid-cols-2 gap-2">
        {selectedTest && <Chart id={selectedTest.record_id} />}
      </div>}
    </div>
  )
}

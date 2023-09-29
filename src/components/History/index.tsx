import React, { useEffect, useState } from "react"
// import AWS from "aws-sdk";
import Button from "../components/Button"
import { ROOT } from "../../constants"
import { Tokens, resetTokens } from "../../utils"
import { loadTokens } from "../../utils"
import {
  ABTest,
  getTests,
  createTest,
  deleteTest,
  updateTest,
} from "../../client/abtest"
import "./Dashboard.scss"
import CodeMirror from "@uiw/react-codemirror"
import { html } from "@codemirror/lang-html"
import { dracula } from "@uiw/codemirror-theme-dracula"

import { z } from "zod"

const testSchema = z.array(
  z.object({
    title: z.string(),
    is_live: z.boolean().default(false),
    s3_key: z.string(),
    data: z.string().optional(),
    user_id: z.string(),
    record_id: z.string(),
    iso_created_at: z.string(),
    iso_updated_at: z.string(),
  })
)

const snowplowDefault = "dist/default/v1/sptr.js"
const snowplowMojito = "dist/default/v1/mjo.js"
const History = () => {
  const [userData, setUserData] = useState<Tokens | undefined>(undefined)
  const [testHistory, setTestHistory] = useState<ABTest[]>([])
  const [testIndex, setTestIndex] = useState<number>(0)
  const [scripts, setScripts] = useState<string>("")
  const [selected, setSelected] = useState<string>("")
  const constructScripts = (
    sptr: string,
    mojito: string,
    test: string,
    name: string
  ) =>
    `<!-- ${name} -->
<!-- Snowplow -->
<script type="text/javascript" src="${sptr}"></script>
<!-- Mojito -->
<script type="text/javascript" src="${mojito}"></script>
<!-- Test -->
<script type="text/javascript" src="${test}"></script>
<!-- End of ${name} -->`
  const handleConstructTags = (test: ABTest) => {
    const s = constructScripts(
      `${ROOT}/${snowplowDefault}`,
      `${ROOT}/${snowplowMojito}`,
      `${ROOT}/${test.s3_key}`,
      test.title
    )
    setScripts(s)
  }
  useEffect(() => {
    const tokens = loadTokens()
    if (tokens) {
      setUserData(tokens)
      getTests(tokens.id_token)
        .then((tests) => {
          const validatedTest = testSchema.parse(tests)
          console.log(validatedTest)
          setTestHistory(validatedTest)
          if (tests.length > 0) {
            handleConstructTags(tests[0])
            setSelected(tests[0].record_id)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      window.location.href = "/login"
    }
  }, [])
  useEffect(() => {
    const updateTestValues = async () => {
      const test = testHistory[testIndex]
      // TODO: refetch token / fix
      if (userData) {
        const res = await updateTest(
          userData.id_token,
          test.record_id,
          test.title,
          test.is_live
        )
        console.log(res)
      }
    }
    updateTestValues()
  }, [testHistory])
  return (
    <div className="p-5 bg-main min-w-screen min-h-screen">
      <div className="container mx-auto flex flex-col items-center mt-5">
        <div className="my-4">
          <h2 className="text-2xl font-bold dark:text-dark">
            User Test History
          </h2>
        </div>
        <section className="flex flex-col gap-2 w-full lg:w-4/5 overflow-x-auto">
          {scripts && (
            <section className="text-md">
              {/* <h3 className="text-xs">
                    Script
                  </h3> */}
              <CodeMirror
                value={scripts}
                height="164px"
                theme={dracula}
                extensions={[html()]}
              />
              {/* <textarea 
                    className="w-full h-64 text-md"
                    style={{fontSize: "0.96rem"}}
                    readOnly={true}
                    value={scripts}>
                  </textarea> */}
            </section>
          )}
        </section>
        <div className="flex flex-col gap-2 w-full lg:w-4/5 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  URL
                </th>
                <th scope="col" className="px-4 py-3">
                  Live
                </th>
                <th scope="col" className="px-4 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {testHistory &&
                testHistory.map((test, index) => (
                  <tr
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                      selected === test.record_id ? "dark:bg-gray-600" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleConstructTags(test)
                      setSelected(test.record_id)
                      navigator.clipboard.writeText(`${ROOT}/${test.s3_key}`)
                    }}
                  >
                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {test.title}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(test.iso_created_at)
                        .toISOString()
                        .substring(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td className="px-4 py-4">{`${ROOT}/${test.s3_key}`}</td>
                    <td className="px-4 py-4">
                      {/* <button
                        type={"button"}
                        className="px-3 py-2 text-xs font-medium text-white text-center bg-blue-500 rounded-md"
                        onClick={() => {}}
                        style={{ cursor: "pointer" }}
                      >
                        get
                      </button> */}
                      <input
                        type="checkbox"
                        onClick={async () => {
                          // then change the state
                          setTestIndex(index)
                          setTestHistory((prev) => {
                            const newTest = [...prev]
                            newTest[index].is_live = !newTest[index].is_live
                            return newTest
                          })
                        }}
                        checked={test.is_live}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type={"button"}
                        className="px-3 py-2 text-xs font-medium text-white text-center bg-red-500 rounded-md"
                        onClick={() => {
                          const ok = confirm("Delete?")
                          if (ok) {
                            userData &&
                              deleteTest(userData.id_token, test.record_id)
                                .then((res) => {
                                  window.location.reload()
                                })
                                .catch((err) => {
                                  console.log(err)
                                })
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        del
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="grid content-start">
          <div className="inline-block text-center">
            <p className="text-base text-black" style={{ padding: "12px" }}>
              <b>User:</b> {userData && userData.email}
            </p>
          </div>
          <Button
            text="Logout"
            onClick={() => {
              resetTokens()
              window.location.reload()
            }}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  )
}

export default History

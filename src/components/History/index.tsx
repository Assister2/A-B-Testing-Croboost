import React, { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { z } from "zod"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
            
              <CodeMirror
                value={scripts}
                height="164px"
                theme={dracula}
                extensions={[html()]}
              />
              {/* <Button variant="outline" className="text-black font-bold py-2 px-4 rounded my-2">View Code</Button> */}

              <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"className="text-black font-bold py-2 px-4 rounded my-2">View Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] bg-white m-4">
        <DialogHeader>
          <DialogTitle>View Code</DialogTitle>

          <DialogDescription>
          <CodeMirror
                value={scripts}
                height="200px"
                theme={dracula}
                extensions={[html()]}
                readOnly={true}
              />
          </DialogDescription>
        </DialogHeader>
        
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>

            </section>
          )}
        </section>
        {scripts && (<> <div className="flex flex-col gap-2 w-full lg:w-4/5 overflow-x-auto">
          <Table>
            <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead >URL</TableHead >
                <TableHead >Live</TableHead >
                <TableHead >Delete</TableHead >
              </TableRow>
            </TableHeader>
            <TableBody>
              {testHistory &&
                testHistory.map((test, index) => (
                  <TableRow
                    key={index}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${selected === test.record_id ? "dark:bg-gray-600" : ""
                      }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleConstructTags(test);
                      setSelected(test.record_id);
                      navigator.clipboard.writeText(`${ROOT}/${test.s3_key}`);
                    }}
                  >
                    <TableCell>{test.title}</TableCell>
                    <TableCell>
                      {new Date(test.iso_created_at)
                        .toISOString()
                        .substring(0, 16)
                        .replace("T", " ")}
                    </TableCell>
                    <TableCell>{`${ROOT}/${test.s3_key}`}</TableCell>
                    <TableCell>
                      <Checkbox
                        className="rounded"
                        checked={test.is_live}
                        onCheckedChange={(newCheckedState) => {
                          setTestIndex(index);
                          setTestHistory((prev) => {
                            const newTest:any = [...prev];
                            newTest[index].is_live = newCheckedState;
                            return newTest;
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type={"button"}
                        className="rounded px-3 py-2 text-xs font-medium text-center bg-red-500 hover:bg-red-500"
                        onClick={() => {
                          const ok = confirm("Delete?");
                          if (ok) {
                            userData &&
                              deleteTest(userData.id_token, test.record_id)
                                .then((res) => {
                                  window.location.reload();
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        del
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid content-start">
          <div className="inline-block text-center">
            <p className="text-base text-black" style={{ padding: "12px" }}>
              <b>User:</b> {userData && userData.email}
            </p>
          </div>
          <Button
            onClick={() => {
              resetTokens()
              window.location.reload()
            }}
            disabled={false}
            style={{ backgroundColor: "rgb(21, 131, 112)" }}
            className="text-white font-bold py-2 px-4 rounded"
          >Logout</Button>
        </div></>)}
       
      </div>
    </div>
  )
}

export default History

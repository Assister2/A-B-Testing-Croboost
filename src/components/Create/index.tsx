// import AWS from "aws-sdk";
import { createTest, deleteTest } from "../../client/abtest"
import { IExperimentParameters, TEST_NAMES } from "./types"
import { useEffect, useState, useRef } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { javascript } from "@codemirror/lang-javascript"
import { dracula } from "@uiw/codemirror-theme-dracula"
import CodeMirror from "@uiw/react-codemirror"
import type { Tokens } from "../../utils"
import { loadTokens } from "../../utils"
import "./Create.scss"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import screenshot from "../../../public/image/image 113.png"



const getUnixTime = () => Math.trunc(new Date().getTime() / 1000)
const Create = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IExperimentParameters>({
    defaultValues: {
      id: `ex${getUnixTime()}`,
      name: "",
      trigger: `function (test) { if (document.location.pathname === '/') test.activate(); }`,
      sampleRate: 1.0,
      Original: {
        codeJS: `const url = new URL(window.location.href);
        url.searchParams.set('_ab_croboost', '${TEST_NAMES[0].toLowerCase()}');
        window.history.pushState({ path: url.href }, '', url.href);`,
        codeCSS: `.accent-bg-color {
          background-color: #158370 !important;
        }`,
      },
      Variant: {
        codeJS: `const url = new URL(window.location.href);
        url.searchParams.set('_ab_croboost', '${TEST_NAMES[1].toLowerCase()}');
        window.history.pushState({ path: url.href }, '', url.href);`,
        codeCSS: `.accent-bg-color {
          background-color: #7426ab !important;
        }`,
      },
    },
  })
  const formWatch = watch()
  const [showOutput, setShowOutput] = useState<boolean>(false)
  const [userData, setUserData] = useState<Tokens | undefined>(undefined)
  const [updated, setUpdated] = useState<boolean>(false)
  const [tab, setTab] = useState<"Original" | "Variant">("Original")
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const tokens = loadTokens()
    if (tokens) {
      setUserData(tokens)
    } else {
      window.location.href = "/login"
    }
  }, [updated])
  const constructSnowplowStorageAdapter = () => `{
      onExposure: function(obj){
        snowplow('trackSelfDescribingEvent', {
          event: {
            schema: 'iglu:io.mintmetrics.mojito/mojito_exposure/jsonschema/1-0-0',
            data: {
              'waveId': obj.options.id,
              'waveName': obj.options.name,
              'recipe': obj.chosenRecipe.name
            }
          }
        });
      },
      onVeilTimeout: function(obj, ultimateRecipe){},
      onRecipeFailure: function(obj, err){
        snowplow('trackSelfDescribingEvent', {
          event: {
            schema: 'iglu:io.mintmetrics.mojito/mojito_failure/jsonschema/1-0-0',
            data: {
              'waveId': obj.options.id,
              'waveName': obj.options.name,
              'component': obj.chosenRecipe.name || 'trigger',
              'error': err
            }
          }
        });
        // Refresh the page unless we're in a trigger or preview mode
        var preview = document.location.search.indexOf('mojito_' + obj.options.id + '=' + obj.chosenRecipe.id) > -1;
        if (obj.chosenRecipe.name && !obj.options.divertTo && !preview) {
          // Disable the experiment on future page loads, and refresh
          Mojito.Cookies.set('_mojito_' + obj.options.id + (obj.options.state === 'live'?'':'-staging'), '0.0');
          setTimeout(function(){
            window.location.reload();
          }, 500);
        }
      }
    }`
  const constructTest = ({
    id,
    name,
    trigger,
    sampleRate,
    Original,
    Variant,
  }: IExperimentParameters) =>
    `Mojito.addTest({
  id: "${id}",
  name: "${name}",
  sampleRate: ${sampleRate},
  state: "live",
  trigger: ${trigger},
  recipes: {
    "0": {
      name: "Original",
      ${Original.codeJS &&
    `js: function () {
        ${Original.codeJS}
      },`
    }
      ${Original.codeCSS && `css: \`${Original.codeCSS}\`,`}
    },
  ${[Variant]
      .map(
        (plan, i) => `
    "${i + 1}": {
      name: "${TEST_NAMES[i + 1]}",
      ${plan.codeJS &&
          `js: function () {
        ${plan.codeJS}
      },`
          }
      ${plan.codeCSS && `css: \`${plan.codeCSS}\`,`}
    },`
      )
      .join("\n")}
  },
  options: {
    storageAdapter: ${constructSnowplowStorageAdapter()}
  }
});`
  const generateTest = async (data: IExperimentParameters) => {
    const mojitoOutput = constructTest(data)
    if (userData) {
      const res = await createTest(userData.id_token, data.name, mojitoOutput)
      res && setUpdated(!updated)
      console.log(mojitoOutput)
      alert(`OK: ${res.title}`)
    }
  }

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }).refine((value) => value.trim() !== "", {
      message: "Name is required",
    }),
    id: z.number().refine((value) => value !== null, {
      message: "ID is required",
    }),
    sampleRate: z
      .number()
      .refine((value) => value !== null && value >= 0 && [1, 0.1, 0.5].includes(value), {
        message:
          "Sample rate must be a non-negative number and can only be 0.1, 0.5, or 1.",
      }),
    page: z
      .string({
        required_error: "Please select page.",
      }),
    description: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })



  return (
    <div className="p-4 min-w-screen min-h-screen bg-[#132632]">
      <div className="flex justify-between">
        <a href="/dashboard" className="text-white cursor-pointer underline">Back to all live tests</a>
        <div>
          <Button variant="outline" className="me-2 text-white bg-[#10503D] border-none rounded hover:bg-[#10503D] hover:text-white hover:border-none">Add to Backlog</Button>
          <Button variant="outline" className="text-white bg-[#10503D] border-none rounded hover:bg-[#10503D] hover:text-white hover:border-none">Save</Button>
        </div>
      </div>
      <h1 className="font-bold text-2xl text-white my-2">Create A/B Test</h1>
      <div className="flex flex-col md:flex-row my-5 gap-4">
        <div className="flex-auto w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="h-full flex flex-col">
            <Card className="w-full bg-white p-5 border-none flex-grow">
              <CardHeader className="">
                <CardTitle className="font-bold text-lg leading-4">Create Test</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(generateTest)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="...">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-label text-sm mb-3">Test Name</FormLabel>
                              <FormControl>
                                <Input className="border border-text-input rounded py-3 px-4 text-sm text-black" placeholder="Test Name" {...field} {...register("name", {
                                  required: "Name is required",
                                })} />
                              </FormControl>
                              {errors.name && (
                                <FormDescription className="text-red-500 text-xs">
                                  {errors.name.message}
                                </FormDescription>
                              )}


                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="...">
                        <FormField
                          control={form.control}
                          name="page"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pages</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-neutral-300 rounded">
                                    <SelectValue placeholder="All Pages" className="font-medium" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Page 1</SelectItem>
                                  <SelectItem value="2">Page 2</SelectItem>
                                  <SelectItem value="3">Page 3</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="...">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Test Name"
                                  className="resize-none border-neutral-300 rounded bg-[#00000014]"
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>

                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 my-4">
                      <Tabs defaultValue="a" className="createTest w-full">
                        <TabsList className="grid w-full grid-cols-2 p-0 text-base font-medium leading-4 max-w-[275px]">
                          <TabsTrigger value="a" className="text-[#606060] p-3">Variant A</TabsTrigger>
                          <TabsTrigger value="b" className="text-[#606060] p-3">Variant B</TabsTrigger>
                        </TabsList>

                        <TabsContent value="a" className="py-5">
                          <section className={`mb-2 grid grid-cols-2 gap-2`}>
                            <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">CSS</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-black bg-[#00000014]"   {...register("Original.codeCSS")} />

                            </section>
                            <section className={`flex flex-col`}>

                              <Label htmlFor="message-2" className="text-label text-sm mb-3">JavaScript</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-black bg-[#00000014]"   {...register("Original.codeJS")} />

                            </section>

                          </section>
                        </TabsContent>

                        <TabsContent value="b" className="py-5">
                          <section className={`mb-2 grid grid-cols-2 gap-2`}>
                            <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">CSS2</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-black bg-[#00000014]"   {...register("Original.codeCSS")} />

                            </section>
                            <section className={`flex flex-col`}>

                              <Label htmlFor="message-2" className="text-label text-sm mb-3">JavaScript2</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-black bg-[#00000014]"   {...register("Original.codeJS")} />

                            </section>

                          </section>
                        </TabsContent>

                      </Tabs>
                    </div>

                    <Button
                      id="submit-test-button"
                      className="mx-auto my-2 bg-button accent-bg-color text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full"
                      type={"submit"}
                    >
                      Confirm A/B Test
                    </Button>
                  </form>
                </Form>
              </CardContent>

            </Card>
          </div>
        </div>
        <div className="flex-auto w-full md:w-1/2 lg:w-2/3 xl:w-1/4">
          <div className="h-full flex flex-col">
            <Card className="w-full bg-[#00000042] border-none p-5 flex-grow">
              <CardHeader className="">
                <CardTitle className="font-bold text-lg leading-4 text-white">Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Tabs defaultValue="a" className="screenShot w-full">
                    <TabsList className="grid w-full grid-cols-2 text-base font-medium leading-4 p-0 max-w-[200px]">
                      <TabsTrigger value="a" className="text-[#ffffff9e] p-3 text-start">Variant A</TabsTrigger>
                      <TabsTrigger value="b" className="text-[#ffffff9e] p-3">Variant B</TabsTrigger>
                    </TabsList>

                    <div className="text-white grid grid-cols-1 md:grid-cols-3 gap-4 my-4">

                      <div className="text-white col-span-2"><TabsContent value="a" className="">
                        <Card className="border-dashed border-2 rounded-none">
                          <CardHeader className="h-60">
                            <CardTitle className="text-white">Variant A</CardTitle>
                          </CardHeader>
                        </Card>
                      </TabsContent>
                        <TabsContent value="b" className="">
                          <Card className="border-dashed border-2 rounded-none">
                            <CardHeader className="h-60">
                              <CardTitle className="text-white">Variant B</CardTitle>
                            </CardHeader>
                          </Card>
                        </TabsContent></div>
                      <div className="text-white rounded-none ">
                        <img src={screenshot} className="h-64 w-full" />
                      </div>
                    </div>
                  </Tabs>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

      </div>

      {/* <Form {...form}>
        <form
          className="container mx-auto flex flex-col items-center"
          onSubmit={handleSubmit(generateTest)}
        >

          <h1 className="font-bold text-2xl text-black my-5">Create A/B Test</h1>
          <section className="flex flex-col gap-2 w-full lg:w-3/5 bg-white rounded p-4">
            <section className={`mb-2 grid grid-cols-3 gap-2`}>
              <section className={`flex flex-col`}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label text-sm mb-3">Name</FormLabel>
                      <FormControl>
                        <Input className="border border-text-input rounded py-3 px-4 text-sm text-black" {...field} {...register("name", {
                          required: "Name is required",
                        })} />
                      </FormControl>
                      {errors.name && (
                        <FormDescription className="text-red-500 text-xs">
                          {errors.name.message}
                        </FormDescription>
                      )}


                      <FormMessage />
                    </FormItem>
                  )}
                />

              </section>
              <section className={`flex flex-col`}>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label text-sm mb-3">ID</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-text-input rounded py-3 px-4 text-sm text-black"
                          {...field}
                          defaultValue="ex1696833655"
                          {...register("id", {
                            required: "ID is required",
                            pattern: {
                              value: /^[a-zA-Z0-9-_]+$/,
                              message: "ID must be alphanumeric, dash or underscore",
                            },
                          })}
                        />
                      </FormControl>
                      {errors.id && (
                        <FormDescription className="text-red-500 text-xs">
                          {errors.id.message}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />


              </section>
              <section className={`flex flex-col`}>
                <FormField
                  control={form.control}
                  name="sampleRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-label text-sm mb-3">Sample Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border border-text-input rounded py-3 px-4 text-sm text-black"
                          {...field}
                          {...register("sampleRate", {
                            min: {
                              value: 0,
                              message: "Sample Rate must be greater than 0",
                            },
                            max: {
                              value: 1,
                              message: "Sample Rate must be less than 1",
                            },
                          })}
                          min="0"
                          max="1"
                          step="0.05"
                          defaultValue={1}
                        />
                      </FormControl>
                      {errors.sampleRate && (
                        <FormDescription className="text-red-500 text-xs">
                          {errors.sampleRate.message}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />


              </section>
            </section>
          </section>
          <section className="mt-4 flex flex-col gap-2 w-full lg:w-3/5 bg-white rounded p-4">
            <div className="">
              <Tabs defaultValue="original" className="w-full">
                <TabsList className="tabData grid w-full grid-cols-2 ">
                  <TabsTrigger value="original">Original (A)</TabsTrigger>
                  <TabsTrigger value="variant">Variant (B)</TabsTrigger>
                </TabsList>

                <TabsContent value="original" className="py-5">
                  <section className={`mb-2 grid grid-cols-2 gap-2`}>
                    <section className={`flex flex-col`}>

                      <Label htmlFor="message-2" className="text-label text-sm mb-3">Original JavaScript</Label>
                      <Textarea placeholder="Type your message here." id="message-2" rows={4} className="border border-text-input rounded py-3 px-4 text-sm text-black"   {...register("Original.codeJS")} />

                    </section>
                    <section className={`flex flex-col`}>
                      <Label htmlFor="message-2" className="text-label text-sm mb-3">Original CSS</Label>
                      <Textarea placeholder="Type your message here." id="message-2" rows={4} className="border border-text-input rounded py-3 px-4 text-sm text-black"   {...register("Original.codeCSS")} />

                    </section>
                  </section>
                </TabsContent>

                <TabsContent value="variant" className="py-5">
                  <section className={`mb-2 grid grid-cols-2 gap-2`}>
                    <section className={`flex flex-col`}>
                      <Label htmlFor="variant" className="text-label text-sm mb-3">Variant JavaScript</Label>
                      <Textarea placeholder="Type your message here." id="variant" rows={4} className="border border-text-input rounded py-3 px-4 text-sm text-black"   {...register("Variant.codeJS")} />

                    </section>
                    <section className={`flex flex-col`}>
                      <Label htmlFor="css" className="text-label text-sm mb-3">Variant CSS</Label>
                      <Textarea placeholder="Type your message here." id="css" rows={4} className="border border-text-input rounded py-3 px-4 text-sm text-black"   {...register("Variant.codeCSS")} />

                    </section>
                  </section>
                </TabsContent>

              </Tabs>
              
            </div>
            
          </section>
          <section className="mt-4 flex flex-col gap-2 w-full lg:w-3/5 bg-white rounded p-4">
          
            <Button
              type={"button"}
              onClick={() => {
                setShowOutput((prev) => !prev)
                // delay 1 sec and scroll into view
                setTimeout(() => {
                  toggleRef.current?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }}
              className="text-gray-600 dark:text-gray-600 pt-1 shadow-none"
            >
              <span>{showOutput ? "Hide" : "Show Current Test"}</span>
            </Button>
            <section ref={toggleRef}>
              {showOutput && (
                <section className={`mb-2 flex flex-col`}>
                  <label className="text-label text-sm mb-2">Edit Trigger</label>
                  <CodeMirror
                    theme={dracula}
                    extensions={[javascript()]}
                    value={formWatch.trigger}
                    {...register("trigger", { required: "Trigger is required." })}
                    onChange={(value) => {
                      setValue("trigger", value)
                    }}
                  />
                  {errors.trigger && (
                    <p className="text-red-500 text-xs">
                      {errors.trigger.message}
                    </p>
                  )}
                </section>
              )}
              {showOutput && formWatch && (
                <section className={`mb-2 flex flex-col`}>
                  <label className="text-label text-sm mb-2">View Output</label>
                  <CodeMirror
                    height={"300px"}
                    value={constructTest(getValues())}
                    extensions={[javascript()]}
                    theme={dracula}
                    editable={false}
                  />
                </section>
              )}
            </section>
            <Button
              id="submit-test-button"
              className="mx-auto my-2 bg-button accent-bg-color text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full"
              type={"submit"}
            >
              Confirm Test
            </Button>
          </section>
        </form>
      </Form> */}

    </div>
  )
}

export default Create

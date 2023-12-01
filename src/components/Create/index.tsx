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
import Spinner from "../Spinner"

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
      description:'',
      Original: {
        variantName:'',
        codeJS: `const url = new URL(window.location.href);
        url.searchParams.set('_ab_croboost', '${TEST_NAMES[0].toLowerCase()}');
        window.history.pushState({ path: url.href }, '', url.href);`,
        codeCSS: `.accent-bg-color {
          background-color: #158370 !important;
        }`,
      },
      Variant: {
        variantName:'',
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
  const [loading, setLoading] = useState<boolean>(false)
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
    description,
    Original,
    Variant,
  }: IExperimentParameters) =>
    `Mojito.addTest({
  id: "${id}",
  name: "${name}",
  sampleRate: ${sampleRate},
  state: "live",
  description:"${description}",
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
      setLoading(true)
      const res = await createTest(userData.id_token, data.name, mojitoOutput)
      if (res) {
     
        setUpdated(!updated)
        window.location.replace('/history');
        setLoading(false);
      } 
      
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
    description:z.string(),
    sampleRate: z
      .number()
      .refine((value) => value !== null && value >= 0 && [1, 0.1, 0.5].includes(value), {
        message:
          "Sample rate must be a non-negative number and can only be 0.1, 0.5, or 1.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 if (loading){
  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#1b1d1f]">
      <Spinner/>
    </div>
  )
 }
  return (
    <div className="p-4 min-w-screen min-h-screen bg-[#1b1d1f]">
      <div className="max-w-[800px] mx-auto">
      <h1 className="font-bold text-2xl text-white">Create A/B Test</h1>
      <div className="flex flex-col md:flex-row my-4 gap-4">
        <div className="flex-auto w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <div className="h-full flex flex-col">
            <Card className="w-full bg-[black] border-[#4B4B4B] text-white border-solid border-[1px] p-5 flex-grow">
              <CardHeader className="">
                <CardTitle className="font-bold text-[16px] leading-4">Details</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(generateTest)}
                  >
                    <div className="grid grid-cols-2 gap-4">
                   
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-label text-sm mb-3">Test Name</FormLabel>
                              <FormControl>
                                <Input className="border border-text-input rounded py-3 px-4 text-sm text-[rgba(255, 255, 255, 0.80)] bg-[#141414]" {...field} {...register("name", {
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
                         <FormField
                          control={form.control}
                          name="sampleRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-label text-sm mb-3">Sample Rate</FormLabel>
                              <FormControl>
                                <Input className="border border-text-input rounded py-3 px-4 text-sm text-white bg-[#141414]" type="number" {...field} {...register("sampleRate", {
                                  required: "SampleRate is required",
                                })} />
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

                    </div>
                    <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-label text-sm mb-3">Description</FormLabel>
                              <FormControl>
                                <Textarea rows={4} className="border border-text-input rounded py-3 px-4 text-sm text-[rgba(255, 255, 255, 0.80)] bg-[#141414]" {...field} {...register("description", {
                                })} />
                              </FormControl>
                              {/* {errors.description && (
                                <FormDescription className="text-red-500 text-xs">
                                  {errors.description.message}
                                </FormDescription>
                              )} */}


                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    <p className="font-bold text-[16px] leading-4 mt-[21px]">Variants</p>
                    <div className="flex items-center gap-3.5 my-4">
                      <Tabs defaultValue="a" className="createTest w-full">
                        <TabsList className="w-full p-0 font-medium leading-4 flex justify-start gap-2">
                          <TabsTrigger value="a" className="text-[#ffffff9e] p-2">Variant A</TabsTrigger>
                          <TabsTrigger value="b" className="text-[#ffffff9e] p-2">Variant B</TabsTrigger>
                        </TabsList>

                        <TabsContent value="a" className="py-5">
                          <section className={`mb-2 grid grid-cols-2 gap-2`}>
                           <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">Variant Name</Label>
                              <Input 
                               id="message-2" className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Original.variantName")} />

                            </section>
                          </section>
                          <section className={`mb-2 grid grid-cols-2 gap-2`}>
                            <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">CSS</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Original.codeCSS")} />

                            </section>
                            <section className={`flex flex-col`}>

                              <Label htmlFor="message-2" className="text-label text-sm mb-3">JavaScript</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Original.codeJS")} />

                            </section>

                          </section>
                        </TabsContent>

                        <TabsContent value="b" className="py-5">
                        <section className={`mb-2 grid grid-cols-2 gap-2`}>
                           <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">Variant Name</Label>
                              <Input 
                               id="message-2" className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Variant.variantName")} />

                            </section>
                          </section>
                          <section className={`mb-2 grid grid-cols-2 gap-2`}>
                            <section className={`flex flex-col`}>
                              <Label htmlFor="message-2" className="text-label text-sm mb-3">CSS2</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Variant.codeCSS")} />

                            </section>
                            <section className={`flex flex-col`}>

                              <Label htmlFor="message-2" className="text-label text-sm mb-3">JavaScript2</Label>
                              <Textarea placeholder="Type your message here." id="message-2" rows={6} className="border border-text-input rounded py-3 px-4 text-sm text-[#ffffffcc] bg-[#ffffff21]"   {...register("Variant.codeJS")} />

                            </section>

                          </section>
                        </TabsContent>

                      </Tabs>
                    </div>
                    <section className={ showOutput? "mt-4 flex flex-col gap-2 w-full bg-white rounded p-4" : "mt-4 flex flex-col gap-2 w-full bg-transparent rounded p-4"}>
          
                        <Button
                          type={"button"}
                          onClick={() => {
                            setShowOutput((prev) => !prev)
                            // delay 1 sec and scroll into view
                            setTimeout(() => {
                              toggleRef.current?.scrollIntoView({ behavior: "smooth" })
                            }, 100)
                          }}
                          className={showOutput ?  "text-gray-600 dark:text-gray-600 pt-1 shadow-none" : "text-white  pt-1 shadow-none"}
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
                      </section>
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
        {/* <div className="flex-auto w-full md:w-1/2 lg:w-2/3 xl:w-1/4">
          <div className="h-full flex flex-col">
            <Card className="w-full bg-[#00000042] border-none p-5 flex-grow">
              <CardHeader className="">
                <CardTitle className="font-bold text-lg leading-4 text-white">Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Tabs defaultValue="a" className="screenShot w-full">
                      <TabsList className="grid w-full grid-cols-2 text-base font-medium leading-4 p-0">
                        <TabsTrigger value="a" className="text-[#ffffff9e]">Variant A</TabsTrigger>
                        <TabsTrigger value="b" className="text-[#ffffff9e]">Variant B</TabsTrigger>
                      </TabsList>
                      <TabsContent value="a">
                        <Card className="border-dashed border-2 rounded-none">
                          <CardHeader>
                            <CardTitle className="text-white">Variant A</CardTitle>
                          </CardHeader>
                        </Card>
                      </TabsContent>
                      <TabsContent value="b">
                        <Card className="border-dashed border-2 rounded-none">
                          <CardHeader>
                            <CardTitle className="text-white">Variant B</CardTitle>
                          </CardHeader>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div className="md:col-span-1">
                    <Card className="w-full bg-[#00000042] border-none p-5">
                      <CardHeader className="">
                        <CardTitle className="font-bold text-lg leading-4 text-white">Screenshots</CardTitle>
                      </CardHeader>
                      <CardContent>

                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}

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
    </div>
  )
}

export default Create

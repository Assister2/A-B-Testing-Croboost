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
});

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })



  return (
    <div className="p-5 bg-main min-w-screen min-h-screen">
      <Form {...form}>
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
              {/* <ul className="flex flex-wrap">
                <li className="mr-2">
                  <button
                    type={"button"}
                    onClick={() => setTab("Original")}
                    className={`inline-block p-3 ${tab === "Original"
                        ? "active dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                  >
                    Original (A)
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    type={"button"}
                    onClick={() => setTab("Variant")}
                    className={`inline-block p-3 ${tab === "Variant"
                        ? "active dark:text-blue-500 dark:border-blue-500 hover"
                        : "hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300"
                      }`}
                  >
                    Variant (B)
                  </button>
                </li>
              </ul> */}
            </div>
            {/* <div className="text-sm my-2">
              {tab === "Original" && (
                <section className={`mb-2 grid grid-cols-2 gap-2`}>
                  <section className={`flex flex-col`}>
                    <label className="text-label text-sm mb-3">
                      Original JavaScript
                    </label>
                    <textarea
                      rows={4}
                      className="border border-text-input rounded py-3 px-4 text-sm text-black"
                      {...register("Original.codeJS")}
                    />
                  </section>
                  <section className={`flex flex-col`}>
                    <label className="text-label text-sm mb-3">
                      Original CSS
                    </label>
                    <textarea
                      rows={4}
                      className="border border-text-input rounded py-3 px-4 text-sm text-black"
                      {...register("Original.codeCSS")}
                    />
                  </section>
                </section>
              )}
              {tab === "Variant" && (
                <section className={`mb-2 grid grid-cols-2 gap-2`}>
                  <section className={`flex flex-col`}>
                    <label className="text-label text-sm mb-3">
                      Variant JavaScript
                    </label>
                    <textarea
                      rows={4}
                      className="border border-text-input rounded py-3 px-4 text-sm text-black"
                      {...register("Variant.codeJS")}
                    />
                  </section>
                  <section className={`flex flex-col`}>
                    <label className="text-label text-sm mb-3">Variant CSS</label>
                    <textarea
                      rows={4}
                      className="border border-text-input rounded py-3 px-4 text-sm text-black"
                      {...register("Variant.codeCSS")}
                    />
                  </section>
                </section>
              )}
            </div> */}
          </section>
          <section className="mt-4 flex flex-col gap-2 w-full lg:w-3/5 bg-white rounded p-4">
            {/* <h3 className="font-bold text-lg text-black">
            Current Test
          </h3> */}
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
      </Form>
    </div>
  )
}

export default Create

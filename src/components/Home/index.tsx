import { Button } from "@/components/ui/button"
import Input from "../components/Input";
import { useEffect, useState } from "react";

import { postLogin } from "../../client/auth";

const Home = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postLogin({email, password})
    .then(res => {
      window.location.replace('/');
    })
    .catch(e => {
      setError(String(e.message));
      console.log(e);
    })
  }

  // useEffect(() => {
  //   document.addEventListener('keydown', (e: KeyboardEvent) => {
  //     if (e.key === 'Enter') {
  //       handleLogin(e);
  //     }
  //   })
  // }, [])
  
  return (
    <section className="bg-[#1B1D1F] flex content-center items-center justify-center min-h-[100vh]">
        <section className="py-[63px] px-6 flex gap-[19px]">
            <div className="grid gap-[19px]">
                <div className="xl:col-start-1 xl:col-end-3 flex flex-col gap-[30px] md:w-[276px]">
                    <div className="p-6 bg-black flex flex-col gap-[10px] rounded-[8px]">
                        <h2 className="text-[16px] font-bold leading-[120%] text-white">Create your first A/B test</h2>
                        <h3 className="text-[12px] leading-[140%] text-white  mb-[15px]">Variant tests, redirect tests and more options</h3>
                        <button className="green-button justify-center items-center w-full">
                            Create test
                        </button>
                        <button className="green-button bg-[#323F3B] justify-center items-center w-full">
                            Read our docs
                        </button>
                    </div>
                    <div className="">
                        <div className="bg-[#303133] p-6 rounded-[8px]">
                            <h2 className="text-white text-[16px] font-bold leading-[120%]">
                                Read our croboost guide for ecom stores
                            </h2>
                            <button className="mt-[10px] text-[12px] green-button bg-[#673468] justify-center items-center w-full">
                                Read exclusive guide
                            </button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:row-start-2 md:row-end-2 md:col-start-1 md:col-end-7 xl:row-start-1 xl:row-end-1 xl:col-start-4 xl:col-end-8 bg-[#303133] xl:w-[490px] p-6 sm:flex flex-col rounded-[8px] gap-[10px]">
                    <h2 className="text-white text-[16px] font-bold leading-[120%]">Exclusive website audit for hourscollection.com</h2>
                    <h3 className="text-[12px] leading-[140%] text-white  mb-[15px] w-[310px]">Read our 10 page report about your website with advanced tips, placeholder, etc.</h3>
                    <button className="green-button justify-center items-center w-[138px]">
                        Unlock report
                    </button>
                    <div className="flex gap-[10px]">
                        <img src="/Home_10210.png"/>
                        <img src="/Home_10211.png"/>
                    </div>
                </div>
                <div className="hidden md:col-start-4 md:col-end-7 xl:col-start-9 xl:col-end-12 sm:flex gap-[40px] flex-col">
                    <div className="bg-[#303133] p-6 rounded-[8px] flex flex-col gap-[10px]">
                        <h2 className="text-white text-[16px] font-bold leading-[120%]">
                            Download our Chrome extension
                        </h2>
                        <h3 className="text-[12px] leading-[140%] text-white  mb-[15px] w-[310px]">Read our 10 page report about your website with advanced tips, placeholder, etc.</h3>

                        <button className="text-[12px] green-button bg-[#673468] justify-center items-center w-[138px] ">
                            Download Now
                        </button>
                    </div>
                    <div className="bg-[#303133] p-6 rounded-[8px] flex flex-col gap-[10px]">
                        <h2 className="text-white text-[16px] font-bold leading-[120%]">
                            Our latest blog post
                        </h2>
                        <h3 className="text-[12px] leading-[140%] text-white  mb-[15px] w-[310px]">Read our 10 page report about your website with advanced tips, placeholder, etc.</h3>

                        <button className="text-[12px] green-button bg-[#323F3B] justify-center items-center w-[138px] ">
                            Read Post
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </section>
  );
};

export default Home;

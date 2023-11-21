import React, {useState} from "react";
import { Button } from "@/components/ui/button"
import Input from "../components/Input";

const GetStarted = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    window.location.replace(url);
  }
  return (
    <>
    {
      loading ? 
      <section className="bg-[#1B1D1F] flex content-center items-center justify-center min-h-[100vh]">
         <section className="p-6 sm:px-6 lg:px-8">
            <div className="w-[294px] rounded-[8px] p-6 bg-black backdrop-blur-[20px]">
              <img src="logo.png"/>
              <h2 className="mt-10 mb-8 text-left text-[16px] font-bold text-white">
                Analyzing your website...
              </h2>
            </div>
         </section>
      </section>
      :
      <section className="bg-[#1B1D1F] flex content-center items-center justify-center min-h-[100vh]">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-[294px] p-6 bg-black space-y-2 backdrop-blur-[20px]">
          <div>
            <img src="logo.png"/>
            <h2 className="mt-6 text-left text-[16px] font-bold text-white">
              Welcome to croboost
            </h2>
          </div>
          <form className="mt-8 space-y-2" onSubmit={handleRegisterSubmit}>
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <Input
                  label="Website url"
                  placeHolder="enter your website url"
                  value={url}
                  inputClassName="text-[#727272] py-1 px-2 text-[12px] font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]"
                  onChange={setUrl}
                />
              </div>
            </div>
              { error && <span className="text-red-500 background-transparent shadow-none">{error}</span> }
            <div>
              
              {/* <Button type="submit" text="Sign Up" onClick={handleRegisterSubmit}/> */}
              <Button type="submit"  className="mx-auto my-2 bg-[#10503D] hover:bg-[#10503D] text-white p-3  rounded shadow-md disabled:bg-neutral-500 w-full">Get Started</Button>
  
            </div>
          </form>
        </div>
        </section>
      </section>
    }
    </>
  );
};

export default GetStarted;

import { Button } from "@/components/ui/button"
import Input from "../components/Input";
import { useEffect, useState } from "react";
import "./Login.scss"

import { postLogin } from "../../client/auth";

const Login = () => {

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
      <section className="py-12 px-4 sm:px-6 lg:px-8">
     
        <div className="w-[294px] p-6 bg-black space-y-2 backdrop-blur-[20px]">
          <div>
            <img src="logo.png"/>
            <h2 className="mt-6 text-left text-[16px] font-bold text-white">
              Sign In
            </h2>
          </div>
          <form className="mt-8 space-y-2" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm ">
              <div>
                <Input label="Email Address" inputClassName="text-[#727272] py-1 px-2 font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]" value={email} onChange={setEmail} />
              </div>
              <div className="mt-5">
                <Input type="password" label="Password" inputClassName="py-1 px-2 text-[#727272] font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]" value={password} onChange={setPassword} />
              </div>
            </div>
            { error && <span className="text-red-500 background-transparent shadow-none">{error}</span> }
            <div>
              
              <Button type="submit" className="mx-auto my-2 bg-button text-white p-3  rounded shadow-md disabled:bg-neutral-500 w-full">Sign In</Button>
              {/* mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full */}
              <button
                id="back-to-login"
                className="text-left text-[12px] font-bold text-white background-transparent py-1 text-sm underline outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => window.location.replace("/register")}
                type="button"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  );
};

export default Login;

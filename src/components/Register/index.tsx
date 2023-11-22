import React, {useState} from "react";
import { postSignUp } from "../../client/auth";
import { Button } from "@/components/ui/button"
import "./Register.scss"

import Input from "../components/Input";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("")
  const [error, setError] = useState("");

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postSignUp({email, confirm_email: email, password, confirm_password: confirm_password})
    .then(res => {
      console.log(res);
      window.location.replace('/getStarted');
    })
    .catch(e => {
      setError(String(e.message).replace('Password did not conform with policy: ', ''));
    });
  }
  return (
    <section className="bg-[#1B1D1F] flex content-center items-center justify-center min-h-[100vh]">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[294px] p-6 bg-black space-y-2 backdrop-blur-[20px]">
        <div>
          <img src="logo.png"/>
          <h2 className="mt-6 text-left text-[16px] font-bold text-white">
            Sign Up
          </h2>
        </div>
        <form className="mt-8 space-y-2" onSubmit={handleRegisterSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            <div>
              <Input
                label="Email Address"
                value={email}
                inputClassName="text-[#727272] py-1 px-2 font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]"
                onChange={setEmail}
              />
            </div>
            {/* <div>
              <Input
                label="Full Name"
                value={fullName}
                onChange={setFullName}
              />
            </div> */}
            <div>
              <Input
                type="password"
                label="Password"
                value={password}
                inputClassName="text-[#727272] py-1 px-2 font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]"
                onChange={setPassword}
              />
                 <label className="text-[10px] font-bold text-[#727272]">8 character minimum with special character</label>
            </div>
         
            {/* <div>
              <Input
                type="password"
                label="Password Confirmation"
                value={password}
                onChange={setPassword}
              />
            </div> */}
            <div>
              <Input
                type="password"
                label="Confirm Password"
                value={confirm_password}
                inputClassName="text-[#727272] py-1 px-2 font-medium bg-[#141414] border-0 rounded-[4px] shadow-[0px_4px_15px_0px_rgba(0, 0, 0, 0.06)]"
                onChange={setConfirmPassword}
              />
            </div>
          </div>
            { error && <span className="text-red-500 background-transparent shadow-none">{error}</span> }
          <div>
            
            {/* <Button type="submit" text="Sign Up" onClick={handleRegisterSubmit}/> */}
            <Button type="submit"  className="mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full">Sign Up </Button>
            <button
              className="text-left text-[12px] font-bold text-white background-transparent py-1 text-sm underline outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {
                window.location.replace('/login');
              }}
              type="button"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
    </section>
  );
};

export default Register;

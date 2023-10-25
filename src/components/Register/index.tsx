import React, {useState} from "react";
import { postSignUp } from "../../client/auth";
import { Button } from "@/components/ui/button"
import "./Register.scss"

import Input from "../components/Input";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postSignUp({email, confirm_email: email, password, confirm_password: password})
    .then(res => {
      console.log(res);
      window.location.replace('/login');
    })
    .catch(e => {
      setError(String(e.message).replace('Password did not conform with policy: ', ''));
    });
  }
  return (
    <section className="mt-24 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                label="Email Address"
                value={email}
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
                onChange={setPassword}
              />
            </div>
            {/* <div>
              <Input
                type="password"
                label="Password Confirmation"
                value={password}
                onChange={setPassword}
              />
            </div> */}
          </div>
            { error && <span className="text-red-500 background-transparent shadow-none">{error}</span> }
          <div>
            <button
              className="text-label background-transparent py-1 text-sm underline outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {
                window.location.replace('/login');
              }}
              type="button"
            >
              Back to Login
            </button>
            {/* <Button type="submit" text="Sign Up" onClick={handleRegisterSubmit}/> */}
            <Button type="submit"  className="mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full">Sign Up </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;

import { Button } from "@/components/ui/button"
import Input from "../components/Input";
import { useEffect, useState } from "react";

import { postLogin } from "../../client/auth";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postLogin({email, password})
    .then(res => {
      console.log('OK')
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
    <section className="mt-24 flex content-center items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input label="Email Address" value={email} onChange={setEmail} />
            </div>
            <div>
              <Input type="password" label="Password" value={password} onChange={setPassword} />
            </div>
          </div>
          { error && <span className="text-red-500 background-transparent shadow-none">{error}</span> }
          <div>
            <button
              id="back-to-login"
              className="text-label background-transparent py-1 text-sm underline outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => window.location.replace("/register")}
              type="button"
            >
              Sign Up
            </button>
            <Button type="submit" className="mx-auto my-2 bg-button text-black p-3  rounded shadow-md disabled:bg-neutral-500 w-full">Sign In</Button>
            {/* mx-auto my-2 bg-button text-white p-3 w-36 rounded shadow-md disabled:bg-neutral-500 w-full */}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;

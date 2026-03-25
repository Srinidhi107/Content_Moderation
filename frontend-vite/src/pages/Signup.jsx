import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance, API } from "../api";



function Signup(){

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  // Match login screen behavior by locking the CTA while the request is in progress.
  const [isSubmitting,setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const signupUser = async () => {

    // Basic client-side validation gives faster feedback before the request reaches the backend.
    if(username.trim() === "" || email.trim() === "" || password.trim() === ""){
      alert("Please fill all fields");
      return;
    }

    try{
      setIsSubmitting(true);

      await axiosInstance.post(
        API.signup,
        {
          username: username.trim(),
          email: email.trim(),
          password: password.trim()
        }
      );

      alert("Account created successfully");

      navigate("/");

    }catch(err){
      console.error("Signup error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Signup failed. Please try again.";
      alert(errorMessage);
    }finally{
      setIsSubmitting(false);
    }

  };

  return(
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-64 w-64 rounded-full bg-teal-200/60 blur-3xl" />

      {/* Match login by centering signup so both entry screens feel focused and simple. */}
      <div className="group relative w-full max-w-[420px] rounded-[34px] border border-white/70 bg-white/82 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            MiniSocial
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-slate-800">
            Create account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join the community.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[300px] text-center">
          <div>
            <input
              placeholder="Username"
              className="mx-auto block h-[35px] w-full max-w-[250px] rounded-[6px] border border-slate-500 bg-white px-4 text-lg text-left text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] outline-none transition duration-200 placeholder:text-left placeholder:text-slate-400 hover:border-slate-600 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-300"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <input
              placeholder="Email Address"
              className="mx-auto block h-[35px] w-full max-w-[250px] rounded-[6px] border border-slate-500 bg-white px-4 text-lg text-left text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] outline-none transition duration-200 placeholder:text-left placeholder:text-slate-400 hover:border-slate-600 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-300"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <input
              type="password"
              placeholder="Password"
              className="mx-auto block h-[35px] w-full max-w-[250px] rounded-[6px] border border-slate-500 bg-white px-4 text-lg text-left text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] outline-none transition duration-200 placeholder:text-left placeholder:text-slate-400 hover:border-slate-600 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-300"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: "32px" }}>
          <button
            className="mx-auto block h-[35px] w-full max-w-[210px] rounded-full bg-gradient-to-r from-slate-900 via-teal-700 to-cyan-600 px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:from-slate-800 hover:via-teal-800 hover:to-cyan-700 hover:shadow-[0_12px_28px_rgba(15,23,42,0.34)] active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={signupUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-teal-700 decoration-2 underline-offset-4 transition hover:text-teal-900 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>

  );

}

export default Signup;
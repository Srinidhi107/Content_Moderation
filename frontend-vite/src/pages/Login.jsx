import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance, API } from "../api";



function Login(){

  const [loginId,setLoginId] = useState("");
  const [password,setPassword] = useState("");
  // Keep track of the submit state so the button can show progress and avoid double clicks.
  const [isSubmitting,setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const loginUser = async () => {

    // Trim values so accidental spaces do not break login.
    if(loginId.trim() === "" || password.trim() === ""){
      alert("Please enter both username/email and password");
      return;
    }

    try{
      setIsSubmitting(true);

      const res = await axiosInstance.post(
        API.login,
        {
          email:loginId.trim(),
          password:password.trim()
        }
      );

      if(res.data?.authenticated && res.data?.user && res.data?.token){

        // Why: Store token for backend-protected APIs and keep user object for UI display.
        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        navigate("/feed");

      }else{
        alert("Invalid username/email or password");
      }

    }catch(err){
      console.error("Login error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Login failed. Please try again.";
      alert(errorMessage);
    }finally{
      setIsSubmitting(false);
    }

  };

  return(
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-64 w-64 rounded-full bg-teal-200/60 blur-3xl" />

      {/* Keep auth in the center so the eye lands directly on the form instead of scanning page edges. */}
      <div className="group relative w-full max-w-[420px] rounded-[34px] border border-white/70 bg-white/82 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            MiniSocial
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-slate-800">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in to continue.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[300px] text-center">
          <div>
            <input
              placeholder="Email or Username"
              className="mx-auto block h-[35px] w-full max-w-[250px] rounded-[6px] border border-slate-500 bg-white px-4 text-lg text-left text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] outline-none transition duration-200 placeholder:text-left placeholder:text-slate-400 hover:border-slate-600 focus:!border-blue-600 focus:!ring-2 focus:!ring-blue-300"
              value={loginId}
              onChange={(e)=>setLoginId(e.target.value)}
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
            className="mx-auto block h-[35px] w-full max-w-[210px] rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-400 px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(13,148,136,0.34)] transition duration-200 hover:-translate-y-0.5 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 hover:shadow-[0_12px_28px_rgba(37,99,235,0.45)] active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={loginUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-teal-700 decoration-2 underline-offset-4 transition hover:text-teal-900 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>

  );

}

export default Login;
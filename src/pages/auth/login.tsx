import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "@/redux/services/authApi";
import { setRole, setToken } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Label } from "@/components/ui/label";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { data: loginData, isLoading }] = useLoginMutation()
  const loginInitialState = {
    email: "",
    password: ""
  }
  const [loginState, setLoginState] = useState(loginInitialState);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit called")
    event.preventDefault();
    try {
      const response = await login(loginState).unwrap();
      console.log("response", response);
      console.log("loginData", loginData)

      form.reset();
      dispatch(setToken(response.data.token));

      if (response?.data?.action === "VERIFY_ACCOUNT") {
        console.log("this if block print")
        navigate("/auth/otp");
      } else if (!(response?.success === true || (typeof response?.success === "string" && response?.success.toLowerCase() === "true"))) {
        console.log("this else if block print");
        return;
      } else {
        console.log("response?.data?.role", response?.data?.role)
        dispatch(setRole(response?.data?.role?.toLowerCase()));

        if (response?.data?.role?.toLowerCase() === "admin") {
          navigate("/admin/thread/new");
        } else if (response?.data?.role?.toLowerCase() === "user") {
          navigate("/shop/threads");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };


  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col justify-center w-full h-full max-w-sm z-20 px-2 md:px-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Login</h1>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="enter email" onChange={(e) => setLoginState({ ...loginState, email: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="new password" type="password" onChange={(e) => setLoginState({ ...loginState, password: e.target.value })} />
            </div>
            <Button
              className="w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
        <div>
          <p className="text-sm text-center mt-4">
            <span>
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-blue-500">
                Register
              </Link>
            </span>
          </p>
        </div>
      </div>
      <div className="absolute top-0 w-full h-full z-10 opacity-[7%]">
        <img src="https://i.pinimg.com/736x/a5/da/ec/a5daec8692aac666fb75dcaccc13240c.jpg" alt="" className="w-full h-full object-cover object-center" />
      </div>
    </div>
  );
};

export default Login;

import { Outlet } from 'react-router-dom';
import { object } from 'zod';

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="relative hidden lg:flex w-1/2">
        <img
          src="https://i.pinimg.com/736x/f0/4f/c4/f04fc447e85ec715be62c3a0d14dda1e.jpg"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-sm opacity-80">
            Manage your account and explore features seamlessly.
          </p>
        </div>
      </div>
      <div className={`flex flex-1 items-center justify-center bg-background`}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout

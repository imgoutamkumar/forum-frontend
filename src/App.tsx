
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ShopLayout from './components/shop/layout'
import Cart from './pages/shop/cart'
import Login from './pages/auth/login'
import AuthLayout from './components/auth/layout'
import Home from './pages/shop/home'
import Register from './pages/auth/register'
import Profile from './pages/auth/profile'
import AdminLayout from './components/admin/AdminLayout'
import RoleGuard from './guards/RoleGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import Checkout from './pages/shop/Checkout'
import Otp from './pages/auth/Otp'
import NewThread from './pages/admin/NewThread'
import ThreadPage from './pages/shop/ThreadPage'
import AllThreads from './pages/shop/AllThreads'
import CreatePost from './pages/admin/CreatePost'
import ThreadDetailPage from './pages/admin/ThreadDetailPage'
import Threads from './pages/admin/Threads'
import NotFound from './pages/auth/NotFound'

function App() {


  return (
    <Routes>
      {/* default redirect to login */}
      {/* <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} /> 
      </Route> */}
      <Route path="/" element={<Navigate to="/auth/login" />} />

      <Route path='/auth' element={<AuthLayout />} >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path='/auth/otp' element={<Otp />}></Route>

      <Route element={<RoleGuard allowedRoles={["user", "admin"]} />}>
        <Route path='/threads' element={<ShopLayout />} >
          <Route path='profile/:id' element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path='cart' element={<Cart />} />
          <Route path='all' element={<AllThreads />} />
          <Route path="thread/:threadId" element={<ThreadPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>
      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        <Route path='/admin' element={<AdminLayout />} >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='profile/:id' element={<Profile />} />
          <Route path="threads/all" element={<Threads />} />
          <Route path='all-threads' element={<AllThreads />} />
          <Route path="thread/new" element={<NewThread />} />
          <Route path="thread/:threadId" element={<ThreadDetailPage />} />
          <Route path='thread/new-post/:threadId' element={<CreatePost />} />

          {/* <Route path="product/new" element={<NewProduct />} /> */}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

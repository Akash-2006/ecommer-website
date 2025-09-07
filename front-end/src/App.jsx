import { BrowserRouter, Route, Routes } from "react-router-dom"
import { UserLayout } from "./components/Layout/UserLayout"
import { Home } from "./pages/Home"
import { Toaster } from "sonner"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import Profile from "./pages/Profile"
import { AppProvider } from "./context/AppContext"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import SearchResults from "./pages/SearchResults"
import MyOrdersPage from "./pages/MyOrdersPage"

function App() {

  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true , v7_relativeSplatPath: true}}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout/>} >
          <Route index element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/men" element={<ProductsPage gender="men" />} />
          <Route path="/women" element={<ProductsPage gender="women" />} />
          <Route path="/top-wear" element={<ProductsPage category="Top Wear" />} />
          <Route path="/bottom-wear" element={<ProductsPage category="Bottom Wear" />} />
          <Route path="/product/:sku" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/orders" element={<MyOrdersPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App

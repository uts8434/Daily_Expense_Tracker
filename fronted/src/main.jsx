import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './assets/Login.jsx'
import Index from './Dashboard/Index.jsx'
import Expense from './Dashboard/Expense.jsx'
import AddWallet from './assets/AddWallet.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './assets/Layout.jsx'
import {Provider} from "react-redux"
import store from './Redux/store.js'
import Forgotpass from './assets/Forgotpass.jsx'


const route=createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout/>}>
    <Route path='' element={<Login/>}/>
    <Route path ="/forgot-password" element={<Forgotpass/>}/>

    <Route path='dashboard' element={<Index/>} />
    <Route path='dashboard/addwallet' element={<AddWallet/>}/> 
    <Route path='dashboard/expense' element={<Expense/>}/> 
      
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}>
      <RouterProvider router={route}/>
    </Provider>
   
  </StrictMode>
)

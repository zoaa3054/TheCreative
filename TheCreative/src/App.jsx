import {Route, createRoutesFromElements, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import EmptyPage from "./Pages/EmptyPage";
import WelcomePageLayout from './Layouts/WelcomePageLayout';
import StudentHomePageLayout from './Layouts/StudentHomePageLayout';
import AdminHomePageLayout from './Layouts/AdminHomePageLayout';
import RegisterPage from './Pages/RegisterPage';
import LecturePage from './Pages/LecturePage';
import StudentPage from './Pages/StudentPage';
import EditLecturePage from './Pages/EditLecturePage';
import { useEffect } from 'react';
import Test from './Pages/Test';

function App() {
  // const backend = `https://192.168.1.17:8081`;
  const backend = `https://the-creative.vercel.app`;

  useEffect(()=>{
    addEventListener('load', ()=>{
      navigator.serviceWorker.register('/sw.js')
      .then((registration)=>{
        if(registration) console.log(registration);
        else console.log("Registration failed");
      })
      .catch((error)=>console.log(error))
    })
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<WelcomePageLayout/>}/>
        <Route path='/register' element={<RegisterPage backend={backend}/>}/>
        <Route path='/home' element={<StudentHomePageLayout backend={backend}/>}/>
        <Route path='/lecture/:id' element={<LecturePage/>}/>
        <Route path='/edit/lecture/:id' element={<EditLecturePage/>}/>
        <Route path='/student/:id' element={<StudentPage/>}/>
        <Route path='/admin/home' element={<AdminHomePageLayout backend={backend}/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='*' element={<EmptyPage/>}/>
      </>
      
  ));
  return (
    <>
      <RouterProvider router={router}/>
      <ToastContainer />
    </>
  )
}

export default App

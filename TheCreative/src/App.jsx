import {Route, createRoutesFromElements, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import EmptyPage from "./Pages/EmptyPage";
import WelcomePageLayout from './Layouts/WelcomePageLayout';
import StudentHomePageLayout from './Layouts/StudentHomePageLayout';
import AdminHomePageLayout from './Layouts/AdminHomePageLayout';
import WelcomePage from './Pages/WelcomePage';
import RegisterPage from './Pages/RegisterPage';
import StudentHomePage from './Pages/StudentHomePage';
import AdminHomePage from './Pages/AdminHomePage';

function App() {
  const backEnd = `https://192.168.1.17:8081`;
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<WelcomePageLayout/>}>
          <Route index element={<WelcomePage/>}/>
        </Route>
        <Route path='/register' element={<RegisterPage backEnd={backEnd}/>}/>
        <Route path='/home' element={<StudentHomePageLayout/>}>
          <Route index element={<StudentHomePage/>}/>
        </Route>
        <Route path='/admin/home' element={<AdminHomePageLayout/>}>
          <Route index element={<AdminHomePage/>}/>
        </Route>
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

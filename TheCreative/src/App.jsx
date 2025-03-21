import {Route, createRoutesFromElements, RouterProvider, createBrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import EmptyPage from "./Pages/EmptyPage";
import WelcomePageLayout from './Layouts/WelcomePageLayout';
import StudentHomePageLayout from './Layouts/StudentHomePageLayout';
import AdminHomePageLayout from './Layouts/AdminHomePageLayout';
import WelcomePage from './Pages/WelcomePage';
import RegisterPage from './Pages/RegisterPage';

function App() {
  const backEnd = `https://localhost:8081`;
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<WelcomePageLayout/>}>
          <Route index element={<WelcomePage/>}/>
        </Route>
        <Route path='/register' element={<RegisterPage backEnd={backEnd}/>}/>
        <Route path='/home' element={<StudentHomePageLayout/>}>
          
        </Route>
        <Route path='/admin/home' element={<AdminHomePageLayout/>}>
          
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

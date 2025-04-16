import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { State } from "country-state-city";
import Spinner from "./Spinner";
import './FormStyle.css';


const Form = ({ setUsedForm, backend })=>{
    const [formVariables, setFormVariables] = useState({city: State.getStatesOfCountry('EG')[0].name, grade: "M3"});
    const [error, setError] = useState({});
    const [numberOfLoginAttmpts, setNumberOfLoginAttmpts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigator = useNavigate();
    const [focus, setFocus] = useState(false);
    
    useEffect(()=>{
        let container = document.getElementById('container')
        if (container){
            setTimeout(() => {
                container.classList.add('sign-in')
            }, 200)
        }
    }, [])
    const toggle = (form) => {
        if (form == 'login'){
            container.classList.remove('sign-up');
            container.classList.add('sign-in');
        }
        else{
            container.classList.remove('sign-in');
            container.classList.add('sign-up'); 
        }
        changeForm(form)
    }
    

    const notifyError = (message)=>{
        toast.error(message);
    }

    const notifySuccess = (message)=>{
        toast.success(message);
    }
    const changeForm = (newForm)=>{
        if (newForm == 'login'){
            setFormVariables({});
        }
        else{
            setFormVariables({
                city: State.getStatesOfCountry('EG')[0].name,
                grade: "M3"
            });
        }
        setUsedForm(newForm);
    }

    const checkSignupInput = ()=>{
        setError({});
        
        let allFine = true;
        let errorText = '';

        for (let index in Object.keys(formVariables)){
            let name = Object.keys(formVariables)[index];
            let phone = '';
            switch(name){
                case 'username':
                        if (!/^[^A-Z\s]+$/.test(formVariables[name])){
                            errorText = "Username can not contain CAPITAL letters or spaces."
                            setError({...error, [name]:errorText});
                            notifyError(errorText);
                            allFine = false;
                        }
                    break;
                case 'password':
                    if (formVariables[name].length<8){
                        errorText = "Password must be at least 8 characters";
                        setError({...error, [name]:errorText});
                        notifyError(errorText);
                        allFine = false;
                    }
                    break;
                case 'studentPhone':
                    phone = formVariables[name];
                    if (!/^\+20/.test(phone))
                        phone = '+2' + phone;
                    if (!/^\+20\d{10}$/.test(phone)){
                        errorText = "Student number is not correct";
                        setError({...error, [name]:errorText});
                        notifyError(errorText);
                        allFine = false;
                    }
                    else setFormVariables({...formVariables, [name]: phone});
                    break;
                case 'parentPhone':
                    phone = formVariables[name];
                    if (!/^\+20/.test(phone))
                        phone = '+2' + phone;
                    if (!/^\+20\d{10}$/.test(phone)){
                        errorText = "Parent number is not correct";
                        setError({...error, [name]:errorText});
                        notifyError(errorText);
                        allFine = false;
                    }
                    else setFormVariables({...formVariables, [name]: phone});
                    break;
            }
        }
        // check that student and parent phone numbers are not the same
        if (formVariables['studentPhone'] == formVariables['parentPhone']){
            errorText = "Parent phone number can not be the same as student phone number";
            setError({...error, parentPhone: errorText})
            notifyError(errorText);
            allFine = false;
        }
        return allFine;
    }

    const signup = async(e)=>{
        setIsLoading(true);
        if (checkSignupInput()){
            await fetch(`${backend}/signup`, {
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formVariables)
            })
            .then((res)=>{
                if (res.status == 201){
                    const token =  res.headers.get('authorization').split(" ")[1];
                    sessionStorage.setItem("theCreativeAuthToken", token);
                    notifySuccess("Welcome to TheCreative in math");
                    // navibage to home page
                    navigator('/home');
                } 
                else if (res.status == 409) notifyError("User already exists");
                else notifyError("Something went wrong, Please contact the systems administrators")
                return res.json();
            })
            .then((data)=>console.log(data))
            .catch((error)=>console.log(error));
        }
        setIsLoading(false);
    }

    const login = async(e)=>{
        setIsLoading(true);

        await fetch(`${backend}/login`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include',
            method:"POST",
            body: JSON.stringify({
                username: formVariables.username,
                password: formVariables.password
            })
        })
        .then((res)=>{
            if (res.status == 404){
                if (numberOfLoginAttmpts > 5){
                    notifyError("It appears that this user is not registerd in the system, Please Signup first!");
                    changeForm('signup');
                    setNumberOfLoginAttmpts(0);
                }else{
                    notifyError("Wrong username or password");
                    setError({...error, username: "Wrong username or password", password: "Wrong username or password"});
                    setNumberOfLoginAttmpts(prev=>prev+1);
                }
            }
            else if (res.status == 500 || res.status == 422) {
                notifyError("Something went wrong, please contact system administrator.");
                console.log(res)
            }
            else if (res.status == 200){
                const token =  res.headers.get('authorization').split(" ")[1];
                sessionStorage.setItem("theCreativeAuthToken", token);
            }
            return res.json();
        })
        .then((data)=>{
            console.log(data);
            if (data.person && data.person == 'user') {
                navigator('/home');
            }
            else if (data.person && data.person == 'admin') {
                navigator('/admin/home');
            }
        })
        .catch((error)=>console.log(error));
        setIsLoading(false);
    }
    
    const changeFormVariable = (variable)=>{
        const name = variable.target.name;
        const value = variable.target.value;

        setFormVariables({...formVariables, [name]: value});
    }

    return(
        <div id="container" className="container">
            {/* <!-- FORM SECTION --> */}
            <div className="row">
                {/* <!-- SIGN UP --> */}
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center" >
                        <div className="form sign-up" >
                            <div className="input-group">
                                <i className='bx bxs-user'></i>
                                <input onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{border: error['username']?"2px solid red":"2px solid transparent"}} type="text" value={formVariables.username} onChange={changeFormVariable} name="username" placeholder="Username" required/>
                            </div>
                            <div className="input-group">
                                <i className='bx bx-mail-send'></i>
                                <input onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{border: error['studentPhone']?"2px solid red":"2px solid transparent"}} type="tel" value={formVariables.studentPhone} onChange={changeFormVariable} name="studentPhone" placeholder="Student phone number" required/>
                            </div>
                            <div className="input-group">
                                <i className='bx bxs-lock-alt'></i>
                                <input onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{border: error['parentPhone']?"2px solid red":"2px solid transparent"}} type="tel" value={formVariables.parentPhone} onChange={changeFormVariable} name="parentPhone" placeholder="Parent phone number" required/>
                            </div>
                            <div className="input-group">
                                <i className='bx bxs-lock-alt'></i>
                                <select onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} name="city" style={{backgroundColor:"#a4a4a46a", outline:"none", padding:"0.5rem", cursor:"pointer"}} value={formVariables.city} onChange={changeFormVariable} placeholder="City" required>
                                    {State.getStatesOfCountry('EG').map((state, key)=>(
                                        <option key={key}>{state.name}</option>
                                    ))}
                                </select>						
                            </div>
                            <div className="input-group">
                                <i className='bx bxs-lock-alt'></i>
                                <select onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} name="grade" style={{backgroundColor:"#a4a4a46a", outline:"none", padding:"0.5rem", cursor:"pointer"}} value={formVariables.grade} onChange={changeFormVariable} placeholder="Grade" required>
                                    <option value="M1">Middle 1</option>
                                    <option value="M2">Middle 2</option>
                                    <option value="M3">Middle 3</option>
                                    <option value="S1">Senior 1</option>
                                    <option value="S2">Senior 2</option>
                                </select>						
                            </div>
                            <div className="input-group">
                                <i className='bx bxs-lock-alt'></i>
                                <input onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{border: error['password']?"2px solid red":"2px solid transparent"}} type="password" value={formVariables.password} onChange={changeFormVariable} name="password" placeholder="Password" required/>
                            </div>
                            <button onClick={signup} disabled={isLoading}>
                                {isLoading?<Spinner size={15}/>:"Sign up"}
                            </button>
                           

                            <p>
                                <span>
                                    Already have an account?
                                </span>
                                <Link onClick={()=>toggle('login')} className="pointer">
                                    Log in here
                                </Link>
                            </p>
                        </div>
                    </div>
                
                </div>
                {/* <!-- END SIGN UP --> */}
                {/* <!-- SIGN IN --> */}
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-in">
                            <div className="input-group">
                                <i className='bx bxs-user'></i>
                                <input style={{border: error['username']?"2px solid red":"2px solid transparent"}} type="text" value={formVariables.username} onChange={changeFormVariable} name="username" placeholder="Username" required/>
                            </div>
                            <div className="input-group">
                                <i className='bx bxs-lock-alt'></i>
                                <input style={{border: error['password']?"2px solid red":"2px solid transparent"}} type="password" value={formVariables.password} onChange={changeFormVariable} name="password" placeholder="Password" required/>
                            </div>
                            <button onClick={login} disabled={isLoading}>
                                {isLoading?<Spinner size={15}/>:"login"}
                            </button>
                            <p>
                                <span>
                                    Don't have an account?
                                </span>
                                <Link onClick={()=>toggle('signup')} className="pointer">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="form-wrapper">
            
                    </div>
                </div>
                {/* <!-- END SIGN IN --> */}
            </div>
            {/* <!-- END FORM SECTION --> */}
            {/* <!-- CONTENT SECTION --> */}
            <div className="row content-row" style={{zIndex:"1"}}>
                {/* <!-- SIGN IN CONTENT --> */}
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>
                            Welcome
                        </h2>
        
                    </div>
                    <div className="img sign-in">
            
                    </div>
                </div>
                {/* <!-- END SIGN IN CONTENT --> */}
                {/* <!-- SIGN UP CONTENT --> */}
                <div className="col align-items-center flex-col">
                    <div className="img sign-up">
                    
                    </div>
                    <div className="text sign-up" >
                        <h2 style={{display: focus?"none":"flex"}}>
                            Join with us
                        </h2>
        
                    </div>
                </div>
                {/* <!-- END SIGN UP CONTENT --> */}
            </div>
            {/* <!-- END CONTENT SECTION --> */}
        </div>
    );
};
export default Form;

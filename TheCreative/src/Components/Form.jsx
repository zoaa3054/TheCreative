import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import { State } from "country-state-city";
import Select from "react-select/base";

const slideLift = keyframes`
    from{
        transform: translate(50%, 0%);
        opacity: 0;
    }
    to{
        transform: translate(0%, 0%);
        opacity: 1;
    }
`;

const slideRight = keyframes`
    from{
        transform: translateX(25rem);
    }
    to{
        transform: translateX(0rem);
    }
`;

const slideUp = keyframes`
    from{
        transform: translate(0%, 50%);
        opacity: 0;
    }
    to{
        transform: translate(0%, 0%);
        opacity: 1;
    }
`;

const slideDown = keyframes`
    from{
        transform: translate(0%, -50%);
        opacity: 0;
    }
    to{
        transform: translate(0%, 0%);
        opacity: 1;
    }
`;

const pop = keyframes`
    from{
        scale: 0;
        opacity: 0;
    }
    to{
        scale: 1;
        opacity: 1;
    }
`;


const Form = ({ usedForm, setUsedForm, backEnd })=>{
    const [position, setPosition] = useState(usedForm == 'signup'?0:-25);
    const [formVariables, setFormVariables] = useState({studentPhone: '+20', parentPhone: '+20', city: State.getStatesOfCountry('EG')[0].name, grade: "3"});
    const [error, setError] = useState({});

    const notifyError = (message)=>{
        toast.error(message);
    }

    const notifySuccess = (message)=>{
        toast.success(message);
    }
    const changeForm = (newForm)=>{
        if (newForm == 'login'){
            setFormVariables({});
            setPosition(-25);
        }
        else{
            setFormVariables({
                studentPhone: '+20', 
                parentPhone: '+20', 
                city: State.getStatesOfCountry('EG')[0].name,
                grade: "3"
            });
            setPosition(0);
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
        e.preventDefault();
        
        if (checkSignupInput()){
            await fetch(`${backEnd}/user/signup`, {
                method:"POST",
                credentials: "include",
                body: JSON.stringify(formVariables)
            })
            .then((res)=>{
                if (res.status == 200){
                    notifySuccess("Welcome to TheCreative in math");
                    // route to home page
                } 
                else if (res.status == 409) notifyError("User already exists");
                else notifyError("Something went wrong, Couldn't add user, Please contact the systems administrators")
            })
        }
    }

    const login = (e)=>{
        e.preventDefault();
        console.log(formVariables);
    }
    
    const changeFormVariable = (variable)=>{
        const name = variable.target.name;
        const value = variable.target.value;

        setFormVariables({...formVariables, [name]: value});
    }
    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: "#a4a4a46a",
            cursor: "pointer"
        })
        
    };

    return(
        <Container position={position} onSubmit={(e)=>usedForm == 'signup'?signup(e):login(e)}>
            {usedForm == 'signup'?
            <>
                {/* Signup Form  */}
                <SignupTitle>Create an account</SignupTitle>
                <SignupInputs>
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="username">USERNAME</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: error['username']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="text" value={formVariables.username} onChange={changeFormVariable} name="username" placeholder="Username" required/>
                
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="studentPhone">STUDENT PHONE</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: error['studentPhone']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="tel" value={formVariables.studentPhone} onChange={changeFormVariable} name="studentPhone" placeholder="Student phone number" required/>
                
                
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="parentPhone">PARENT PHONE</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: error['parentPhone']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="tel" value={formVariables.parentPhone} onChange={changeFormVariable} name="parentPhone" placeholder="Parent phone number" required/>
                
                
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="city">CITY</label>
                    <select name="city" style={{backgroundColor:"#a4a4a46a", outline:"none", padding:"0.5rem", cursor:"pointer"}} value={formVariables.city} onChange={changeFormVariable} placeholder="City" required>
                        {State.getStatesOfCountry('EG').map((state, key)=>(
                            <option key={key}>{state.name}</option>
                        ))}
                    </select>

                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="grade">GRADE</label>
                    <select name="grade" style={{backgroundColor:"#a4a4a46a", outline:"none", padding:"0.5rem", cursor:"pointer"}} value={formVariables.grade} onChange={changeFormVariable} placeholder="Grade" required>
                        <option value="3">Middle 3</option>
                        <option value="4">Senior 1</option>
                        <option value="5">Senior 2</option>
                    </select>
                
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="password">PASSWORD</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: error['password']?"2px solid red":"2px solid transparent", outline:"none", padding:"0.5rem"}} type="password" value={formVariables.password} onChange={changeFormVariable} name="password" placeholder="Password" required/>
                
                </SignupInputs>
                <SignupButton type="submit">Create an account</SignupButton>
                <Separator><span>or</span></Separator>
                <SignupFooter>I am already a member! <Link onClick={()=>changeForm('login')}>Login</Link></SignupFooter>
            </>
            :
            <>
                {/* Login Form */}
                <LoginTitle>Login</LoginTitle>
                <LoginInputs>
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="username">USERNAME</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: "none", outline:"none", padding:"0.5rem"}} type="text" value={formVariables.username} onChange={changeFormVariable} name="username" placeholder="Username" required/>
        
                    <label style={{marginRight:"1rem", fontWeight:"bold", fontFamily: "Arial, Helvetica, sans-serif"}} htmlFor="password">PASSWORD</label>
                    <input style={{backgroundColor:"#a4a4a46a", border: "none", outline:"none", padding:"0.5rem"}} type="password" value={formVariables.password} onChange={changeFormVariable} name="password" placeholder="Password" required/>
                </LoginInputs>
                <LoginButton type="submit">Login</LoginButton>
                <Separator><span>or</span></Separator>
                <LoginFooter>I am new! <Link onClick={()=>changeForm('signup')}>Signup</Link></LoginFooter>
            </>
            }
        </Container>
    );
};
export default Form;

const Container = styled.form`
    padding: 3rem;
    z-index: 1;
    background-color: white;
    color: #000000a4;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 20rem;
    height: ${({position})=>position==0?32:18}rem;
    transform: translateX(${({position})=>position}rem);
    transition: transform 1s ease-in-out, height 1s ease-in-out;
`;

const SignupTitle = styled.h2`
  font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  animation: ${slideDown} 1s ease-in-out;  
`;

const LoginTitle = styled.h2`
  font-weight: normal;
  font-family: Arial, Helvetica, sans-serif;
  animation: ${slideDown} 1s ease-in-out;  
`;

const SignupInputs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: center;
    animation: ${slideLift} 1s ease-in-out;
`;

const LoginInputs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: center;
    animation: ${slideLift} 1s ease-in-out;
`;

const SignupButton = styled.button `
    background-color: black;
    color: white;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 2rem;
    cursor: pointer;
    animation: ${pop} 1s ease-in-out;

    &:hover{
        color: black;
        background-color: white;
    }
`;

const LoginButton = styled.button `
    background-color: black;
    color: white;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 2rem;
    cursor: pointer;
    animation: ${pop} 1s ease-in-out;

    &:hover{
        color: black;
        background-color: white;
    }
`;

const Separator = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    margin: 10px 0;
    font-family: "Arial, Helvetica, sans-serif";
    animation: ${slideUp} 1s ease-in-out;

    &::before {
        content: "";
        height: 1px;
        background: #ccc;
        margin-right: 0.5rem;
    }  
    &::after {
        content: "";
        height: 1px;
        background: #ccc;
        margin-left: 0.5rem;
    }  
`;

const SignupFooter = styled.p`
    font-family: Arial, Helvetica, sans-serif;
    animation: ${slideUp} 1s ease-in-out;
`;

const LoginFooter = styled.p`
    font-family: Arial, Helvetica, sans-serif;
    animation: ${slideUp} 1s ease-in-out;
`;
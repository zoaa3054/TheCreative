import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { State } from "country-state-city";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Spinner from "./Spinner";

const Profile = ({backend, theme, isAdmin}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState({});

  useEffect(()=>{
    if (isAdmin) getAdmin();
    else getUser();
  }, []);

  const notifySuccess = (mssg)=>{
    toast.success(mssg);
  }

  const notifyError = (mssg)=>{
    toast.error(mssg);
  }

  const getUser = async()=>{
    await fetch(`${backend}/user/info`,{
        method:"GET",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        }
    })
    .then((result)=>{
        if (result.status == 200) return result.json();
        else throw Error("Couldn't fetch user info")
    })
    .then((data)=>setUser(data))
    .catch((error)=>{
        console.log(error);
    })
    setIsLoading(false);
  }


  const getAdmin = async()=>{
    await fetch(`${backend}/admin/info`,{
        method:"GET",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        }
    })
    .then((result)=>{
        if (result.status == 200) return result.json();
        else throw Error("Couldn't fetch user info")
    })
    .then((data)=>setAdmin(data))
    .catch((error)=>{
        console.log(error);
    })
    setIsLoading(false);

  }

  const editUserInfo = async()=>{
    setIsSubmiting(true);

    let formatedStudentPhone;
    let formatedParentPhone;
    if(/^\+201\d{9}$/.test(user.studentPhone))
        formatedStudentPhone = user.studentPhone;
    else if(/^201\d{9}$/.test(user.studentPhone))
        formatedStudentPhone = "+" + user.studentPhone;
    else if(/^01\d{9}$/.test(user.studentPhone))
        formatedStudentPhone = "+2" + user.studentPhone;

    if(/^\+201\d{9}$/.test(user.parentPhone))
        formatedParentPhone = user.parentPhone;
    else if(/^201\d{9}$/.test(user.parentPhone))
        formatedParentPhone = "+" + user.parentPhone;
    else if(/^01\d{9}$/.test(user.studentPhone))
        formatedParentPhone = "+2" + user.parentPhone;

    await fetch(`${backend}/edit/user/info`,{
        method:"POST",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        },
        body: JSON.stringify({
          ...user,
          studentPhone: formatedStudentPhone, 
          parentPhone: formatedParentPhone
        })
    })
    .then((result)=>{
        if (result.status == 200) {
            setIsEditing(!isEditing);
            setUser((prev)=>{
              delete prev.password
              return prev
            })
            notifySuccess("User info edited Successfuly!");
        }
        else throw Error("Couldn't edit user info")
    })
    .catch((error)=>{
        console.log(error);
    })
    setIsSubmiting(false);
  }


  const editAdminInfo = async()=>{
    setIsSubmiting(true);
    await fetch(`${backend}/edit/admin/info`,{
        method:"POST",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        },
        body: JSON.stringify(admin)
    })
    .then((result)=>{
        if (result.status == 200) {
            setIsEditing(!isEditing);
            setAdmin((prev)=>{
              delete prev.password
              return prev
            })
            notifySuccess("Admin info edited Successfuly!");
        }
        else throw Error("Couldn't edit admin info")
    })
    .catch((error)=>{
        console.log(error);
    })
    setIsSubmiting(false);
  }

  const handleChange = (e) => {
    setError((prev)=>{
      delete prev[e.target.name];
      return prev;
    })
    if (isAdmin) setAdmin({ ...admin, [e.target.name]: e.target.value });
    else setUser({ ...user, [e.target.name]: e.target.value });
  };


  const handleButtonClick = (e)=>{
    e.preventDefault();
    if (!isEditing) setIsEditing(!isEditing);
    else if (isAdmin) editAdminInfo();
    else editUserInfo();
  }

  return (
    isLoading?
      <Loader/>:
    <ProfileContainer theme={theme} onSubmit={handleButtonClick}>
      <Info theme={theme}>
          <h3>Username: {isAdmin?admin.username:user.username}</h3>
      </Info>
      {!isAdmin &&<>
        <Info theme={theme}>
          {isEditing ? (
              <>
                  <label htmlFor="studentPhone" style={{marginRight:"1rem"}}>Student Phone: </label>
                  <input type="text" name="studentPhone" value={user.studentPhone} pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "Student phone number is not correct"
                    setError({...error, ['studentPhone']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['studentPhone']?"2px solid red":"2px solid transparent"}} onChange={handleChange} />
              </>
          ) : (
            <p>Student Phone:{user.studentPhone}</p>
          )}
        </Info>
        <Info theme={theme}>
          {isEditing ? (
              <>
                  <label htmlFor="parentPhone" style={{marginRight:"1rem"}}>Parent Phone: </label>
                  <input type="text" name="parentPhone" value={user.parentPhone} pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "Parent phone number is not correct"
                    setError({...error, ['parentPhone']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['parentPhone']?"2px solid red":"2px solid transparent"}} onChange={handleChange} />
              </>
          ) : (
            <p>Parent Phone: {user.parentPhone}</p>
          )}
        </Info>
        <Info theme={theme}>
          {isEditing ? (
              <>
                  <label htmlFor="grade" style={{marginRight:"1rem"}}>Grade: </label>
                  <select name="grade" style={{backgroundColor:"transparent", borderRadius:"20px", padding:"0.5rem", cursor:"pointer", color: theme=='light'?"black":"white"}} value={user.grade} onChange={handleChange}>
                      <option value="M1">M1</option>
                      <option value="M2">M2</option>
                      <option value='M3'>M3</option>
                      <option value='S1'>S1</option>
                      <option value='S2'>S2</option>
                  </select>
              </>
          ) : (
            <p>Grade: {user.grade}</p>
          )}
        </Info>
        <Info theme={theme}>
          {isEditing ? (
              <>
                  <label htmlFor="city" style={{marginRight:"1rem"}}>City:</label>
                  <select name="city" style={{backgroundColor:"transparent", borderRadius:"20px", padding:"0.5rem", cursor:"pointer", color: theme=='light'?"black":"white"}} value={user.city} onChange={handleChange}>
                      {State.getStatesOfCountry('EG').map((state, key)=>(
                          <option key={key}>{state.name}</option>
                      ))}
                  </select>
              </>
          ) : (
            <p>City: {user.city}</p>
          )}
        </Info>
      </>}
      <Info theme={theme}>
          {isEditing && (
              <>
                  <label htmlFor="password" style={{marginRight:"1rem"}}>New Password: </label>
                  <input type="password" name="password" minLength='8' onInvalid={()=>{
                                    let errorText = "Password must be at least 8 characters"
                                    setError({...error, ['password']:errorText});
                                    notifyError(errorText);
                                    }} style = {{border: error['password']?"2px solid red":"2px solid transparent"}} value={isAdmin?admin.password:user.password} onChange={handleChange} required={isAdmin}/>
              </>
          )}
        </Info>
      <Button disabled={isSubmiting} type="submit">
        {isSubmiting?<Spinner size={15}/>:isEditing ? "Save" : "Edit Profile"}
      </Button>
    </ProfileContainer>
  );
};

export default Profile;


const ProfileContainer = styled.form`
  max-width: 300px;
  padding: 20px;
  background-color: ${({theme})=>theme=='light'?"white":"black"};
  color: ${({theme})=>theme=='light'?"black":"white"};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: start;
  transition: background-color 0.5s;
`;


const Info = styled.div`
  margin-bottom: 10px;
  input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    background-color: ${({theme})=>theme=='light'?"#00000029":"#ccc"};
  }
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #0056b3;
  }
`;

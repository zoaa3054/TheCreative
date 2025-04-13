import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";


const Settings = ({backend, theme}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState({});
  const [formVariables, setFormVariables] = useState({});

  useEffect(()=>{
    getContacts();
  }, [isEditing]);

  const notifySuccess = (mssg)=>{
    toast.success(mssg);
  }

  const getContacts = async()=>{
    await fetch(`${backend}/contacts`,{
        method:"GET",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        }
    })
    .then((result)=>{
        if (result.status == 200) return result.json();
        else throw Error("Couldn't fetch contacts")
    })
    .then((data)=>setContacts(data))
    .catch((error)=>{
        console.log(error);
    })
  }


  const editContacts = async()=>{
    await fetch(`${backend}/edit/contacts`,{
        method:"POST",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        },
        body: JSON.stringify(formVariables)
    })
    .then((result)=>{
        if (result.status == 200) {
            setIsEditing(!isEditing);
            notifySuccess("Contacts edited Successfuly!");
        }
        else throw Error("Couldn't edit contacts");
    })
    .catch((error)=>{
        console.log(error);
    })
  }


  const handleChange = (e) => {
    setFormVariables({ ...formVariables, [e.target.name]: e.target.value });
  };


  const handleButtonClick = (e)=>{
    e.preventDefault();
    if (!isEditing) setIsEditing(!isEditing);
    else editContacts();
  }

  return (
    <ProfileContainer theme={theme} onSubmit={handleButtonClick}>
        <center>
          <h2>
            Contacts
          </h2>
        </center>
        <Info>
          {isEditing ? (
              <>
                  <label htmlFor="paymentNumber" style={{marginRight:"1rem"}}>Payment number: </label>
                  <input type="text" name="paymentNumber" pattern="^\+20\d{10}$" value={formVariables.paymentNumber?formVariables.paymentNumber:contacts.paymentNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Payment number:{contacts.paymentNumber}</p>
          )}
        </Info>
        <Info>
          {isEditing ? (
              <>
                  <label htmlFor="problemsReportNumber" style={{marginRight:"1rem"}}>Problems report number: </label>
                  <input type="text" name="problemsReportNumber" pattern="^\+20\d{10}$" value={formVariables.problemsReportNumber?formVariables.problemsReportNumber:contacts.problemsReportNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Problems report number: {contacts.problemsReportNumber}</p>
          )}
        </Info>
        <Info>
        {isEditing ? (
              <>
                  <label htmlFor="faqNumber" style={{marginRight:"1rem"}}>FAQ number: </label>
                  <input type="text" name="faqNumber" pattern="^\+20\d{10}$" value={formVariables.faqNumber?formVariables.faqNumber:contacts.faqNumber} onChange={handleChange} />
              </>
          ) : (
            <p>FAQ number: {contacts.faqNumber}</p>
          )}
        </Info>
        <Info>
        {isEditing ? (
              <>
                  <label htmlFor="sendingMessagesNumber" style={{marginRight:"1rem"}}>Sending messages number: </label>
                  <input type="text" name="sendingMessagesNumber" pattern="^\+20\d{10}$" value={formVariables.sendingMessagesNumber?formVariables.sendingMessagesNumber:contacts.sendingMessagesNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Sending messages number: {contacts.sendingMessagesNumber}</p>
          )}
        </Info>
        
      <Button type="submit">
        {isEditing ? "Save" : "Edit Profile"}
      </Button>
    </ProfileContainer>
  );
};

export default Settings;


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

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Spinner from "./Spinner";

const Settings = ({backend, theme}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState({});
  const [formVariables, setFormVariables] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);
    const [error, setError] = useState({});
  

  useEffect(()=>{
    setIsLoading(true);
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
    setIsLoading(false);
  }


  const editContacts = async()=>{
    setIsSubmiting(true);

    let formatedProblemsReportNumber;
    if(/^\+201\d{9}$/.test(formVariables.problemsReportNumber))
      formatedProblemsReportNumber = formVariables.problemsReportNumber;
    else if(/^201\d{9}$/.test(formVariables.problemsReportNumber))
      formatedProblemsReportNumber = "+" + formVariables.problemsReportNumber;
    else if(/^01\d{9}$/.test(formVariables.problemsReportNumber))
      formatedProblemsReportNumber = "+2" + formVariables.problemsReportNumber;


    let formatedFAQNumber;
    if(/^\+201\d{9}$/.test(formVariables.faqNumber))
      formatedFAQNumber = formVariables.faqNumber;
    else if(/^201\d{9}$/.test(formVariables.faqNumber))
      formatedFAQNumber = "+" + formVariables.faqNumber;
    else if(/^01\d{9}$/.test(formVariables.faqNumber))
      formatedFAQNumber = "+2" + formVariables.faqNumber;


    let formatedSendingMessagesNumber;
    if(/^\+201\d{9}$/.test(formVariables.sendingMessagesNumber))
      formatedSendingMessagesNumber = formVariables.sendingMessagesNumber;
    else if(/^201\d{9}$/.test(formVariables.sendingMessagesNumber))
      formatedSendingMessagesNumber = "+" + formVariables.sendingMessagesNumber;
    else if(/^01\d{9}$/.test(formVariables.sendingMessagesNumber))
      formatedSendingMessagesNumber = "+2" + formVariables.sendingMessagesNumber;


    let formatedPaymentNumber;
    if(/^\+201\d{9}$/.test(formVariables.paymentNumber))
      formatedPaymentNumber = formVariables.paymentNumber;
    else if(/^201\d{9}$/.test(formVariables.paymentNumber))
      formatedPaymentNumber = "+" + formVariables.paymentNumber;
    else if(/^01\d{9}$/.test(formVariables.paymentNumber))
      formatedPaymentNumber = "+2" + formVariables.paymentNumber;

    await fetch(`${backend}/edit/contacts`,{
        method:"POST",
        headers:{
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${sessionStorage.getItem("theCreativeAuthToken")}`
        },
        body: JSON.stringify({
          problemsReportNumber: formatedProblemsReportNumber, 
          faqNumber: formatedFAQNumber, 
          sendingMessagesNumber: formatedSendingMessagesNumber, 
          paymentNumber: formatedPaymentNumber, 
        })
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
    setIsSubmiting(false);
  }


  const handleChange = (e) => {
    setError((prev)=>{
      delete prev[e.target.name];
      return prev;
    })
    setFormVariables({ ...formVariables, [e.target.name]: e.target.value });
  };


  const handleButtonClick = (e)=>{
    e.preventDefault();
    if (!isEditing) setIsEditing(!isEditing);
    else editContacts();
  }

  return (
    isLoading?
        <Loader/>:
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
                  <input type="text" name="paymentNumber" pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "payment number is not correct"
                    setError({...error, ['paymentNumber']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['paymentNumber']?"2px solid red":"2px solid transparent"}} value={formVariables.paymentNumber?formVariables.paymentNumber:contacts.paymentNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Payment number: {contacts.paymentNumber?contacts.paymentNumber:"NA"}</p>
          )}
        </Info>
        <Info>
          {isEditing ? (
              <>
                  <label htmlFor="problemsReportNumber" style={{marginRight:"1rem"}}>Problems report number: </label>
                  <input type="text" name="problemsReportNumber" pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "problems report number is not correct"
                    setError({...error, ['problemsReportNumber']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['problemsReportNumber']?"2px solid red":"2px solid transparent"}} value={formVariables.problemsReportNumber?formVariables.problemsReportNumber:contacts.problemsReportNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Problems report number: {contacts.problemsReportNumber?contacts.problemsReportNumber:"NA"}</p>
          )}
        </Info>
        <Info>
        {isEditing ? (
              <>
                  <label htmlFor="faqNumber" style={{marginRight:"1rem"}}>FAQ number: </label>
                  <input type="text" name="faqNumber" pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "FAQ number is not correct"
                    setError({...error, ['faqNumber']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['faqNumber']?"2px solid red":"2px solid transparent"}} value={formVariables.faqNumber?formVariables.faqNumber:contacts.faqNumber} onChange={handleChange} />
              </>
          ) : (
            <p>FAQ number: {contacts.faqNumber?contacts.faqNumber:"NA"}</p>
          )}
        </Info>
        <Info>
        {isEditing ? (
              <>
                  <label htmlFor="sendingMessagesNumber" style={{marginRight:"1rem"}}>Sending messages number: </label>
                  <input type="text" name="sendingMessagesNumber" pattern="^(\+201|201|01)\d{9}$" onInvalid={()=>{
                    let errorText = "sending messages number is not correct"
                    setError({...error, ['sendingMessagesNumber']:errorText});
                    notifyError(errorText);
                    }} style ={{border: error['sendingMessagesNumber']?"2px solid red":"2px solid transparent"}} value={formVariables.sendingMessagesNumber?formVariables.sendingMessagesNumber:contacts.sendingMessagesNumber} onChange={handleChange} />
              </>
          ) : (
            <p>Sending messages number: {contacts.sendingMessagesNumber?contacts.sendingMessagesNumber:"NA"}</p>
          )}
        </Info>
        
      <Button type="submit" disabled={isSubmiting}>
        {isSubmiting?<Spinner size={15}/>:isEditing ? "Save" : "Edit Profile"}
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

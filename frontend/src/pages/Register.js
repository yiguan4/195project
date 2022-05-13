import React , {useState, useContext, useEffect} from 'react'
import Default from '../components/Default';
import {Row , Col , Form , Input, Button,Checkbox , DatePicker, message} from 'antd'
import FormItem from 'antd/lib/form/FormItem';
import './login.css';
import "antd/dist/antd.css";
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {AuthContext} from '../components/authContext';

function Register() {
  let history = useHistory();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cfmpassword, setCPassword] = useState('');
  const [driverLicense, setDriverLicense] =useState('');
  const [email, setEmail] = useState('');
  const [expDate, setExpDate] = useState('');
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [isCarOwner, setIsCarOwner] = useState(false)
  const {auth, setAuth} = useContext(AuthContext);
  
  const checkButtonVisibility = () => {
    return ( (password === '') || (userName === '') || (cfmpassword === '') || (password !== cfmpassword) )
  }
  

  function showAlert() {
    message.success ("Create account sucessfully!");
  }

  const handleSubmitButtonClick = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5000/register',
      data: {
        username: userName,
        password: password,
        fullName: fullName,
        email: email,
        phone: phone,
        age : age,
        expDate: expDate,
        driverLicense: driverLicense,
        isCarOwner:isCarOwner,
      }
    })
    .then((res) => {
      showAlert();
      history.push('/login');
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    if(auth === true){
      history.push('/carlist');
    }
  }, [])

  return (
    <Default> 
      <div className='login' >
        <Row gutter={16} >
          <Col lg={16} className='img1'>
          <img src='./car1.jpg' height= '100%' width='200%'/></Col>
          <Col lg={8} className='text-box p-5 '>
            <Form layout='vertical' className='login-box p-5'>
              <h1>Sign up to start your trip</h1>
              <FormItem name='username' label='Username' rules={[{required: true, message:'Please enter your username'}]}>
                <Input onChange={(e) => {setUserName(e.target.value)}}/>
              </FormItem>
              <FormItem name ='password' label ='Password' rules = {[{required: true, message:'Please enter your password'}]}>
                <Input type='password' onChange={(e) => {setPassword(e.target.value)}}/>
              </FormItem>
                      
              <FormItem name ='cpassword' label ='ConfrimPassword' rules = {[{required: true, message:'Please enter your password'}]}>
                <Input type='password' onChange={(e) => {setCPassword(e.target.value)}}/>
              </FormItem>

              <FormItem name ='license' label ='License' rules = {[{required: true, message:'Please enter your license'}]}>
                <Input onChange={(e) => {setDriverLicense(e.target.value)}}/>
              </FormItem>

              <FormItem name ='email' label ='Email' rules = {[{required: false, message:'Please enter your emial'}]}>
                <Input onChange={(e) => {setEmail(e.target.value)}}/>
              </FormItem>

              <FormItem name ='expDate' label ='Expdata' rules = {[{required: true, message:'Please enter your driver license Expdata'}]}>
                {/* <Input onChange={(e) => {setExpDate(e.target.value)}}/> */}
                <DatePicker onChange={(e) => {setExpDate(e.format('YYYY-MM-DD'))}} format={"YYYY-MM-DD"} />
              </FormItem>

              <FormItem name ='full' label ='FullName' rules = {[{required: true, message:'Please enter your FullName'}]}>
                <Input onChange={(e) => {setFullName(e.target.value)}}/>
              </FormItem>

              <FormItem name ='phone' label ='Phone Number' rules = {[{required: true, message:'Please enter your Phone Number'}]}>
                <Input onChange={(e) => {setPhone(e.target.value)}}/>
              </FormItem>

              <FormItem name ='age' label ='Age' rules = {[{required: true, message:'Please enter your Age'}]}>
                <Input onChange={(e) => {setAge(e.target.value)}}/>
              </FormItem>
              <div style={{textAlign:'left',color:'#fff'}}>
                isCarOwner:
                <Checkbox checked={isCarOwner}  onChange={(e) => {
                  setIsCarOwner(e.target.checked)
                }}/>
              </div>
              <button   type="primary" className='btn1' onClick={handleSubmitButtonClick} ><h2>Sign Up</h2></button>

              <div>
              <a href='./login'>Already a member? Click to Login</a>
              </div>
            </Form>
            </Col>
        </Row>
      </div>
    </Default>
  )
}

export default Register
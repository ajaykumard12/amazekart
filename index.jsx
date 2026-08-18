import React, { useReducer, useState, useEffect, useContext } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from 'react-bootstrap';

import './style.scss';
import signupReducer, {ACTION_TYPES, initialState} from './signupReducer';
import { EyeSlash, Eye} from 'react-bootstrap-icons';
import { useRef} from 'react';
import { UserContext } from '../UserContextProvider';
import { ENDPOINTS, REQUEST_TYPES } from '../apiUtils';
import useApi from '../useApi';
import { replace, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const {state : redirectionURL}= useLocation()
    console.log("~~~~~redirectionurl:",redirectionURL )
    const [state, dispatch]= useReducer(signupReducer, initialState);
    const { username, password} = state;
    const [showPassword, setShowPassword]= useState(false);
    const navigate = useNavigate();
    const [otp, setOtp]= useState(null);
    const [showResetForm, setShowResetForm] = useState(false);

    const {makeRequest, response} = useApi(ENDPOINTS.USER.LOGIN, REQUEST_TYPES.POST);
    console.log("~~~~RESPONSE:", response);
    const {makeRequest : makeResetPwd, response: resetPwdResponse} = useApi(ENDPOINTS.USER.RESET_PASSWORD, REQUEST_TYPES.POST);


    useEffect(()=>{
        if(redirectionURL && response?.success && response?.data?.username){
            //loggedin Successfully!!!!
            navigate(redirectionURL, {replace:true});

        }
    },[response]);


    useEffect(()=>{
        if(resetPwdResponse?.success){
            setShowResetForm(false);
        }

    },[resetPwdResponse])



    const usernameRef = useRef(null);

    useEffect(()=>{
        usernameRef.current?.focus();
    }, []);

    /*useEffect(()=>{
        setIsPasswordValid(Object.values(password.validation).every(Boolean))
    },[password.value])*/

    /*const actionCreator= (e, action) => {
        dispatch({type:action, payload:e.target.value})
    }*/

    const actionCreator=(e) =>{
        dispatch({type:e.target.name, payload: e.target.value})
    }

    const onLogin = ()=>{
      const payload = {username : username.value, password: password.value};
      //makeRequest(payload);
      makeRequest(payload, true);

    }

    const resetPassword = async()=>{
      const payload = { username: username.value, password: password.value, otp }
        await makeResetPwd(payload);
        setOtp('');
        console.log("🚀 ~ resetPassword ~ resetPwdResponse:", resetPwdResponse)
       
     

    } 

    const onPasswordChange = (e) =>{
        const {value} = e.target;
        if(value.length >6){
            e.preventDefault();

        }else{
            setOtp(value);
        }
    }


    const isFormValid = username.isValid && password.value?.length;
    //console.log("🚀 ~ Login ~ isFormValid:", isFormValid)
    console.log({
    username: username.value,
    usernameIsValid: username.isValid,
    password: password.value,
    passwordLength: password.value?.length,
    });



  return (
    <Container fluid>
        <Row>
            <Col sm={{span:10, offset:1}} md={{span:6, offset:3}} lg ={{span:4, offset:4}}>
                <Card className='login mt-5'>
                <CardHeader>Login</CardHeader>
                <CardBody>
                    <FormGroup controlId='username'>
                        <FormLabel>Username</FormLabel>
                        <FormControl ref={usernameRef} type='text' placeholder='Enter your Username' name='username' onChange={(e)=>{dispatch({type: ACTION_TYPES.USERNAME, payload:e.target.value})}} />
                    </FormGroup>

                    <FormGroup controlId='password'>
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your Password'
                            name='password'
                            onChange={actionCreator}
                        />
                        <span className='password-toggle' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <Eye/> : <EyeSlash/>}
                        </span>
                    </FormGroup>

                    {showResetForm &&<FormGroup controlId='otp'>
                        <FormLabel>Otp</FormLabel>
                        <FormControl
                            type='number'
                            placeholder='Enter otp'
                            name='otp'
                            value={otp}
                            onChange={onPasswordChange}
                        />
                        
                    </FormGroup>}

                </CardBody>
                <CardFooter className='d-flex justify-content-between'>
                    {!showResetForm? 
                        <>
                            <Button disabled={!isFormValid} variant="outline-primary" onClick={onLogin}>Login</Button> 
                            <Button variant="link" onClick={()=>{setShowResetForm(true)}}>Forgot Password</Button>

                        </>
                        :
                         
                         <>
                            <Button variant="outline-primary" disabled={!isFormValid || !otp} onClick={resetPassword}>Reset Password</Button>
                        <Button variant='link' onClick={() => setShowResetForm(false)}>Login</Button>
                         </>
                        
                         

                    }
                     
                </CardFooter>
            </Card>
             
            </Col>
        </Row>
    </Container>
  );
}

export default Login;

import React from 'react'
import {provider, authG } from '../firebase/firebase';
import Gicon from '../assets/google.png'
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();
function Login() {
    const navigate=useNavigate();
    const GLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithPopup(authG, provider);
            console.log(res);
            cookies.set("auth-token",res.user.uid);
            cookies.set("user-icon",res.user.photoURL);
            alert('Login success')
            const uid=cookies.get('auth-token');
            navigate(`todos/${uid}`);
        }
        catch (error) {
            console.log(error);
           // alert(error);
        }

    }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center vh-100'>

        <h1 className='mb-4 text-justify text-center'style={{maxWidth:'50rem'}}>Don't need to remember all the Tasks. Just List it here and Forget </h1>
        <button className='mb-4 btn-light mx-5 p-2 rounded-2' onClick={GLogin}><img className='img-thumbnail' 
        style={{ width: '3rem', height: '3rem' }} src={Gicon} alt='....' /> Sign In with Google</button>
    </div>
  )
}

export default Login
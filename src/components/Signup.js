import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { auth, db } from '../firebase';
import Navbar from './Navbar';
import DesignElement1 from '../assets/images/DesignElement1.png';
import SignupBanner from '../assets/images/signup.png';

function Signup() {
    const [error, setError] = useState({});
    const history = useHistory();

    function handleSubmit() {
        var myErrors = {};
        var email = document.getElementsByName("email")[0].value;
        var fullname = document.getElementsByName("fullname")[0].value;
        var password = document.getElementsByName("password")[0].value;
        var confirmpassword = document.getElementsByName("confirmpassword")[0].value;

        // Basic Validation
        // Email Should Be Valid
        var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        if (!re.test(email)) myErrors.email = 'Please enter a valid email address';
        // FullName should be greater than 3 characters
        if (fullname.length <= 3) myErrors.fullname = 'Name must be greater than 3 characters';
        // Pass should be greater than 6 characters
        if (password.length <= 6) myErrors.password = 'Password must be greater than 6 characters';
        // Pass & Confirm Pass Should Match
        if (password !== confirmpassword) myErrors.confirmpassword = 'Password and confirm password must be equal';

        setError(myErrors);
        if (Object.keys(myErrors).length !== 0) return;

        var button = document.querySelector(".signupBtn");
        button.disabled = true;
        button.classList.add("cursor-not-allowed", "opacity-50");

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                if (!res.user) { console.log(res); alert('Unknown Error Occured!'); return; }
                localStorage.setItem("UUID", res.user.uid);
                return db.collection('users').doc(res.user.uid).set({ fullname, videos: [], pages: [] });
            })
            .then(() => {
                localStorage.setItem("username", fullname);
                history.push('/videos');
            })
            .catch((error) => {
                button.disabled = false;
                button.classList.remove("cursor-not-allowed", "opacity-50");
                if (error.code === 'auth/email-already-in-use')
                    alert("Email Already in Use!");
                else {
                    alert('Error: Unhandled Exception Occured!');
                    console.log(error);
                }
            });
    };

    return (
        <>
            <Navbar />
            <img alt="" src={DesignElement1} className="absolute bottom-0 hidden lg:block" style={{ left: 60, width: 200 }} />
            <div className="flex mx-8 mt-10 mb-10 md:mt-16 sm:mx-16 mainWrapper">
                <div className="items-center justify-center flex-1 hidden doodleWrapper lg:flex">
                    <img src={SignupBanner} className="px-24" alt="" />
                </div>
                <div className="relative flex flex-col justify-around flex-1 w-1/3 px-5 text-center border border-indigo-700 rounded-lg shadow-xl sm:px-10 sm:mx-10 md:mx-32 lg:mx-8 lg:flex-none loginFormWrapper" style={{ height: 560 }}>
                    <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}><i className="mr-2 fa fa-arrow-left"></i> Back</p>
                    <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Sign up</p>
                    <hr />
                    <p className="hidden py-2 text-sm text-center text-white bg-red-500 rounded-md loginMsg"><i className="mr-2 fa fa-times-circle"></i> Invalid Email or Password</p>
                    <form>
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="fullname" name="fullname" type="text" placeholder="Full Name" />
                        {error.fullname != null ? <p className="mb-3 text-sm text-red-500">{error.fullname}</p> : <p className="mb-5"></p>}
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="email" name="email" type="text" placeholder="Email Address" />
                        {error.email != null ? <p className="mb-3 text-sm text-red-500">{error.email}</p> : <p className="mb-5"></p>}
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="password" name="password" type="password" placeholder="Password" />
                        {error.password != null ? <p className="mb-3 text-sm text-red-500">{error.password}</p> : <p className="mb-5"></p>}
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="confirmpassword" name="confirmpassword" type="password" placeholder="Confirm Password" />
                        {error.confirmpassword != null ? <p className="mb-3 text-sm text-red-500">{error.confirmpassword}</p> : <p className="mb-5"></p>}
                    </form>
                    <button onClick={handleSubmit} className="px-4 py-2 text-lg font-bold text-white bg-green-700 rounded signupBtn hover:bg-green-600 focus:outline-none" type="button">
                        Sign Up
                    </button>
                    <p className="text-indigo-600 font-montserratBold">Come in. We're Awesome</p>
                    <p style={{ lineHeight: '0.1em' }} className="w-full mt-5 mb-10 text-sm text-center border-b-2 border-gray-400 font-montserratRegular"><span className="px-5 bg-white">or <span className="font-bold text-blue-600 cursor-pointer" onClick={() => history.push('/signin')}>Log in</span></span></p>
                </div>
            </div>
            <div className="py-5 border-t footer lg:hidden">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>
        </>
    );
}
export default Signup;
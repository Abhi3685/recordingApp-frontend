import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { auth, db } from '../firebase';
import Navbar from './Navbar';
import DesignElement1 from '../assets/images/DesignElement1.png';
import SignupBanner from '../assets/images/signup.png';
import { signupInputClasses, signupFormWrapperClasses, signupBtnClasses } from '../utils/classes';

const Input = ({ ref, classList, name, type, placeholder, error }) => {
    return (
        <React.Fragment>
            <input
                ref={ref}
                className={classList}
                name={name}
                type={type}
                placeholder={placeholder}
            />
            {
                error[name] != null ?
                    <p className="mb-3 text-sm text-red-500">{error[name]}</p> :
                    <p className="mb-5"></p>
            }
        </React.Fragment>
    )
}

function Signup() {
    const [error, setError] = useState({});
    const history = useHistory();
    const fullnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPassRef = useRef(null);
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = () => {
        var myErrors = {};
        var email = emailRef.current.value;
        var fullname = fullnameRef.current.value;
        var password = passwordRef.current.value;
        var confirmpassword = confirmPassRef.current.value;

        // Basic Validation
        var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        if (!re.test(email)) myErrors.email = 'Please enter a valid email address';
        if (fullname.length <= 3) myErrors.fullname = 'Name must be greater than 3 characters';
        if (password.length <= 6) myErrors.password = 'Password must be greater than 6 characters';
        if (password !== confirmpassword) myErrors.confirmpassword = 'Password and confirm password must be equal';

        setError(myErrors);
        if (Object.keys(myErrors).length !== 0) return;

        setDisabled(true);
        auth.createUserWithEmailAndPassword(email, password)
            .then((res) => {
                if (!res.user) { console.log(res); alert('Unknown Error Occured!'); return; }
                localStorage.setItem("UUID", res.user.uid);
                return db.collection('users').doc(res.user.uid).set({ fullname, videos: [], pages: [] });
            })
            .then(() => {
                localStorage.setItem("username", fullname);
                history.push('/dashboard');
            })
            .catch((error) => {
                setDisabled(false);
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
            <div className="flex mx-8 mt-10 mb-10 sm:mx-16 mainWrapper">
                <div className="items-center justify-center flex-1 hidden doodleWrapper lg:flex">
                    <img src={SignupBanner} className="px-24" alt="" />
                </div>
                <div className={signupFormWrapperClasses} style={{ height: 560 }}>
                    <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}>
                        <i className="mr-2 fa fa-arrow-left"></i> Back
                    </p>
                    <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Sign up</p><hr />
                    <form>
                        <Input
                            ref={fullnameRef}
                            classList={signupInputClasses}
                            name="fullname"
                            placeholder="Full Name"
                            error={error}
                        />
                        <Input
                            ref={emailRef}
                            classList={signupInputClasses}
                            name="email"
                            placeholder="Email Address"
                            error={error}
                        />
                        <Input
                            ref={passwordRef}
                            classList={signupInputClasses}
                            name="password"
                            type="password"
                            placeholder="Password"
                            error={error}
                        />
                        <Input
                            ref={confirmPassRef}
                            classList={signupInputClasses}
                            name="confirmpassword"
                            type="password"
                            placeholder="Confirm Password"
                            error={error}
                        />
                    </form>
                    <button
                        onClick={handleSubmit}
                        className={signupBtnClasses + (disabled && " cursor-not-allowed opacity-50")}
                        type="button"
                        disabled={disabled}
                    >
                        Sign Up
                    </button>
                    <p className="text-indigo-600 font-montserratBold">Come in. We're Awesome</p>
                    <p
                        style={{ lineHeight: '0.1em' }}
                        className="w-full mt-5 mb-10 text-sm text-center border-b-2 border-gray-400 font-montserratRegular"
                    >
                        <span className="px-5 bg-white">or{" "}
                            <span
                                className="font-bold text-blue-600 cursor-pointer"
                                onClick={() => history.push('/signin')}
                            >Log in</span>
                        </span>
                    </p>
                </div>
            </div>
            <div className="py-5 border-t footer lg:hidden">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>
        </>
    );
}

export default Signup;

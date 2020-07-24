import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import DesignElement1 from '../assets/images/DesignElement1.png';
import { auth, db } from '../firebase';
import Navbar from './Navbar';
import CustomModal from './Modal';
import SigninBanner from '../assets/images/signin.png';
import {
    forgotEmailInputClasses,
    forgotBtnClasses,
    loginFormWrapperClasses,
    loginInputClasses,
    loginBtnClasses
} from '../utils/classes';

function Signin() {
    const history = useHistory();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const forgetEmailRef = useRef(null);
    const [forgotPassStatus, setForgotPassStatus] = useState(0);
    const [forgotPassMsg, setForgotPassMsg] = useState('');

    const forgotPassMsgClasses = useMemo(() => {
        var classes = "py-1 text-center text-white rounded-lg";
        classes += forgotPassStatus !== 0 ? " block" : " hidden";
        classes += forgotPassStatus === 1 ? " bg-green-600" : " bg-red-600";
        return classes;
    }, [forgotPassStatus]);

    useEffect(() => {
        if (localStorage.getItem("UUID"))
            history.replace('/dashboard');
    }, [history]);

    function handleSubmit() {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        setDisabled(true);
        auth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                localStorage.setItem("UUID", res.user.uid);
                return db.collection('users').doc(res.user.uid).get();
            })
            .then(doc => {
                localStorage.setItem("username", doc.data().fullname);
                history.push('/dashboard');
            })
            .catch((error) => {
                setDisabled(false);
                if (
                    error.code === 'auth/invalid-email' ||
                    error.code === 'auth/user-not-found' ||
                    error.code === 'auth/wrong-password'
                )
                    document.querySelector(".loginMsg").classList.remove("hidden");
                else {
                    alert('Error: Unhandled Exception Occured!');
                    console.log(error);
                }
            });
    }

    function handleForgotPass() {
        var email = forgetEmailRef.current.value;
        setDisabled(true);
        auth.sendPasswordResetEmail(email)
            .then(() => {
                setForgotPassStatus(1);
                setForgotPassMsg('Please Check Your Email');
            }).catch(function (e) {
                if (e.code === 'auth/invalid-email') {
                    setDisabled(false);
                    setForgotPassStatus(-1);
                    setForgotPassMsg('Invalid email address!');
                } else if (e.code === "auth/user-not-found") {
                    setForgotPassStatus(-1);
                    setForgotPassMsg('No User Found! Please Register.');
                } else {
                    setDisabled(false);
                    alert('Error: Unhandled Exception Occured!');
                    console.log(e);
                }
            })
    }

    return (
        <React.Fragment>
            <Navbar />
            <img alt="" src={DesignElement1} className="absolute bottom-0 hidden lg:block" style={{ right: 60, width: 200 }} />
            <div className="flex mx-8 mt-10 mb-10 sm:mx-16 mainWrapper">
                <div className={loginFormWrapperClasses} style={{ height: 560 }}>
                    <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}>
                        <i className="mr-2 fa fa-arrow-left"></i> Back
                    </p>
                    <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Log in</p><hr />
                    <p className="hidden py-2 text-sm text-center text-white bg-red-500 rounded-md loginMsg">
                        <i className="mr-2 fa fa-times-circle"></i> Invalid Email or Password
                    </p>
                    <form>
                        <input
                            ref={emailRef}
                            className={loginInputClasses + " mb-5"}
                            name="email"
                            placeholder="Email Address"
                        />
                        <input
                            ref={passwordRef}
                            className={loginInputClasses}
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <p className="mt-5 text-sm text-gray-500 font-montserratSemiBold">
                            <span className="cursor-pointer" onClick={() => setIsOpen(true)}>Forgot Password?</span>
                        </p>
                    </form>
                    <button
                        onClick={handleSubmit}
                        disabled={disabled}
                        className={loginBtnClasses + (disabled && " cursor-not-allowed opacity-50")}
                        type="button"
                    >
                        Log In
                    </button>
                    <p style={{ lineHeight: '0.1em' }}
                        className="w-full mb-10 text-sm text-center border-b-2 border-gray-400 font-montserratRegular"
                    >
                        <span className="px-5 bg-white">or{" "}
                            <span
                                className="font-bold text-blue-600 cursor-pointer"
                                onClick={() => history.push('/signup')}
                            >Sign Up</span>
                        </span>
                    </p>
                </div>
                <div className="items-center justify-center flex-1 hidden doodleWrapper lg:flex">
                    <img src={SigninBanner} className="px-10" alt="" />
                </div>
            </div>
            <div className="py-5 border-t footer lg:hidden">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>

            <CustomModal
                isOpen={modalIsOpen}
                onClose={setIsOpen}
            >
                <h1 className="mb-3 text-xl font-bold text-center">Reset Your Password</h1>
                <form>
                    <div className="mb-5 text-left">
                        <label className="block mb-2 tracking-wide text-gray-800" htmlFor="forgetemail">
                            Your Email Address
                        </label>
                        <input
                            ref={forgetEmailRef}
                            className={forgotEmailInputClasses}
                            name="forgetemail"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        onClick={handleForgotPass}
                        className={forgotBtnClasses + (disabled && " cursor-not-allowed opacity-50")}
                        type="button"
                    >
                        Reset Password
                    </button>
                    <p className={forgotPassMsgClasses}>{forgotPassMsg}</p>
                </form>
            </CustomModal>
        </React.Fragment>
    );
}

export default Signin;

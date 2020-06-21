import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import DesignElement1 from '../assets/images/DesignElement1.png';
import { randomstr } from '../utils';
import { auth, db } from '../firebase';
import Navbar from './Navbar';
import SigninBanner from '../assets/images/signin.png';

function Signin() {
    const history = useHistory();
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("UUID"))
            history.replace('/dashboard');
    }, []);

    function handleSubmit() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                localStorage.setItem("UUID", res.user.uid);
                return db.collection('users').doc(res.user.uid).get();
            })
            .then(doc => {
                if (!doc.exists) { alert('Error: No such document!'); return; }
                localStorage.setItem("username", doc.data().fullname);
                history.push('/');
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found')
                    alert('Error: No User Account Found.');
                else if (error.code === 'auth/wrong-password')
                    alert('Error: Wrong Password.');
                else
                    alert(error);
            });
    }

    function handleForgotPass() {
        var email = document.getElementById("forgetemail").value;
        auth.sendPasswordResetEmail(email)
            .then(function (user) {
                alert('Please check your email...')
                setIsOpen(false);
            }).catch(function (e) {
                if (e.code === 'auth/invalid-email') {
                    alert("Error: Invalid email address!");
                } else if (e.code === "auth/user-not-found") {
                    alert("Error: No User Found!");
                } else {
                    console.log(e);
                }
            })
    }

    return (
        <>
            <Navbar />
            <img alt="" src={DesignElement1} className="absolute bottom-0 hidden lg:block" style={{ right: 60, width: 200 }} />
            <div className="flex mx-8 mt-10 mb-10 md:mt-16 sm:mx-16 mainWrapper">
                <div className="relative flex flex-col justify-around flex-1 w-1/3 px-5 text-center border border-indigo-700 rounded-lg shadow-xl sm:px-10 sm:mx-10 md:mx-32 lg:mx-8 lg:flex-none loginFormWrapper" style={{ height: 560 }}>
                    <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}><i className="mr-2 fa fa-arrow-left"></i> Back</p>
                    <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Log in</p>
                    <hr />
                    <form>
                        <input className="block w-full px-3 py-2 mb-5 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="email" name="email" type="text" placeholder="Email Address" />
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="password" name="password" type="password" placeholder="Password" />
                        <p className="mt-5 text-sm text-gray-500 font-montserratSemiBold"><span className="cursor-pointer">Forgot Password?</span></p>
                    </form>
                    <button onClick={handleSubmit} className="px-4 py-2 mb-5 text-lg font-bold text-white bg-green-700 rounded hover:bg-green-600 focus:outline-none" type="button">
                        Log In
                    </button>
                    <p style={{ lineHeight: '0.1em' }} className="w-full mb-10 text-sm text-center border-b-2 border-gray-400 font-montserratRegular"><span className="px-5 bg-white">or <span className="font-bold text-blue-600 cursor-pointer" onClick={() => history.push('/signup')}>Sign Up</span></span></p>
                </div>
                <div className="items-center justify-center flex-1 hidden doodleWrapper lg:flex">
                    <img src={SigninBanner} className="px-10" alt="" />
                </div>
            </div>
            <div className="py-5 border-t footer lg:hidden">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
                ariaHideApp={false}
                contentLabel="Reset Password"
            >
                <form className="px-8 pt-6">
                    <div className="mb-4 text-left">
                        <label className="block mb-2 tracking-wide text-gray-800" htmlFor="forgetemail">
                            Email Address
                        </label>
                        <input className="w-full px-3 py-2 leading-tight text-gray-700 transition duration-300 ease-in-out border-2 border-gray-400 rounded appearance-none focus:outline-none focus:border-indigo-600" id="forgetemail" name="forgetemail" type="text" />
                    </div>
                    <button onClick={handleForgotPass} className="w-full px-4 py-2 mb-2 text-white transition duration-500 ease-in-out bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none" type="button">
                        Reset Password
                    </button>
                    <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2 mb-5 text-white transition duration-500 ease-in-out bg-red-600 rounded hover:bg-red-700 focus:outline-none" type="button">
                        Cancel
                    </button>
                </form>
            </Modal>
        </>
    );
}
export default Signin;
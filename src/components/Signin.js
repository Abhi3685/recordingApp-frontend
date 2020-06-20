import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import DesignElement1 from '../assets/images/DesignElement1.png';
import { randomstr } from '../utils';
import { auth, db } from '../firebase';
import Navbar from './Navbar';
import SigninBanner from '../assets/images/signin.png';

function Signin() {
    const [state, setState] = useState({
        email: '',
        password: ''
    });
    const history = useHistory();
    const [modalIsOpen, setIsOpen] = useState(false);

    function handleInputChange(event) {
        var newState = { ...state };
        newState[event.target.name] = event.target.value;
        setState(newState);
    }

    function handleSubmit() {
        const { email, password } = state;
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
            <img src={DesignElement1} style={{ position: 'absolute', right: 100, bottom: 0, width: 200 }} />
            <div className="mainWrapper flex justify-between mx-16 my-10">
                <div className="loginFormWrapper relative flex flex-col justify-around px-10 text-center rounded-lg border-indigo-700 shadow-xl border ml-10" style={{ height: 570, width: 500 }}>
                    <p className="absolute text-gray-600" style={{ top: 20 }}><i className="fa fa-arrow-left mr-2"></i> Back</p>
                    <p className="uppercase text-blue-600 text-xl font-montserratBold mt-5">Log in</p>
                    <hr />
                    <form>
                        <input className="block border-2 border-gray-400 rounded py-2 px-3 text-gray-700 mb-5 focus:outline-none focus:border-indigo-600 w-full" id="email" name="email" type="text" placeholder="Email Address" value={state.email} onChange={handleInputChange} autoComplete={randomstr(10)} />
                        <input className="block border-2 border-gray-400 rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-indigo-600 w-full" id="password" name="password" type="password" placeholder="Password" value={state.password} onChange={handleInputChange} />
                        <p className="cursor-pointer text-sm text-gray-500 font-montserratSemiBold mt-5">Forgot Password?</p>
                    </form>
                    <button onClick={handleSubmit} className="text-lg bg-green-700 mb-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                        Log In
                    </button>
                    <p style={{ lineHeight: '0.1em' }} className="w-full mb-10 border-b-2 border-gray-400 text-center font-montserratRegular text-sm"><span className="px-5 bg-white">or <span className="text-blue-600 font-bold">Sign Up</span></span></p>
                </div>
                <div className="doodleWrapper">
                    <img src={SigninBanner} style={{ width: 700, marginTop: 20 }} />
                </div>
            </div>
            <div className="hidden flex flex-row text-center justify-center mt-20 pt-10 md:mt-40 md:pt-0">
                <div className="w-screen max-w-sm">
                    <p className="text-3xl font-bold text-gray-700">Sign in</p>
                    <form className="px-8 pt-6">
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="email">
                                Email Address
                        </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="email" name="email" type="text" placeholder="john.doe@gmail.com" value={state.email} onChange={handleInputChange} autoComplete={randomstr(10)} />
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="password">
                                Password
                        </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="password" name="password" type="password" placeholder="•••••••••••••••••••" value={state.password} onChange={handleInputChange} />
                        </div>
                        <button onClick={handleSubmit} className="transition duration-500 ease-in-out text-lg bg-indigo-600 mb-5 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                            Sign In
                    </button>
                    </form>
                    <button onClick={() => setIsOpen(true)} className="w-full font-bold text-sm mb-10 focus:outline-none">
                        <i className="fa fa-lock mr-3"></i>
                    Forgot Password?
                </button>
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
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="forgetemail">
                                Email Address
                        </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="forgetemail" name="forgetemail" type="text" />
                        </div>
                        <button onClick={handleForgotPass} className="transition duration-500 ease-in-out bg-indigo-600 mb-2 w-full hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none" type="button">
                            Reset Password
                    </button>
                        <button onClick={() => setIsOpen(false)} className="transition duration-500 ease-in-out bg-red-600 mb-5 w-full hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none" type="button">
                            Cancel
                    </button>
                    </form>
                </Modal>
            </div>
        </>
    );
}
export default Signin;
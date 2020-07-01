import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Navbar from './Navbar';
import { db } from '../firebase';
import DesignElement1 from '../assets/images/DesignElement1.png';
import Banner from '../assets/images/signup.png';

function handleSubmit(setError) {
    var fullname = document.getElementsByName("fullname")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var message = document.getElementsByName("message")[0].value;
    var myErrors = {};

    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!re.test(email)) myErrors.email = 'Please enter a valid email address';
    if (fullname.length <= 3) myErrors.fullname = 'Name must be greater than 3 characters';
    if (message.length <= 5) myErrors.message = 'Message must be greater than 5 characters';

    setError(myErrors);
    if (Object.keys(myErrors).length !== 0) return;

    var button = document.querySelector(".contactBtn");
    var msg = document.querySelector(".contactMsg");
    button.disabled = true;
    button.classList.add("cursor-not-allowed", "opacity-50");

    db
        .collection('queries').add({
            createdAt: new Date().toISOString(),
            name: fullname,
            email: email,
            message: message
        })
        .then(() => {
            document.querySelector('form').reset();
            msg.innerHTML = "Sent! We'll get back to you.";
            msg.classList.add("bg-green-500");
            msg.classList.remove("hidden");
        })
        .catch(err => {
            button.disabled = false;
            button.classList.remove("cursor-not-allowed", "opacity-50");
            msg.innerHTML = "Error! Try again later.";
            msg.classList.add("bg-red-500");
            msg.classList.remove("hidden");
            console.log(err);
        });
}

export default function Contact() {
    const [error, setError] = useState({});
    const history = useHistory();

    return (
        <>
            <Navbar />
            <img alt="" src={DesignElement1} className="absolute bottom-0 hidden lg:block" style={{ left: 60, width: 200 }} />
            <div className="flex mx-8 mt-10 mb-10 md:mt-12 sm:mx-16 mainWrapper">
                <div className="items-center justify-center flex-1 hidden doodleWrapper lg:flex">
                    <img src={Banner} className="px-24" alt="" />
                </div>
                <div className="relative flex flex-col justify-around flex-1 w-1/3 px-5 text-center border border-indigo-700 rounded-lg shadow-xl sm:px-10 sm:mx-10 md:mx-32 lg:mx-8 lg:flex-none loginFormWrapper" style={{ height: 560 }}>
                    <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}><i className="mr-2 fa fa-arrow-left"></i> Back</p>
                    <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Contact Us</p>
                    <hr />
                    <p className="hidden py-2 text-sm text-center text-white rounded-md contactMsg"></p>
                    <form>
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="fullname" name="fullname" type="text" placeholder="Full Name" />
                        {error.fullname != null ? <p className="mb-3 text-sm text-red-500">{error.fullname}</p> : <p className="mb-5"></p>}
                        <input className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" id="email" name="email" type="text" placeholder="Email Address" />
                        {error.email != null ? <p className="mb-3 text-sm text-red-500">{error.email}</p> : <p className="mb-5"></p>}
                        <textarea className="block w-full px-3 py-2 text-gray-700 border-2 border-gray-400 rounded focus:outline-none focus:border-indigo-600" rows="4" id="message" name="message" placeholder="Your Message ..." />
                        {error.message != null ? <p className="mb-3 text-sm text-red-500">{error.message}</p> : <p className="mb-5"></p>}
                    </form>
                    <button onClick={() => handleSubmit(setError)} className="px-4 py-2 mb-10 text-lg font-bold text-white bg-green-700 rounded contactBtn hover:bg-green-600 focus:outline-none" type="button">
                        Send
                    </button>
                </div>
            </div>
            <div className="py-5 border-t footer lg:hidden">
                <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>
        </>
    )
}

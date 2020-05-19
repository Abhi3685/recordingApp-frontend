import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useHistory } from 'react-router-dom';

function randomstr(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function Signup() {
    const [state, setState] = useState({
        email: '',
        password: '',
        fullname: '',
        confirmpassword: ''
    });
    const [error, setError] = useState({});
    const { email, password, fullname, confirmpassword } = state;
    const history = useHistory();

    function handleInputChange(event) {
        var newState = { ...state };
        newState[event.target.name] = event.target.value;
        setState(newState);
    }

    function handleSubmit() {
        const { email, password, fullname, confirmpassword } = state;
        var myErrors = {};

        // Basic Validation
        // Email Should Be Valid
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) myErrors.email = 'Please enter a valid email address';
        // FullName should be greater than 3 characters
        if (fullname.length <= 3) myErrors.fullname = 'Name must be greater than 3 characters';
        // Pass should be greater than 6 characters
        if (password.length <= 6) myErrors.password = 'Password must be greater than 6 characters';
        // Pass & Confirm Pass Should Match
        if (password != confirmpassword) myErrors.confirmpassword = 'Password and confirm password must be equal';

        setError(myErrors);
        if (Object.keys(myErrors).length != 0) return;

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                if (!res.user) { console.log(res); alert('Unknown Error Occured!'); return; }
                localStorage.setItem("UUID", res.user.uid);
                return db.collection('users').doc(res.user.uid).set({ fullname });
            })
            .then(user => {
                history.push('/');
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <>
            <div className="flex flex-row text-center justify-center mt-10 pt-10 md:mt-20 md:pt-0">
                <div className="w-screen max-w-sm">
                    <p className="text-3xl font-bold text-gray-700">Sign up</p>
                    <form className="px-8 pt-6">
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="email" name="email" type="text" placeholder="john.doe@gmail.com" value={email} onChange={handleInputChange} autoComplete={randomstr(10)} />
                            {error.email != null ? <p className="text-red-500 text-sm">{error.email}</p> : ""}
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="fullname">
                                Full Name
                            </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="fullname" name="fullname" type="text" placeholder="John Doe" value={fullname} onChange={handleInputChange} autoComplete={randomstr(10)} />
                            {error.fullname != null ? <p className="text-red-500 text-sm">{error.fullname}</p> : ""}
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="password" name="password" type="password" placeholder="•••••••••••••••••••" value={password} onChange={handleInputChange} />
                            {error.password != null ? <p className="text-red-500 text-sm">{error.password}</p> : ""}
                        </div>
                        <div className="mb-4 text-left">
                            <label className="block text-gray-800 tracking-wide mb-2" htmlFor="confirmpassword">
                                Confirm Password
                            </label>
                            <input className="appearance-none border-2 border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600 transition duration-300 ease-in-out" id="confirmpassword" name="confirmpassword" type="password" placeholder="•••••••••••••••••••" value={confirmpassword} onChange={handleInputChange} />
                            {error.confirmpassword != null ? <p className="text-red-500 text-sm">{error.confirmpassword}</p> : ""}
                        </div>
                        <button onClick={handleSubmit} className="transition duration-500 ease-in-out text-lg bg-indigo-600 mb-5 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="button">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center border-t pt-3 mx-5 border-gray-400 text-gray-500 text-xs">
                        Copyright &copy;{new Date().getFullYear()}. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}
export default Signup;
import React, { useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Navbar from './Navbar';
import { db } from '../firebase';
import DesignElement1 from '../assets/images/DesignElement1.png';
import Banner from '../assets/images/signup.png';
import {
  contactFormWrapperClasses,
  contactFormInputClasses,
  contactFormButtonClasses,
  contactFormMsgClasses
} from '../utils/classes';

const Input = ({ ref, classList, name, placeholder, error }) => {
  return (
    <React.Fragment>
      <input
        ref={ref}
        className={classList}
        name={name}
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

function Contact() {
  const [error, setError] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitStatus, setSubmitStatus] = useState(0);
  const history = useHistory();
  const userName = useRef(null);
  const userEmail = useRef(null);
  const contactMsg = useRef(null);

  const handleSubmit = useCallback(() => {
    var fullname = userName.current.value;
    var email = userEmail.current.value;
    var message = contactMsg.current.value;
    var myErrors = {};

    var re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!re.test(email)) myErrors.email = 'Please enter a valid email address';
    if (fullname.length <= 3) myErrors.fullname = 'Name must be greater than 3 characters';
    if (message.length <= 5) myErrors.message = 'Message must be greater than 5 characters';

    setError(myErrors);
    if (Object.keys(myErrors).length !== 0) return;

    setDisabled(true);
    db.collection('queries').add({
      createdAt: new Date().toISOString(),
      name: fullname,
      email: email,
      message: message
    })
      .then(() => {
        document.querySelector('form').reset();
        setSubmitMsg("Sent! We'll get back to you.");
        setSubmitStatus(1);
      })
      .catch(err => {
        setDisabled(false);
        setSubmitMsg("Error! Try again later.");
        setSubmitStatus(-1);
        console.log(err);
      });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <img alt="" src={DesignElement1} className="absolute bottom-0 hidden lg:block" style={{ left: 60, width: 200 }} />
      <div className="flex mx-8 mt-10 mb-10 md:mt-12 sm:mx-16 mainWrapper">
        <div className="items-center justify-center flex-1 hidden lg:flex">
          <img src={Banner} className="px-24" alt="" />
        </div>
        <div className={contactFormWrapperClasses} style={{ height: 560 }}>
          <p className="absolute text-gray-600 cursor-pointer" style={{ top: 20 }} onClick={() => history.goBack()}>
            <i className="mr-2 fa fa-arrow-left"></i> Back
          </p>
          <p className="mt-10 text-xl text-blue-600 uppercase font-montserratBold">Contact Us</p><hr />
          <p className={contactFormMsgClasses + (submitStatus === 1 ? " bg-green-500 " : " bg-red-500 ") + (!submitStatus && "hidden")}>{submitMsg}</p>
          <form>
            <Input
              ref={userName} classList={contactFormInputClasses}
              name="fullname" placeholder="Full Name" error={error}
            />
            <Input
              ref={userEmail} classList={contactFormInputClasses}
              name="email" placeholder="Email Address" error={error}
            />
            <textarea
              ref={contactMsg} className={contactFormInputClasses}
              rows="4" name="message" placeholder="Your Message ..."
            />
            {
              error.message != null ?
                <p className="mb-3 text-sm text-red-500">{error.message}</p> :
                <p className="mb-5"></p>
            }
          </form>
          <button
            onClick={handleSubmit}
            className={contactFormButtonClasses + (disabled && " cursor-not-allowed opacity-50")}
            type="button" disabled={disabled}
          >Send</button>
        </div>
      </div>
      <div className="py-5 border-t footer lg:hidden">
        <p className="text-center text-gray-700">&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </React.Fragment>
  )
}

export default Contact

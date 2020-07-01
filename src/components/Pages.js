import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Modal from 'react-modal';

import { db } from '../firebase';
import firebase from "firebase/app";
import AddPost from './AddPost';
import logo from '../assets/loader.gif';
import doodle from '../assets/images/pages_doodle.png';
import DesignElement from '../assets/images/DesignElement1.png';
import DesignElement2 from '../assets/images/DesignElement3.png';

function Pages({ pages }) {
    let history = useHistory();
    const [user, setUser] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isAddPostActive, setAddPost] = useState(false);
    const [currPage, setCurrPage] = useState("");

    function handleCreatePage() {
        //     var page_name = document.getElementById("page_name").value;
        //     db.collection('pages').add({
        //         name: page_name,
        //         ownerId: localStorage.getItem("UUID"),
        //         ownerName: user,
        //         posts: []
        //     }).then(docRef => {
        //         var pageObj = {
        //             id: docRef.id,
        //             name: page_name
        //         };
        //         db.collection('users').doc(localStorage.getItem("UUID")).update({
        //             pages: firebase.firestore.FieldValue.arrayUnion(pageObj)
        //         }).then(() => {
        //             setIsOpen(false);
        //             setPages([...pages, pageObj]);
        //         });
        //     });
    }

    function handlePageDelete(page_Obj, index) {
        // db.collection('users').doc(localStorage.getItem("UUID")).update({
        //     pages: firebase.firestore.FieldValue.arrayRemove(page_Obj)
        // }).then(() => {
        //     var newPages = [...pages];
        //     newPages.splice(index, 1);
        //     setPages(newPages);
        //     db.collection("pages").doc(page_Obj.id).delete();
        // }).catch(err => {
        //     alert("Error: Unhandled Exception Occured!");
        //     console.log(err);
        // });
    }

    return (
        <>
            <img src={doodle} alt="" className="hidden xl:block absolute" style={{ zIndex: -10, width: '250px', bottom: 20, right: 20 }} />
            <img src={DesignElement} alt="" className="hidden xl:block absolute transform rotate-90" style={{ zIndex: -10, width: '220px', top: 140, right: 5 }} />
            <div className="contentWrapper z-10">
                <div className="contentHeader border-b border-gray-300 py-4 px-8 text-xl font-montserratBold">
                    My <span className="text-purple-700">Pages</span>
                </div>
                <div className="absolute inset-0 content overflow-auto pl-8 pt-6 pb-10" style={{ marginTop: 70 }}>
                    {
                        pages.length > 0 ?
                            <div className="grid grid-flow-row sm:grid-cols-2 lg:grid-cols-3 gap-5 mr-10">
                                {pages.map((page, index) =>
                                    <div className="p-3 relative bg-white border border-blue-600 rounded shadow-md" key={index}>
                                        {/* <img src={DesignElement2} alt="" className="w-12 absolute transform -rotate-90 rounded" style={{ bottom: 2, left: -4 }} /> */}
                                        <img src={DesignElement2} alt="" className="w-16 absolute rounded transform rotate-90" style={{ top: 2, right: -4 }} />
                                        <h2 className="mb-4 font-montserratBold text-lg">{page.name}</h2>
                                        <div className="flex mt-8">
                                            <button className="py-2 w-1/3 text-center text-sm text-white bg-indigo-600 rounded" onClick={() => { setCurrPage(page.id); setAddPost(true) }}>Add Post</button>
                                            <button className="w-1/3 py-2 text-center mx-2 text-sm text-white bg-indigo-600 rounded" onClick={() => history.push('/page/' + page.id)}>View Page</button>
                                            <button className="w-1/3 py-2 text-center text-sm text-white bg-red-600 rounded" onClick={() => handlePageDelete(page, index)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            :
                            <div className="flex flex-col items-center opacity-75 justify-center h-full">
                                <p className="mb-5 text-xl font-bold">You don’t have any pages <span role="img" aria-label="">😭</span></p>
                                <button className="transition duration-300 ease-in px-8 py-2 text-indigo-600 border rounded shadow-md mb-24 border-indigo-600 hover:text-white hover:bg-indigo-600" style={{ width: '190px' }} onClick={() => setIsOpen(true)}>Create New Page</button>
                            </div>
                    }
                </div>
            </div>

            {/* <div className="absolute flex flex-col justify-between w-64 h-screen border-r-2 border-gray-300 sidebar">
                <div className="mt-3">
                    <button className="block w-56 px-8 py-2 mx-auto mb-3 text-white bg-indigo-600 rounded shadow-md" onClick={() => { start(); document.querySelector(".config_wrapper").style.display = 'block'; }}>New Video</button>
                    <button className="block w-56 px-8 py-2 mx-auto text-white bg-indigo-600 rounded shadow-md" onClick={() => setIsOpen(true)}>Create Product Page</button>
                </div>
                <div>
                    <p className="mb-2 text-center">Logged in as <span className="font-bold">{user}</span></p>
                    <button onClick={() => { localStorage.removeItem("UUID"); history.push("/"); }} className="block w-56 px-8 py-2 mx-auto mb-3 text-white bg-indigo-600 rounded shadow-md">Logout</button>
                </div>
            </div> */}
            {/* <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-200 loader">
                <img src={logo} alt=""></img>
            </div> */}

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
                contentLabel="Create Product Page"
            >
                <form className="px-8 pt-6">
                    <div className="mb-4 text-left">
                        <label className="block mb-2 tracking-wide text-gray-800" htmlFor="page_name">
                            Product Page Name
                                    </label>
                        <input className="w-full px-3 py-2 leading-tight text-gray-700 transition duration-300 ease-in-out border-2 border-gray-400 rounded appearance-none focus:outline-none focus:border-indigo-600" id="page_name" name="page_name" type="text" />
                    </div>
                    <button onClick={handleCreatePage} className="w-full px-4 py-2 mb-2 text-white transition duration-500 ease-in-out bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none" type="button">
                        Create Page
                                </button>
                    <button onClick={() => setIsOpen(false)} className="w-full px-4 py-2 mb-5 text-white transition duration-500 ease-in-out bg-red-600 rounded hover:bg-red-700 focus:outline-none" type="button">
                        Cancel
                                </button>
                </form>
            </Modal>

            <Modal
                isOpen={isAddPostActive}
                onRequestClose={() => setAddPost(false)}
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
                contentLabel="Add New Post"
            >
                <AddPost pageId={currPage} setAddPost={setAddPost} />
            </Modal>
        </>
    )
}

export default Pages;
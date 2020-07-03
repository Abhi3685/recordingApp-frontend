import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Modal from 'react-modal';

import { db } from '../firebase';
import firebase from "firebase/app";
import AddPost from './AddPost';
import CustomModal from './Modal';
import logo from '../assets/loader.gif';
import doodle from '../assets/images/pages_doodle.png';
import DesignElement from '../assets/images/DesignElement1.png';
import DesignElement2 from '../assets/images/DesignElement3.png';

function Pages({ pages, setPages, createPage }) {
    let history = useHistory();
    const [isAddPostActive, setAddPost] = useState(false);
    const [currPage, setCurrPage] = useState("");

    function handlePageDelete(page_Obj, index) {
        db.collection('users').doc(localStorage.getItem("UUID")).update({
            pages: firebase.firestore.FieldValue.arrayRemove(page_Obj)
        }).then(() => {
            var newPages = [...pages];
            newPages.splice(index, 1);
            setPages(newPages);
            db.collection("pages").doc(page_Obj.id).delete();
        }).catch(err => {
            alert("Error: Unhandled Exception Occured!");
            console.log(err);
        });
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
                            <div className="grid grid-flow-row sm:grid-cols-2 gap-5" style={{ marginRight: 320 }}>
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
                                <button className="transition duration-300 ease-in px-8 py-2 text-indigo-600 border rounded shadow-md mb-24 border-indigo-600 hover:text-white hover:bg-indigo-600" style={{ width: '190px' }} onClick={createPage}>Create New Page</button>
                            </div>
                    }
                </div>
            </div>

            <CustomModal
                isOpen={isAddPostActive}
                onClose={() => setAddPost(false)}
            >
                <AddPost pageId={currPage} setAddPost={setAddPost} />
            </CustomModal>
        </>
    )
}

export default Pages;
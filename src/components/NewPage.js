import React from 'react'
import CustomModal from './Modal'

import { db } from '../firebase';
import firebase from "firebase/app";

export default function NewPage({ visible, hide, user, pages, setPages }) {
  function handleCreatePage() {
    var page_name = document.getElementById("page_name").value;
    if (page_name === '') return hide();
    db.collection('pages').add({
      name: page_name,
      ownerId: localStorage.getItem("UUID"),
      ownerName: user,
      posts: []
    }).then(docRef => {
      var pageObj = {
        id: docRef.id,
        name: page_name
      };
      db.collection('users').doc(localStorage.getItem("UUID")).update({
        pages: firebase.firestore.FieldValue.arrayUnion(pageObj)
      }).then(() => {
        hide();
        setPages([...pages, pageObj]);
      });
    });
  }

  return (
    <CustomModal
      isOpen={visible}
      onClose={hide}
    >
      <h1 className="mb-5 text-xl font-bold text-center">Create New Page</h1>
      <form className="px-10">
        <div className="mb-4 text-left">
          <label className="block mb-2 tracking-wide text-gray-800" htmlFor="page_name">
            Product Page Name
          </label>
          <input className="w-full px-3 py-2 leading-tight text-gray-700 transition duration-300 ease-in-out border-2 border-gray-400 rounded appearance-none focus:outline-none focus:border-indigo-600" id="page_name" name="page_name" type="text" />
        </div>
        <button onClick={handleCreatePage} className="w-full px-4 py-2 mb-2 text-white transition duration-500 ease-in-out bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none" type="button">
          Create Page
        </button>
      </form>
    </CustomModal>
  )
}

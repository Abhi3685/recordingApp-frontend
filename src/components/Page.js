import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { db } from '../firebase';
import Avatar from 'react-avatar';
import firebase from 'firebase/app';
import Axios from 'axios';
import ReactImageVideoLightbox from 'react-image-video-lightbox';
import logo from '../assets/loader.gif';

export default function Page() {
    let { pageId } = useParams();
    let history = useHistory();
    const [pageName, setPageName] = useState("");
    const [owner, setOwner] = useState("");
    const [posts, setPosts] = useState([]);
    const [pagePostIds, setPagePostIds] = useState([]);
    const [isLightBoxOpen, setLightBoxOpen] = useState(false);
    const [lightBoxData, setLightBoxData] = useState([]);
    const [lightBoxStartIdx, setLightBoxStartIdx] = useState(0);
    const [scrollPos, setScrollPos] = useState(0);

    useEffect(() => {
        db.collection('pages').doc(pageId).get().then(page => {
            if (!page.exists) { alert('Error: No such document!'); return; }
            setPageName(page.data().name);
            setOwner({
                name: page.data().ownerName,
                id: page.data().ownerId
            });
            var myposts = [];
            var postIds = page.data().posts.reverse();
            setPagePostIds(postIds);
            postIds.forEach(postId => {
                db.collection('posts').doc(postId).get().then(post => {
                    myposts.push(post.data());
                    if (postIds.length === myposts.length) setPosts(myposts);
                });
            })
            setTimeout(() => document.querySelector(".loader").style.display = 'none', 500);
        }).catch(err => window.location.reload());
    }, [pageId]);

    function handleSetData(attachments) {
        var dataArr = [];
        attachments.forEach(attachment => {
            var myObj = {
                url: attachment,
                altTag: 'Post Attachment'
            };
            var parts = attachment.split("/");
            parts = parts[parts.length - 1].split(".");
            if (parts[1] === 'jpg' || parts[1] === 'png') {
                myObj.type = 'photo';
            } else {
                myObj.type = 'video';
            }
            dataArr.push(myObj);
        });
        setLightBoxData(dataArr);
    }

    function handleDeletePost(post, index) {
        var attachments = post.attachments;
        var postId = pagePostIds[index];
        pagePostIds.splice(index, 1);
        db.collection('pages').doc(pageId).update({
            posts: firebase.firestore.FieldValue.arrayRemove(postId)
        }).then(() => {
            var newPosts = [...posts];
            newPosts.splice(index, 1);
            setPosts(newPosts);
            db.collection('posts').doc(postId).delete();
            Axios.post("http://localhost:8000/deletepost", { attachments });
        }).catch(err => {
            alert("Error: Unhandled Exception Occured!");
            console.log(err);
        });
    }

    function handleLikeDislike(post, index, e) {
        if (!localStorage.getItem("UUID")) {
            alert('You need to be logged in to like posts.');
            history.push("/");
            return;
        }

        if (e.target.classList.contains("fa-heart-o")) {
            // Like Post
            e.target.classList.remove("fa-heart-o");
            e.target.classList.add("fa-heart");
            db.collection("posts").doc(pagePostIds[index]).update({
                likedBy: firebase.firestore.FieldValue.arrayUnion({
                    uid: localStorage.getItem("UUID"),
                    name: localStorage.getItem("username")
                })
            });
        } else {
            // Unlike Post
            e.target.classList.remove("fa-heart");
            e.target.classList.add("fa-heart-o");
            db.collection("posts").doc(pagePostIds[index]).update({
                likedBy: firebase.firestore.FieldValue.arrayRemove({
                    uid: localStorage.getItem("UUID"),
                    name: localStorage.getItem("username")
                })
            });
        }
    }

    return (
        <div style={{ width: '800px' }} className="mx-auto">
            <div className="flex items-center justify-center loader bg-gray-200 absolute inset-0 z-50">
                <img src={logo}></img>
            </div>

            <div className="pageHeader flex items-center pl-10 bg-gray-400 rounded-lg shadow-md h-48 mt-5">
                <Avatar maxInitials={2} color={"#999"} round={true} name={pageName} />
                <div className="ml-5">
                    <p className="text-3xl font-bold">{pageName}</p>
                    <p className="text-lg">Created & Maintained By: <span className="font-bold">{owner.name}</span></p>
                </div>
            </div>

            <hr className="mt-5 mb-10" />

            <div className="prevPostsWrapper mx-auto">
                {
                    posts.length > 0 ?
                        posts.map((post, index) =>
                            <div className="bg-gray-300 relative rounded-lg shadow-md p-3 mb-5" key={index}>
                                <div className="flex items-center pl-2 h-20 mb-2">
                                    <Avatar maxInitials={2} size="70" color={"#999"} round={true} name={pageName} />
                                    <div className="ml-5">
                                        <p className="text-xl font-bold">{pageName}</p>
                                        <p className="text-lg">{post.createdAt}</p>
                                    </div>
                                </div>
                                <div className="absolute" style={{ fontSize: 20, top: 30, right: 30 }}>
                                    <button onClick={() => handleDeletePost(post, index)} className={localStorage.getItem("UUID") === owner.id ? "deletePostBtn mr-3 text-red-600" : "hidden"}><i className="fa fa-trash-o"></i></button>
                                    <i onClick={(e) => handleLikeDislike(post, index, e)} className={post.likedBy.find(function (el) { return el.uid === localStorage.getItem("UUID") }) === undefined ? "fa fa-heart-o text-red-600 cursor-pointer focus:outline-none" : "fa fa-heart text-red-600 cursor-pointer focus:outline-none"}></i>
                                </div>
                                <pre className="mt-2 px-3">
                                    <p>{post.text}</p>
                                </pre>
                                <div style={{ whiteSpace: 'nowrap', overflowX: 'auto' }} className="attachmentsWrapper">
                                    {
                                        post.attachments.map((attachment, index) => {
                                            var ext = attachment.split('.').pop();
                                            if (ext === 'jpg' || ext === 'png') {
                                                return (
                                                    <img onClick={() => {
                                                        handleSetData(post.attachments);
                                                        setLightBoxStartIdx(index);
                                                        setLightBoxOpen(true);
                                                        setScrollPos(document.documentElement.scrollTop);
                                                        document.documentElement.scrollTop = 0;
                                                        document.body.style.overflow = 'hidden';
                                                    }} key={index}
                                                        alt="Attachment"
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '180px',
                                                            height: '150px',
                                                            display: 'inline-block',
                                                            margin: '10px 5px 5px 5px',
                                                            borderRadius: '10px'
                                                        }} src={attachment} />
                                                );
                                            } else {
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            handleSetData(post.attachments);
                                                            setLightBoxStartIdx(index);
                                                            setLightBoxOpen(true);
                                                            setScrollPos(document.documentElement.scrollTop);
                                                            document.documentElement.scrollTop = 0;
                                                            document.body.style.overflow = 'hidden';
                                                        }}
                                                        className="inline-block relative">
                                                        <video
                                                            src={attachment}
                                                            style={{
                                                                objectFit: 'cover',
                                                                width: '270px',
                                                                display: 'inline-block',
                                                                margin: '10px 5px 5px 5px',
                                                                borderRadius: '10px'
                                                            }}></video>
                                                        <i style={{ top: '40%', left: '45%', fontSize: '40px' }} className="absolute fa fa-play-circle text-gray-500"></i>
                                                    </div>
                                                );
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        ) :
                        <div className="bg-gray-200 rounded-lg border border-gray-500 flex h-24 items-center justify-center">
                            <p className="text-lg font-bold text-gray-800">Page Has No Posts!</p>
                        </div>
                }
            </div>
            <hr className="mt-10 mb-5" />
            <div className="mb-5 text-center text-gray-500">
                <p>&copy; Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
            </div>

            {
                isLightBoxOpen && <ReactImageVideoLightbox
                    data={lightBoxData}
                    startIndex={lightBoxStartIdx}
                    showResourceCount={true}
                    onCloseCallback={() => {
                        setLightBoxOpen(false);
                        document.body.style.overflow = 'visible';
                        document.documentElement.scrollTop = scrollPos;
                    }} />
            }
        </div>
    )
}

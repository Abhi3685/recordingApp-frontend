import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';

export default function Page() {
    let { pageId } = useParams();
    const [pageName, setPageName] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        db.collection('pages').doc(pageId).get().then(page => {
            if (!page.exists) { alert('Error: No such document!'); return; }
            setPageName(page.data().name);
            setPosts(page.data().posts);
        });
    }, [pageId]);

    // TODOs:
    // 1. Add a love icon to each post so that users can like that post

    return (
        <>
            <h2 className="text-2xl text-center font-bold my-5">{pageName}</h2>
            <div className="prevPostsWrapper mx-auto" style={{ width: '600px' }}>
                <h2 className="text-2xl font-bold my-5">Update Timeline</h2>
                {
                    posts.map((post, index) =>
                        <div className="bg-gray-400 rounded p-3 mb-5" key={index}>
                            <p className="mb-2">{post.createdAt}</p>
                            <hr className="border-gray-800" />
                            <pre className="mt-2">
                                <h2>{post.text}</h2>
                            </pre>
                            <div style={{ whiteSpace: 'nowrap', overflowX: 'auto' }} className="attachmentsWrapper">
                                {
                                    post.attachments.map((attachment, index) => {
                                        var ext = attachment.split('.').pop();
                                        if (ext === 'jpg' || ext === 'png') {
                                            return (
                                                <img key={index} style={{
                                                    objectFit: 'cover',
                                                    width: '180px',
                                                    height: '150px',
                                                    display: 'inline-block',
                                                    margin: '5px',
                                                    borderRadius: '10px'
                                                }} src={attachment} />
                                            );
                                        } else {
                                            return (
                                                <video key={index} src={attachment}
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '180px',
                                                        height: '150px',
                                                        display: 'inline-block',
                                                        margin: '5px',
                                                        borderRadius: '10px'
                                                    }}></video>
                                            );
                                        }
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

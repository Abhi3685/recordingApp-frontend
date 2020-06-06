import React from 'react'
import { useParams } from 'react-router-dom';

export default function Page() {
    let { pageId } = useParams();

    return (
        <div>
            <p>ID: {pageId}</p>
        </div>
    )
}

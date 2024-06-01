import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { LikeIcon, DislikeIcon, EyeIcon } from '../comps/Icons';
import { host } from '../../settings';

export default function NewsList() {
    const [data, setData] = useState({});
    const { newsId } = useParams();

    useEffect(() => {
        axios
            .get(`${host}/news/${newsId}`)
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [newsId]);

    async function onClickLikeDislike(action) {
        axios
            .patch(`${host}/news/${newsId}/${action}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
    return (
        <>
            <h1>{data.title}</h1>
            <p>
                <small className="text-body-secondary">{data.created_at}</small>
            </p>
            <p>
                <EyeIcon />
                <small className="text-body-secondary ms-2">
                    {data.views ? data.views.length : 0}
                </small>
            </p>
            <img src={data.image} className="img-fluid" alt={data.title} />
            {data.tags && (
                <div className="row">
                    <h4 className="col-1">Теги:</h4>
                    {data.tags.map(tag => (
                        <span key={tag.id} className="col-1 fs-5">
                            <Link to={`/tag/${tag.slug}`}>{tag.name}</Link>
                        </span>
                    ))}
                </div>
            )}
            <p className="mt-5 fs-3">{data.text}</p>
            <div>
                <span onClick={() => onClickLikeDislike('like')}>
                    <LikeIcon />
                    <small className="text-body-secondary ms-3">
                        {data.likes}
                    </small>
                </span>
                <span
                    className="ms-3"
                    onClick={() => onClickLikeDislike('dislike')}
                >
                    <DislikeIcon />
                    <small className="text-body-secondary ms-3">
                        {data.dislikes}
                    </small>
                </span>
            </div>
        </>
    );
}

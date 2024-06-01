import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from 'react-modal';
import { LikeIcon, DislikeIcon, DeleteIcon } from '../comps/Icons';
import { host } from '../../settings';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        inset: '30% auto auto 50%',
    },
};
Modal.setAppElement('#root');

function TagList() {
    const [tags, setTags] = useState([]);
    const { tag } = useParams();

    useEffect(() => {
        axios
            .get(`${host}/tags/`)
            .then(response => setTags(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <ul className="list-group col-2">
            {tags.map(curTag => (
                <li
                    key={curTag.id}
                    className={`list-group-item ${
                        curTag.slug === tag ? 'active' : ''
                    }`}
                >
                    <Link
                        to={`/tag/${curTag.slug}`}
                        relative="path"
                        className={`link-underline link-underline-opacity-0 ${
                            curTag.slug === tag ? 'text-white' : ''
                        }`}
                    >
                        {curTag.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function NewsCard({ news, onClickLikeDislike, setDeleteNews }) {
    return (
        <div key={news.id} className="card mb-4" style={{ maxWidth: '1000px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <Link
                        to={`/news/${news.id}`}
                        relative="path"
                        className="link-underline link-underline-opacity-0 "
                    >
                        <img
                            src={news.image}
                            style={{ maxHeight: '130px' }}
                            className="img-fluid rounded-start"
                            alt={news.title}
                        />
                    </Link>
                </div>
                <div className="col-md-5">
                    <div className="card-body">
                        <Link
                            to={`/news/${news.id}`}
                            relative="path"
                            className="link-underline link-underline-opacity-0 "
                        >
                            <h5 className="card-title">{news.title}</h5>
                        </Link>
                        <p className="card-text">{news.text}</p>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                {news.created_at}
                            </small>
                        </p>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card-body pt-4">
                        <p className="card-text">
                            <span
                                onClick={() =>
                                    onClickLikeDislike(news.id, 'like')
                                }
                            >
                                <LikeIcon />
                            </span>
                            <small className="text-body-secondary ms-3">
                                {news.likes}
                            </small>
                        </p>

                        <p className="card-text">
                            <span
                                onClick={() =>
                                    onClickLikeDislike(news.id, 'dislike')
                                }
                            >
                                <DislikeIcon />
                            </span>

                            <small className="text-body-secondary ms-3">
                                {news.dislikes}
                            </small>
                        </p>
                    </div>
                </div>
                <div className="col-md-1 text-center mt-5">
                    <span onClick={() => setDeleteNews(news.id)}>
                        <DeleteIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function NewsList() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { tag } = useParams();
    const [deleteNews, setDeleteNews] = useState('');
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        resetState();
    }, [tag]);

    useEffect(() => {
        if (initialLoad) {
            fetchInitialPages();
        } else {
            fetchNews(page);
        }
    }, [page]);

    function resetState() {
        setData([]);
        setPage(1);
        setHasMore(true);
        setInitialLoad(true);
    }

    async function fetchInitialPages() {
        try {
            setLoading(true);
            await fetchNews(1);
            await fetchNews(2);
            setPage(3);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }

    async function fetchNews(pageNumber) {
        setLoading(true);
        const url = tag ? `${host}/news/tag/${tag}` : `${host}/news/`;
        axios
            .get(url, {
                params: { page: pageNumber },
            })
            .then(response => {
                setData(prevData => [...prevData, ...response.data.results]);
                setHasMore(response.data.next != null);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
                setInitialLoad(false);
            });
    }

    function fetchMoreData() {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }

    async function onClickLikeDislike(newsId, action) {
        axios
            .patch(`${host}/news/${newsId}/${action}`)
            .then(response => {
                const updatedNews = data.map(news =>
                    news.id === newsId
                        ? {
                              ...news,
                              [action + 's']: response.data[`${action}s`],
                          }
                        : news
                );
                setData(updatedNews);
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function onClickDelete(e) {
        e.preventDefault();
        axios
            .delete(`${host}/news/${deleteNews}/delete_news`)
            .then(() => {
                setData(data.filter(news => news.id !== deleteNews));
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setDeleteNews('');
            });
    }

    return (
        <div className="row mt-5">
            <TagList />
            <div className="col-9">
                <InfiniteScroll
                    dataLength={data.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p>No more news</p>}
                >
                    <div>
                        {data.map(news => (
                            <NewsCard
                                key={news.id}
                                news={news}
                                onClickLikeDislike={onClickLikeDislike}
                                setDeleteNews={setDeleteNews}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
            <Modal
                isOpen={Boolean(deleteNews)}
                onRequestClose={() => setDeleteNews('')}
                contentLabel="Вы действительно хотите удалить новость?"
                style={customStyles}
            >
                <h2>Удалить новость?</h2>
                <form
                    className="row justify-content-around"
                    onSubmit={onClickDelete}
                >
                    <button type="submit" className="btn btn-danger col-5">
                        Удалить
                    </button>
                    <button
                        type="button"
                        className="btn btn-success col-5"
                        onClick={() => setDeleteNews('')}
                    >
                        Отмена
                    </button>
                </form>
            </Modal>
        </div>
    );
}

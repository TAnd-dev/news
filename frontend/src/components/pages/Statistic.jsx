import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { host } from '../../settings';

export default function Statistic() {
    const [viewData, setViewData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    async function fetchNews(pageNumber) {
        setLoading(true);
        axios
            .get(`${host}/news/`, {
                params: { page: pageNumber },
            })
            .then(response => {
                const allNews = response.data.results;
                const groupedNewsViews = allNews.map(news => {
                    return [news.title, groupViewsByDate(news.views)];
                });
                setViewData([...viewData, ...groupedNewsViews]);
                setHasMore(response.data.next != null);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function fetchMoreData() {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }

    useEffect(() => {
        fetchNews(page);
    }, [page]);

    function groupViewsByDate(views) {
        const dateMap = views.reduce((acc, view) => {
            const date = view.date.split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        return Object.keys(dateMap).map(date => ({
            date,
            views: dateMap[date],
        }));
    }

    return (
        <InfiniteScroll
            dataLength={viewData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more news</p>}
        >
            {viewData.map((data, index) => (
                <div key={index} className="row">
                    <h2>{data[0]}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data[1]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="views" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </InfiniteScroll>
    );
}

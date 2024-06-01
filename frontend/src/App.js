import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Header from './components/global/Header';
import NewsList from './components/pages/ListNews';
import NewsDetail from './components/pages/NewsDetail';
import Statistic from './components/pages/Statistic';
import CreateNews from './components/pages/CreateNews';

export default function App() {
    return (
        <>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<NewsList />} />
                    <Route path="/tag/:tag" element={<NewsList />}></Route>
                    <Route
                        path="/news/:newsId"
                        element={<NewsDetail />}
                    ></Route>
                    <Route path="/statistic" element={<Statistic />}></Route>
                    <Route path="/create_news" element={<CreateNews />}></Route>
                </Routes>
            </div>
        </>
    );
}

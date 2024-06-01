import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <Link to={`/`} className="navbar-brand fs-1">
                        News
                    </Link>
                    <div className="d-flex">
                        <Link to={`/create_news`} className="me-4">
                            Добавить новость
                        </Link>
                        <Link to={`/statistic`} className="me-4">
                            Статистика
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}

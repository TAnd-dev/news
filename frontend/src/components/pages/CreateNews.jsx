import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { host } from '../../settings';

export default function CreateNews() {
    const [newsDetail, setNewsDetail] = useState({
        title: '',
        text: '',
        image: '',
        newTag: '',
        tags: [],
    });
    const [tags, setTags] = useState([]);

    useEffect(() => {
        axios
            .get(`${host}/tags/`)
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    function addDeleteTag(e) {
        const selectedTags = Array.from(e.target.selectedOptions).map(option =>
            Number(option.value)
        );
        setNewsDetail({ ...newsDetail, tags: selectedTags });
    }

    function setNewsImage(e) {
        e.preventDefault();
        const img = e.target.files[0];
        setNewsDetail({ ...newsDetail, image: img });
    }

    async function onClickAdd(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', newsDetail.title);
        formData.append('text', newsDetail.text);
        formData.append('image', newsDetail.image);
        newsDetail.tags.forEach(tag => formData.append('tags', tag));

        axios
            .post(`${host}/news/create_news`, formData)
            .then(() => {
                setNewsDetail({
                    title: '',
                    text: '',
                    image: '',
                    tags: [],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function onClickNewTag(e) {
        e.preventDefault();
        axios
            .post(`${host}/news/create_tag`, {
                name: newsDetail.newTag,
            })
            .then(response => {
                setTags([...tags, response.data]);
                setNewsDetail({ ...newsDetail, newTag: '' });
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <form
            onSubmit={onClickAdd}
            method="POST"
            encType="multipart/form-data"
            className="form-horizontal"
        >
            <fieldset>
                <div className="mt-4 ">
                    <label className="col-sm-2 control-label ">Название</label>

                    <div className="col-sm-10">
                        <input
                            id="title"
                            name="title"
                            className="form-control"
                            type="text"
                            required
                            onChange={e =>
                                setNewsDetail({
                                    ...newsDetail,
                                    title: e.target.value,
                                })
                            }
                            value={newsDetail.title}
                        />
                    </div>
                </div>

                <div className="mt-4 ">
                    <label className="col-sm-2 control-label ">Текст</label>

                    <div className="col-sm-10">
                        <textarea
                            name="text"
                            className="form-control"
                            required
                            onChange={e =>
                                setNewsDetail({
                                    ...newsDetail,
                                    text: e.target.value,
                                })
                            }
                            value={newsDetail.text}
                        ></textarea>
                    </div>
                </div>

                <div className="mt-4 ">
                    <label className="col-sm-2 control-label ">Картинка</label>

                    <div className="col-sm-10">
                        <input
                            name="image"
                            type="file"
                            onChange={setNewsImage}
                            required
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="col-sm-2 control-label ">Тэги</label>

                    <div className="col-sm-10">
                        <select
                            multiple
                            className="form-control"
                            name="tags"
                            onChange={addDeleteTag}
                        >
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="col-sm-2 control-label ">
                        Добавить тег
                    </label>

                    <div className="col-sm-10 row">
                        <input
                            className="form-control"
                            style={{ width: '70%' }}
                            name="new tag"
                            type="text"
                            onChange={e =>
                                setNewsDetail({
                                    ...newsDetail,
                                    newTag: e.target.value,
                                })
                            }
                            value={newsDetail.newTag}
                        />
                        <button
                            className="btn btn-info col-2"
                            onClick={onClickNewTag}
                        >
                            Новый тег
                        </button>
                    </div>
                </div>

                <div className="form-actions mt-3">
                    <button className="btn btn-primary js-tooltip">
                        Добавить
                    </button>
                </div>
            </fieldset>
        </form>
    );
}

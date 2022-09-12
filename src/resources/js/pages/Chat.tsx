import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

interface PostData {
    text: string;
    submit: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function Chat(): React.ReactElement {

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<PostData>();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<PostData> = (data: PostData) => {
        setLoading(true)

        axios.get('/sanctum/csrf-cookie').then(() => {
			axios.post('/api/post', data).then(res => {
				swal("送信成功", "送信成功", "success");
                console.log(res);
			  	setLoading(false);
			}).catch(error => {
			  	console.log(error)
			  	setError('submit', {
				type: 'manual',
				message: '送信に失敗しました'
			})
			  	setLoading(false);
			})
		})
    }

    const initialState = [
        {
            text: 'sample1',
        },
        {
            text: 'sample2',
        },
        {
            text: 'sample3',
        },     
    ]

    const [posts, setPosts] = useState(initialState);

	useEffect(() => {
        window.Echo.channel('post').listen('Posted', (e: any) => {
            console.log(e);
            console.log(e.post.text);
            setPosts(posts => [...posts,{text: e.post.text}]);
        });
	}, [])

    return (
        <React.Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <ul id='board'>
                                    { posts.map((post, index) => (
                                    <li key={ index }>{ post.text }</li>
                                    ))}
                                </ul>
                            </div>

                            <form className="py-4" onSubmit={e => {clearErrors(); handleSubmit(onSubmit)(e)}}>
                                <div className="card-body">
                                    <div className="py-4">
                                        <TextField
                                            fullWidth
                                            variant="outlined" 
                                            id="text"
                                            label="メッセージ" 
                                            {...register('text', {
                                            required: '入力してください'
                                            })} 
                                        />
                                    </div>
                                        
                                    <div>
                                        <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Submit</LoadingButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Chat;
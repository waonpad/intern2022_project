import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const theme = createTheme();

function Chat(): React.ReactElement {
    const [initial_loading, setInitialLoading] = useState(true);

    const [post_get_api_method, setPostGetApiMethod] = useState('post/index');
    const [request_params, setRequestParams] = useState<any>({});
    const [listening_channel, setListeningChannel] = useState('post');
    const [listening_event, setListeningEvent] = useState('Posted');

    const {category_id} = useParams<{category_id: string}>();

    useEffect(() => {
        console.log(category_id);
        if(category_id !== undefined) {
            setPostGetApiMethod('post/category');
            setRequestParams({category_id: category_id});
            // setListeningChannel(); // 未設定
            // setListeningEvent(); // 未設定

            // イベント通知先要設定

            // CAUTION: 別カテゴリーに直接遷移した場合stateが引き継がれる
        }
        setInitialLoading(false);
    }, []);

    return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth={'md'} sx={{padding: 0}}>
            <CssBaseline />
                {!initial_loading ? (
                    <PostList
                    post_get_api_method={post_get_api_method}
                    request_params={request_params}
                    listening_channel={listening_channel}
                    listening_event={listening_event}
                    />
                ) : (
                    <CircularProgress sx={{textAlign: 'center'}} />
                )}
                <PostForm />
            </Container>
        </ThemeProvider>
    );
}

export default Chat;
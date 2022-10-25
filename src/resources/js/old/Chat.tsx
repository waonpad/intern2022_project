import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
// import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Editor } from '@tinymce/tinymce-react';
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import FormHelperText from '@mui/material/FormHelperText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {useAuth} from "../AuthContext";

interface PostData {
    // id: number | null;
    title: string;
    comment: string;
    categories: string[];
    submit: string;
}

interface PostErrorData {
    // id: string;
    title: string;
    comment: string;
    categories: string;
    submit: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

const theme = createTheme();

function Chat(): React.ReactElement {

    const basicSchema = Yup.object().shape({
        title: Yup.string().max(50).required()
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<PostData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const auth = useAuth();
    const [post_loading, setPostLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    // tinyMCE /////////////////////////////////////////////////////////////
    const [comment, setComment] = useState('');
    const [comment_error, setCommentError] = useState(false);
    const handleEditorChange = (content: any, editor: any) => {
        console.log("Content was updated:", content);
        setComment(content);
        if(content === '') {
            setCommentError(true);
        }
        else {
            setCommentError(false);
        }
    };
    /////////////////////////////////////////////////////////////////////////

    // Categoriess /////////////////////////////////////////////////////////////
    const [categories, setCategories] = useState<MuiChipsInputChip[]>([]);

    const handleSelecetedCategories = (selectedItem: MuiChipsInputChip[]) => {
        setCategories(selectedItem);
    }
    //////////////////////////////////////////////////////////////////////

    // Submit //////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<PostData> = (data: PostData) => {
        if(comment === '') {
            setCommentError(true);
            return false;
        }
        else {
            setCommentError(false);
        }
        data.comment = comment;
        data.categories = categories;
        console.log(data);
        setLoading(true);
        setCategories([]);
        setComment('');
        reset();
        // Enterしていないカテゴリーの入力欄はリセットされない
        // Commentが空白になるのでrequiredが出る

        axios.post('/api/post/upsert', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                swal("送信成功", "送信成功", "success");
                console.log(res);
                setLoading(false);
            }
            else {
                const obj: PostErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof PostErrorData)[]).forEach((key) => setError(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setLoading(false)
            }
        })
        .catch(error => {
            console.log(error)
            setError('submit', {
            type: 'manual',
            message: '送信に失敗しました'
        })
            setLoading(false);
        })
    }
    /////////////////////////////////////////////////////////////////////////

    // Channel ////////////////////////////////////////////////////////////////////
    const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
        axios.get('/api/post/index').then(res => {
            if (res.status === 200) {
                console.log(res);
                console.log(res.data.posts);
                setPosts(res.data.posts);
                setPostLoading(false);
                console.log('投稿取得完了');
            }
        });

        window.Echo.channel('post').listen('Posted', (channel_event: any) => {
            console.log(channel_event);
            console.log(channel_event.post);
            setPosts(posts => [...posts, channel_event.post]);
            console.log(posts);
            console.log('新しい投稿を受信');
        });
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const post_id = event.currentTarget.getAttribute('data-like-id');

        axios.post('/api/post/liketoggle', {post_id: post_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const like_status = res.data.like_status;
                const target_post = posts.find((post) => (post.id == post_id));
                target_post.like_status = like_status;
                setPosts((posts) => posts.map((post) => (post.id === post_id ? target_post : post)));
                console.log(`いいね状態: ${like_status}`);
            }
            else {
                console.log(res);
            }
        })
        .catch(error => {
            console.log(error)
        })
    };
    //////////////////////////////////////////////////////////////////////////////////////////

    // DeletePost //////////////////////////////////////////////////////////////
    const handleDeletePost = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const post_id = event.currentTarget.getAttribute('data-delete-id');

        axios.post('/api/post/destroy', {post_id: post_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const target_post = posts.find((post) => (post.id == post_id));
                setPosts(posts.filter((post, index) => (post.id !== target_post.id)));
                console.log('投稿削除成功');
            }
            else {
                console.log(res);
            }
        })
        .catch(error => {
            console.log(error)
        })
    };
    ////////////////////////////////////////////////////////////////////////////////////

    return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth={'md'} sx={{padding: 0}}>
            <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                    }}
                >
                    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                        {!post_loading ? (
                            posts.map((post, index) => (
                                <Grid item xs={12} sx={{minWidth: '100%'}} key={index}>
                                    <Card elevation={3}>
                                        <CardHeader
                                            action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon />
                                                {/* TODO: アクション追加 */}
                                            </IconButton>
                                            }
                                            title={post.title}
                                            subheader={
                                                <React.Fragment>
                                                    <Link to={`/user/${post.user.screen_name}`}>{post.user.name}</Link>
                                                    <Typography>{post.created_at}</Typography>
                                                </React.Fragment>
                                            }
                                            sx={{pb: 1}}
                                        />
                                        <CardContent sx={{pt: 0}}>
                                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {(post.categories as any[]).map((category: any, index: number) => (
                                                    <Chip label={category.name} key={index} />
                                                ))}
                                            </Stack>
                                            <Typography variant="body2" component="div" color="text.secondary" dangerouslySetInnerHTML={{ __html: post.comment }} sx={{pt: 2}} />
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            {auth?.user ?
                                                auth?.user.id == post.user.id ? (
                                                    <React.Fragment>
                                                        <IconButton>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton data-delete-id={post.id} onClick={handleDeletePost}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </React.Fragment>
                                            ) : (
                                                // いいねボタン
                                                <IconButton data-like-id={post.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                                    <FavoriteIcon color={post.like_status ? 'secondary' : 'inherit'} />
                                                </IconButton>
                                            ) : (
                                                // (ログインしていない(今後ログインしていなくても見れるようにするかも) いいねボタン?)
                                                <IconButton data-like-id={post.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                                    <FavoriteIcon color={post.like_status ? 'secondary' : 'inherit'} />
                                                </IconButton>
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <CircularProgress />
                        )}
                    </Grid>
                </Box>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, minWidth: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="post-title"
                                    label="Post Title"
                                    autoComplete="post-title"
                                    {...register('title')}
                                    error={errors.title ? true : false}
                                    helperText={errors.title?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MuiChipsInput
                                    value={(categories as string[])}
                                    onChange={handleSelecetedCategories}
                                    fullWidth
                                    variant='outlined'
                                    id='categories'
                                    label='Categories'
                                    placeholder=''
                                    aria-multiline
                                    maxRows={10}
                                    validate={(chipValue) => {
                                        return {
                                            isError: chipValue.length > 50,
                                            textError: 'the value must be at least 50 characters long'
                                        }
                                    }}
                                />
                                <FormHelperText sx={{mt: 1, ml: 2}}>Double click to edit a category</FormHelperText>
                            </Grid>
                            <Grid item xs={12}>
                                <Editor
                                    apiKey={process.env.MIX_APP_TINY_MCE_APP_KEY}
                                    // initialValue="<p>This is the initial content of the editor</p>"
                                    init={{
                                    skin: "material-classic",
                                    content_css: 'material-classic',
                                    icons: "material",
                                    placeholder: "Comment",
                                    height: 200,
                                    menubar: true,
                                    textcolor_rows: "4",
                                    toolbar:
                                        "undo redo | styleselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent "
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                                <FormHelperText sx={{mt: 1, ml: 2, color: '#d32f2f'}}>{comment_error ? 'comment is a required field' : ''}</FormHelperText>
                            </Grid>
                        </Grid>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Post
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Chat;
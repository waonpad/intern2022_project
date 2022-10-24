import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
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
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<PostData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

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
        setLoading(true)

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

    // Channel ////////////////////////////////////////////////////////////////////
    const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
        axios.get('/api/post/index').then(res => {
            if (res.status === 200) {
                console.log(res);
                console.log(res.data.posts);
                setPosts(res.data.posts);
                // setLoading(false);
            }
        });


        window.Echo.channel('post').listen('Posted', (e: any) => {
            console.log(e);
            console.log(e.post);
            setPosts([...posts, e.post]);
            console.log(posts);
        });
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    };

    return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth={false}>
            <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                    }}
                >
                    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                        { posts.map((post, index) => (
                            <Grid item xs={12} key={index}>
                                <Card elevation={3}>
                                    <CardHeader
                                        avatar={
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                            R
                                        </Avatar>
                                        }
                                        action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                        }
                                        title="Shrimp and Chorizo Paella"
                                        subheader="September 14, 2016"
                                    />
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image="/static/images/cards/paella.jpg"
                                        alt="Paella dish"
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                        This impressive paella is a perfect party dish and a fun meal to cook
                                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                                        if you like.
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton id={post.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                        <FavoriteIcon />
                                        </IconButton>
                                        {/* <IconButton aria-label="share">
                                        <ShareIcon />
                                        </IconButton> */}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
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
                    {/* <Typography component="h1" variant="h5">
                        Post
                    </Typography> */}
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="post_title"
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
                                    // plugins: [
                                    //     "advlist autolink lists link image charmap print preview anchor",
                                    //     "searchreplace visualblocks code fullscreen textcolor ",
                                    //     "insertdatetime media table paste code help wordcount"
                                    // ],
                                    textcolor_rows: "4",
                                    toolbar:
                                        "undo redo | styleselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent "
                                    }}
                                    onEditorChange={handleEditorChange}
                                    // toolbar="code"
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
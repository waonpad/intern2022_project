import React, { useState } from "react";
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

import {useAuth} from "../AuthContext";

interface EmailAndPasswordData {
    screen_name: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    submit: string;
}

function Register(): React.ReactElement{
    
    const { register, handleSubmit, setError, formState: { errors } } = useForm<EmailAndPasswordData>();
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const auth = useAuth()

    const onSubmit: SubmitHandler<EmailAndPasswordData> = (data: EmailAndPasswordData) => {
        setLoading(true)
        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.register(data).then(() => {
                swal("Success", "登録成功", "success");
                history.push('/')
                location.reload();
            }).catch((error) => {
                setError('submit', {
                type: 'manual',
                message: '登録に失敗しました。再度登録をしてください'
            })
                setLoading(false)
            })
        })
    }

    return (
        <div className="p-4 max-w-screen-sm mx-auto">
        <h1 className="text-center text-xl font-bold">アカウント作成</h1>
        <p className="text-center"><Link to="/login" className="text-sm c-link">アカウントを持っている方はこちら</Link></p>
        <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4">
            <TextField 
            fullWidth
            variant="outlined" 
            label="ID" 
            {...register('screen_name', {
                required: '入力してください'
            })} 
            />
            {errors.screen_name && <span className="block text-red-400">{errors.screen_name.message}</span>}
        </div>
        <div className="py-4">
            <TextField 
            fullWidth
            variant="outlined" 
            label="名前" 
            {...register('name', {
                required: '入力してください'
            })} 
            />
            {errors.name && <span className="block text-red-400">{errors.name.message}</span>}
        </div>
        <div className="py-4">
            <TextField 
            fullWidth
            variant="outlined" 
            label="メールアドレス" 
            {...register('email', {
                required: '入力してください'
            })} 
            />
            {errors.email && <span className="block text-red-400">{errors.email.message}</span>}
        </div>
        <div className="py-4">
            <TextField 
            fullWidth
            id="password"
            type="password" 
            variant="outlined" 
            label="パスワード" 
            {...register('password', {
                required: '入力してください',
                minLength: {
                value: 8,
                message: '8文字以上で入力してください'
                }
            })} 
            />
            {errors.password && <span className="block text-red-400">{errors.password.message}</span>}
        </div>
        <div className="py-4">
            <TextField 
            fullWidth
            type="password" 
            variant="outlined" 
            label="パスワード確認" 
            {...register('password_confirmation', {
                required: '入力してください',
                validate: {
                match: value => value === (document.getElementById('password') as HTMLInputElement).value || 'パスワードが一致しません'
                }
            })} 
            />
            {errors.password_confirmation && <span className="block text-red-400">{errors.password_confirmation.message}</span>}
        </div>
        <div>
            <LoadingButton type="submit" loading={loading} variant="contained" fullWidth>アカウントを作成する</LoadingButton>
            {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
        </div>
        </form>
        </div>
    )
}

export default Register
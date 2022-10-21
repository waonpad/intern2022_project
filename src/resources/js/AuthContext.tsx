import axios, { AxiosResponse } from "axios";
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react"
import {Route, Redirect, useHistory} from "react-router-dom"
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

interface User {
	id: number
	screen_name: string
	name: string
	email: string
	email_verified_at: string | null
	two_factor_recovery_codes: string | null
	two_factor_secret: string | null
	created_at: string
	updated_at: string | null
}
interface LoginData {
	email: string,
	password: string,
}
interface RegisterData {
	screen_name: string,
	name: string,
	email: string,
	password: string,
	password_confirmation: string,
}
interface authProps {
	user: User | null;
	register: (registerData: RegisterData) => Promise<void>
	signin: (loginData: LoginData) => Promise<void>;
	signout: () => Promise<void>;
}
interface Props {
  	children: ReactNode
}
interface RouteProps {
	children: ReactNode,
	path: string,
	exact?: boolean
}
interface From {
  	from: Location
}

const authContext = createContext<authProps | null>(null)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const ProvideAuth = ({children}: Props) => {
	const auth = useProvideAuth();
	const classes = useStyles();
    console.log(auth?.user);
	if (auth.load) {
		return (
			<Backdrop className={classes.backdrop} open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
	}
	else {
		return (
			<authContext.Provider value={auth}>
			{children}
			</authContext.Provider>
		)
	}
}
export default ProvideAuth

export const useAuth = () => {
  	return useContext(authContext)
}

const useProvideAuth = () => {
	const [user, setUser] = useState<User | null>(null);

	const [load, setLoad] = useState(true); // 最初にユーザー情報を取得して認証状態を確認するまでロード画面を表示させる

	const register = (registerData: RegisterData) => {
		return axios.post('/api/register', registerData).then((res) => {
			console.log(res);
			if (res.data.status === true) {
				setUser(res.data.user);
				return res;
			}
			else {
				const callback: any = res;
				return callback;
			}
		})
	}

	const signin = async (loginData: LoginData) => {
		return axios.post('/api/login', loginData).then((res) => {
			console.log(res);
			if (res.data.status === true) {
				setUser(res.data.user);
				return res;
			}
			else {
				const callback: any = res;
				return callback;
			}
		})
	}

	const signout = () => {
		return axios.post('/api/logout', {}).then(() => {
		setUser(null)
		})
	}

	useEffect(() => {
		axios.get('/api/user').then((res) => {
		setUser(res.data)
        console.log('ログイン済み');
		setLoad(false)
		}).catch((error) => {
		setUser(null)
        console.log('ログインしていない');
		setLoad(false)
		})
	}, [])

	return {
		user,
		register,
		signin,
		signout,
		load
	}
}

/**
 * 認証済みのみアクセス可能
 */
export const PrivateRoute = ({children, path, exact = false}: RouteProps) => {
	const auth = useAuth()
	return (
		<Route
		path={path}
		exact={exact}
		render={({ location }) => {
			if(auth?.user == null) {
			return <Redirect to={{ pathname: "/login", state: { from: location }}}/>
			} else {
			return children
			}
		}}
		/>
	)
}


/**
 * 認証していない場合のみアクセス可能（ログイン画面など）
 */
export const PublicRoute = ({children, path, exact = false}: RouteProps) => {
	const auth = useAuth()
	const history = useHistory()
	return (
		<Route
		path={path}
		exact={exact}
		render={({ location }) => {
			if(auth?.user == null) {
			return children
			} else {
			return <Redirect to={{pathname: (history.location.state as From) ? (history.location.state as From).from.pathname : '/' , state: { from: location }}}/>
			}
		}}
		/>
	)
}
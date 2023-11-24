// ** React Imports
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FaGooglePlusG } from 'react-icons/fa';
import axios from 'axios';

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';
import useJwt from '@src/auth/jwt/useJwt';
import themeConfig from '@configs/themeConfig';

// ** Third Party Components
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Facebook, Twitter, Mail, GitHub, Coffee, X } from 'react-feather';

// ** Actions
import { handleLogin } from '@store/authentication';

// ** Context
import { AbilityContext } from '@src/utility/context/Can';

// ** Custom Components
import Avatar from '@components/avatar';
import InputPasswordToggle from '@components/input-password-toggle';

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils';

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
} from 'reactstrap';

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg';
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg';

// ** Styles
import '@styles/react/pages/page-authentication.scss';
import jwtDefaultConfig from '../../../@core/auth/jwt/jwtDefaultConfig';

const ToastContent = ({ t, name, role }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>
          You have successfully logged in as an {role} user to Vuexy. Now you
          can start to explore. Enjoy!
        </span>
      </div>
    </div>
  );
};

const defaultValues = {
  password: '',
  loginEmail: '',
};

const Login = () => {
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;

  const handleSuccess = (data) => {
    const payload = {
      ...data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      ability: data.user.role.ability,
      role: data.user.role.name,
    };
    dispatch(handleLogin(payload));
    ability.update(payload.ability);
    navigate(getHomeRouteForLoggedInUser(payload.role));
    toast((t) => (
      <ToastContent
        t={t}
        role={payload.role || 'admin'}
        name={
          data.fullName ||
          `${payload.first_name} ${payload.last_name}` ||
          'Thuong To'
        }
      />
    ));
  };

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      try {
        const res = await useJwt.login({
          email: data.loginEmail,
          password: data.password,
        });

        if (res.status === 200) {
          handleSuccess(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message ?? error.code);
      }
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
          });
        }
      }
    }
  };

  const responseGoogle = async (response) => {
    if (!response.tokenId) {
      return;
    }

    try {
      const { status, data } = await axios.post(
        `${jwtDefaultConfig.authEndpoint}/google`,
        {
          idToken: response.tokenId,
        }
      );

      if (status === 200) {
        handleSuccess(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message ?? error.code);
    }
  };

  const responseFacebook = async (response) => {
    console.log(response);
    if (!response.accessToken) {
      return;
    }

    try {
      const { status, data } = await axios.post(
        `${jwtDefaultConfig.authEndpoint}/facebook`,
        {
          accessToken: response.accessToken,
        }
      );

      if (status === 200) {
        handleSuccess(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message ?? error.code);
    }
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo logo-wrap"
          to="/"
          onClick={(e) => e.preventDefault()}
          style={{ width: 120 }}
        >
          <img
            src={themeConfig.app.appLogoImage}
            alt="logo"
            className="responsive-logo"
          />
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Welcome to Admin! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>

            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  id="loginEmail"
                  name="loginEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <Button type="submit" color="primary" block>
                Sign in
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">New on our platform?</span>
              <Link to="/register">
                <span>Create an account</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                autoLoad={false}
                callback={responseFacebook}
                scope="public_profile,email"
                render={(renderProps) => (
                  <Button color="facebook" onClick={renderProps.onClick}>
                    <Facebook size={14} />
                  </Button>
                )}
              />

              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                autoLoad={false}
                render={(renderProps) => (
                  <Button
                    color="google"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FaGooglePlusG size={14} />
                  </Button>
                )}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />

              <Button className="me-0" color="github">
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;

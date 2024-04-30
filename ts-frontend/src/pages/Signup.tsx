
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/sign-up.png";
import HttpStatusCode from "../types/HttpStatusCode";
import Loader from "../components/Loader";

const BASE_API_URI = import.meta.env.VITE_BACKEND_URI;

interface Credentials {
  email: string;
  name: string;
  username: string;
  password: string;
}

function Signup() {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    name: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notifyA = (str: string) => toast.success(str);
  const notifyB = (str: string) => toast.error(str);

  const navigate = useNavigate();
  // const { setUserLogin } = useContext(LoginContext)

  const inputEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})",
  );

  const postData = async (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (!strongPassword.test(credentials.password)) {
      notifyB(
        "Your password is not strong enough !!! Strong password must be of length 5 atleast, containing atleast one lowercase, uppercase, special character, and numeric digits",
      );
    } else {
      try {
        const response = await fetch(`${BASE_API_URI}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            username: credentials.username,
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const { status } = response;

        const jsonData = await response.json();

        if (status === HttpStatusCode.OK) {
          notifyA("Sign up successful");
          setTimeout(() => {
            navigate("/auth");
          }, 4000);
        } else if (status === HttpStatusCode.LENGTH_REQUIRED) {
          notifyB(`${jsonData.errors[0].msg}`);
        } else if (status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
          notifyB(`${jsonData.error}`);
        } else {
          notifyB("Oops !!! enter valid credentials");
        }
      } catch (error) {
        console.log(error);
        notifyB("Oops !!! enter valid credentials");
      }
    }
  };

  // const continueWithGoogle = async (credentialResponse: GoogleLoginProps) => {
  // 	try {
  // 		const jwtDetail = jwtDecode(credentialResponse.c)
  // 		const response = await fetch(`${BASE_API_URI}/api/googleLogin`, {
  // 			method: 'POST',
  // 			headers: {
  // 				'Content-Type': 'application/json',
  // 			},
  // 			body: JSON.stringify({
  // 				emailVerified: jwtDetail.emailVerified,
  // 				email: jwtDetail.email,
  // 				name: jwtDetail.name,
  // 				clientId: credentialResponse.clientId,
  // 				username: jwtDetail.name,
  // 				Photo: jwtDetail.picture,
  // 			}),
  // 		})
  // 		const { status } = response

  // 		const jsonData = await response.json()

  // 		if (status === HttpStatusCode.OK) {
  // 			notifyA(`Welcome ${jsonData.username}`)
  // 			setUserLogin(true)
  // 			localStorage.setItem('jwt', jsonData.token)
  // 			localStorage.setItem('user', JSON.stringify(jsonData.user))
  // 			setTimeout(() => {
  // 				navigate('/')
  // 			}, 5000)
  // 		} else if (status === HttpStatusCode.LENGTH_REQUIRED) {
  // 			notifyB(`${jsonData.errors[0].msg}`)
  // 		} else if (status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
  // 			notifyB(`${jsonData.error}`)
  // 		} else {
  // 			notifyB('Oops !!! enter valid credentials')
  // 		}
  // 	} catch (error) {
  // 		console.log(error)
  // 		notifyB('Oops !!! enter valid credentials')
  // 	}
  // }

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pingBackend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_API_URI}/api/ping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { status } = response;

      const jsonData = await response.json();
      console.log(jsonData);
      if (status === HttpStatusCode.OK) {
        // handle signup if the backend is up and running
        setIsLoading(false);
      }
    } catch {
      // handle signup if the backend is not up and running
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="signUp">
          <div className="wrapper-container">
            <div className="project-title-container">
              <h1>Privacy Network</h1>
            </div>
            <div className="form-container input-div">
              <div className="form">
                <img src={logo} alt="User Profile Photo" />
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={credentials.email}
                    placeholder="Email Id"
                    onChange={inputEvent}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Full Name"
                    value={credentials.name}
                    onChange={inputEvent}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={inputEvent}
                  />
                </div>
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={inputEvent}
                  />{" "}
                  <button
                    type="button"
                    id="show-password-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"} Password
                  </button>
                </div>
                <input
                  type="submit"
                  id="submit-btn"
                  value="Sign Up"
                  onClick={(event) => postData(event)}
                  style={{ marginBottom: "5px" }}
                />
                {/* <div className='google-login-container'>
							<GoogleLogin
								onSuccess={continueWithGoogle}
								onError={() => {
									console.log('Login Failed')
								}}
							/>
						</div> */}
                <div className="form-footer">
                  <br />
                  Already have an account ?
                  <br />
                  <Link to="/auth" style={{ textDecoration: "none" }}>
                    <span
                      style={{
                        color: "#1877f2",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {"   "} Sign In
                    </span>
                  </Link>
                </div>
              </div>
              <ToastContainer autoClose={3000} theme="dark" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;

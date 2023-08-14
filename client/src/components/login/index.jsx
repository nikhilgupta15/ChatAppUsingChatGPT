import { useState, useEffect } from "react";
import {
  usePostLoginMutation,
  usePostSignUpMutation,
  useCheckUniqueUsernameMutation,
} from "@/state/api";
import Dropzone from "react-dropzone";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Login = ({ setUser, setSecret }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [triggerLogin, resultLogin] = usePostLoginMutation();
  const [triggerSignUp, resultRegister] = usePostSignUpMutation();
  const [triggerCheckUsername, resultCheckUsername] =
    useCheckUniqueUsernameMutation();
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [preview, setPreview] = useState("");
  const [attachment, setAttachment] = useState("");

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const pwdRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const handleLogin = () => {
    setErrors({
      username: username === "" ? "Username cannot be empty" : "",
      password: password === "" ? "Password cannot be empty" : "",
    });
    if (errors.username === "" && errors.password === "") {
      triggerLogin({ username, password });
    }
  };

  const handleRegister = () => {
    setErrors({
      firstName: firstName === "" ? "First Name cannot be empty" : "",
      lastName: lastName === "" ? "Last Name cannot be empty" : "",
      email:
        email === ""
          ? "Email cannot be empty"
          : email.match(emailRegex) == null
          ? "Email Address is invalid"
          : "",
      username: username === "" ? "Username cannot be empty" : "",
      password:
        password === ""
          ? "Password cannot be empty"
          : password.match(pwdRegex) == null
          ? "Password is invalid"
          : "",
    });

    if (
      errors.firstName === "" &&
      errors.lastName === "" &&
      errors.email === "" &&
      errors.username === "" &&
      errors.password === ""
    ) {
      triggerCheckUsername({ username });
    }
  };

  useEffect(() => {
    if (resultRegister.data?.response) {
      setIsRegister(false);
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
      });
      setPreview("");
      setAttachment("");
    }
  }, [resultRegister.data]); // eslint-disable-line

  useEffect(() => {
    if (resultLogin.data?.response) {
      setUser(username);
      setSecret(password);
    }
  }, [resultLogin.data]); // eslint-disable-line

  useEffect(() => {
    if (resultCheckUsername.data && !resultCheckUsername.data.response) {
      triggerSignUp({
        username,
        password,
        firstName,
        lastName,
        email,
        attachment,
      });
    }
    if (resultCheckUsername.data && resultCheckUsername.data.response) {
      setErrors({
        ...errors,
        username: "Username already exists",
      });
    }
  }, [resultCheckUsername.data]); // eslint-disable-line

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="title">CHATGPT APP</h2>
        <p
          className="register-change"
          onClick={() => {
            setUsername("");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setErrors({
              firstName: "",
              lastName: "",
              email: "",
              username: "",
              password: "",
            });
            setPreview("");
            setAttachment("");
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? "Already a user?" : "Are you a new user?"}
        </p>
        <div className="flexbetween">
          <div className="login-form">
            {isRegister ? (
              <>
                <div className="flexbetween">
                  <label className="login-label">
                    First Name <span className="login-star">*</span>
                  </label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <p className="login-error">{errors.firstName}</p>
                </div>
                <div className="flexbetween">
                  <label className="login-label">
                    Last Name <span className="login-star">*</span>
                  </label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    id="lastName"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                  <p className="login-error">{errors.lastName}</p>
                </div>
                <div className="flexbetween">
                  <label className="login-label">
                    Email <span className="login-star">*</span>
                  </label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Email"
                    value={email}
                    id="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <p className="login-error">{errors.email}</p>
                </div>
              </>
            ) : null}
            <div className="flexbetween">
              <label className="login-label">
                Username <span className="login-star">*</span>
              </label>
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={username}
                id="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="login-error">{errors.username}</p>
            </div>
            <div className="flexbetween">
              <label className="login-label">
                Password <span className="login-star">*</span>
              </label>
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="login-error">{errors.password}</p>
            </div>
          </div>
          {isRegister ? (
            <div className="login-avatar">
              {preview ? (
                <div className="message-form-preview">
                  <img
                    alt="login-avatar"
                    src={preview}
                    className="avatar-image"
                  />
                  <XMarkIcon
                    className="message-form-icon-x"
                    onClick={() => {
                      setPreview("");
                    }}
                  />
                </div>
              ) : (
                <div className="empty-image-container"></div>
              )}
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                noClick={true}
                onDrop={(acceptedFiles) => {
                  setAttachment(acceptedFiles[0]);
                  setPreview(URL.createObjectURL(acceptedFiles[0]));
                }}
              >
                {({ getRootProps, getInputProps, open }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <button className="login-buttons" onClick={open}>
                      Upload Photo
                    </button>
                  </div>
                )}
              </Dropzone>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="login-actions">
          {isRegister ? (
            <button
              className="login-buttons"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          ) : (
            <button
              className="login-buttons"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

// const SignUpPage = () => {
//   return <h1>Sign Up</h1>;
// };

import { Component } from "react";
import axios from "axios";

class SignUpPage extends Component {
  state = {
    // disabled: true,
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signupSuccess: false,
  };

  onChange = (e) => {
    const { id, value } = e.target;
    this.setState({
      [id]: value,
    });
  };

  // onChangeUsername = (e) => {
  //   const currentValue = e.target.value;
  //   this.setState({
  //     username: currentValue,
  //   });
  // };
  // onChangeEmail = (e) => {
  //   const currentValue = e.target.value;
  //   this.setState({
  //     email: currentValue,
  //   });
  // };

  // onChangePassword = (e) => {
  //   const currentValue = e.target.value;
  //   this.setState({
  //     password: currentValue,
  //     // disabled: currentValue !== this.state.passwordRepeat,
  //   });
  // };

  // onChangePasswordRepeat = (e) => {
  //   const currentValue = e.target.value;
  //   this.setState({
  //     passwordRepeat: currentValue,
  //     // disabled: currentValue !== this.state.password,
  //   });
  // };

  submit = async (e) => {
    e.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    // axios.post("/api/1.0/users", body);
    // fetch("/api/1.0/users", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    // axios.post("http://localhost:8080/api/1.0/users", body);

    /* Added proxy in package.json */
    try {
      await axios.post("/api/1.0/users", body);
      this.setState({ signupSuccess: true });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signupSuccess } = this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signupSuccess && (
          <form className="card mt-5" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  className="form-control"
                  placeholder="username"
                  onChange={this.onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  id="email"
                  className="form-control"
                  placeholder="email"
                  onChange={this.onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  className="form-control"
                  type="password"
                  placeholder="password"
                  onChange={this.onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordRepeat" className="form-label">
                  Password Repeat
                </label>
                <input
                  id="passwordRepeat"
                  className="form-control"
                  type="password"
                  placeholder="passwordRepeat"
                  onChange={this.onChange}
                />
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary"
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                >
                  {apiProgress && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      // aria-hidden="true"
                    ></span>
                  )}
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        )}
        {signupSuccess && (
          <div className="alert alert-success mt-3">
            Please check your email to activate your account
          </div>
        )}
      </div>
    );
  }
}

export default SignUpPage;

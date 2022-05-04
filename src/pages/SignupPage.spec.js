import SignupPage from "./SignUpPage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignupPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      render(<SignupPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign up button", () => {
      render(<SignupPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(<SignupPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );
    beforeEach(() => {
      counter = 0;
    });

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    let button;
    const setup = () => {
      render(<SignupPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");

      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "user1@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enable the button when password and repeat password fields have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("sends username, email and password to backend after clicking the button", async () => {
      setup();
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });

    it("disables button when there is an ongoing api call", async () => {
      setup();

      userEvent.click(button);
      userEvent.click(button);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(counter).toBe(1);
    });

    it("displays spinner after clicking the submit", async () => {
      setup();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      userEvent.click(button);

      /* to access the  hidden element , we use {hidden:true} */
      // const spinner = screen.getByRole("status");
      const spinner = screen.getByRole("status");

      expect(spinner).toBeInTheDocument();
    });

    it("displays account activation notification after successful sign up request", async () => {
      setup();

      const message = "Please check your email to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      userEvent.click(button);

      // await waitFor(() => {
      //   expect(screen.getByText(message)).toBeInTheDocument();
      // });

      // "findby" used as it support await

      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();

      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);

      /* waitFor can be used */
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });

      // or waitforElemenToBeRemoved
      // await waitForElementToBeRemoved(form);
    });
  });
});

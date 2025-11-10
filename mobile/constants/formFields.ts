export const registerFormFields = [
  {
    id: "username",
    type: "text",
    label: "Nazwa użytkownika",
    placeholder: "Nazwa użytkownika",
  },
  {
    id: "email",
    type: "emailAddress",
    label: "Email",
    placeholder: "email@example.com",
  },
  {
    id: "password",
    type: "password",
    label: "Hasło",
    placeholder: "Hasło",
  },
  {
    id: "confirmPassword",
    type: "password",
    label: "Potwierdź hasło",
    placeholder: "Potwierdź hasło",
  },
];

export const loginFormFields = [
  {
    id: "username",
    type: "text",
    label: "Nazwa użytkownika",
    placeholder: "Nazwa użytkownika",
  },
  {
    id: "password",
    type: "password",
    label: "Hasło",
    placeholder: "Hasło",
  },
];

export type FormFieldItem = {
  id: string;
  type: string;
  label: string;
  placeholder: string;
};
export type FormFields = FormFieldItem[];

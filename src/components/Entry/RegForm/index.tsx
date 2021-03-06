import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ICreateUser, IUserWithTerms } from '../../../types/user';
import { createNewUser } from '../../../services/user-controller';
import Submit from '../Submit';
import {
  CheckboxWrapper,
  FormWrap,
  getInputErrorVisibilityStyle,
  InputError,
  InputsArea,
  SearchInpit,
} from '../Entry.styles';
import Checkbox from '../Checkbox';

export default function RegForm(): React.ReactElement {
  const passReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$');

  const initialValues: IUserWithTerms & { confirmPassword: string } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: true,
  };

  const regForm = useFormik({
    initialValues,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, 'Введите не менее 3 символов')
        .max(15, 'Имя не должно превышать 15 символов')
        .required('Заполните поле!'),
      lastName: Yup.string()
        .min(3, 'Введите не менее 3 символов')
        .max(20, 'Фамилия не должна превышать 20 символов')
        .required('Заполните поле!'),
      email: Yup.string().email('Не валидный email').required('Заполните поле!'),
      password: Yup.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .matches(passReg, 'Пароль должен содержать 1 цифру, 1 заглавную и 1 не заглавную букву.')
        .required('Заполните поле!'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
        .required('Заполните поле!'),
      terms: Yup.boolean().oneOf([true], 'Требуется согласие на обработку данных'),
    }),
    onSubmit: (values: ICreateUser) => {
      const result = JSON.stringify(values);
      console.log(result);
      createNewUser(values)
        .then(() => alert('Регистрация прошла успешно!'))
        .catch((e) => alert(`Error ${e.message}`));
    },
  });

  return (
    <FormWrap>
      <form onSubmit={regForm.handleSubmit}>
        <InputsArea>
          <SearchInpit
            $isReg
            id="firstName"
            name="firstName"
            placeholder="Введите ваше имя"
            value={regForm.values.firstName}
            onChange={regForm.handleChange}
          />
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.firstName && regForm.touched.firstName) as boolean
            )}
          >
            {regForm.errors.firstName}
          </InputError>
          <SearchInpit
            $isReg
            id="lastName"
            name="lastName"
            placeholder="Введите вашу фамилию"
            value={regForm.values.lastName}
            onChange={regForm.handleChange}
          />
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.lastName && regForm.touched.lastName) as boolean
            )}
          >
            {regForm.errors.lastName}
          </InputError>
          <SearchInpit
            $isReg
            id="email"
            name="email"
            placeholder="Введите ваш e-mail"
            value={regForm.values.email}
            onChange={regForm.handleChange}
          />
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.email && regForm.touched.email) as boolean
            )}
          >
            {regForm.errors.email}
          </InputError>
          <SearchInpit
            $isReg
            type="password"
            id="password"
            name="password"
            placeholder="Придумайте ваш пароль"
            value={regForm.values.password}
            onChange={regForm.handleChange}
          />
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.password && regForm.touched.password) as boolean
            )}
          >
            {regForm.errors.password}
          </InputError>
          <SearchInpit
            $isReg
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Повторите ваш пароль"
            value={regForm.values.confirmPassword}
            onChange={regForm.handleChange}
          />
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.confirmPassword && regForm.touched.confirmPassword) as boolean
            )}
          >
            {regForm.errors.confirmPassword}
          </InputError>
          <CheckboxWrapper>
            <Checkbox
              id="terms"
              name="terms"
              label="Я даю согласие на обработку своих данных"
              checked={regForm.values.terms}
              onChange={regForm.handleChange}
            />
          </CheckboxWrapper>
          <InputError
            style={getInputErrorVisibilityStyle(
              (regForm.errors.terms && regForm.touched.terms) as boolean
            )}
          >
            {regForm.errors.terms}
          </InputError>
        </InputsArea>
        <Submit type="submit" label="Зарегистрироваться" size="medium" />
      </form>
    </FormWrap>
  );
}

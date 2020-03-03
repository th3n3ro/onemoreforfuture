import React from 'react'
import { Button } from 'react-bootstrap'

import useForm from '../utils/useForm'

import { Input } from './Input'

export const AddUserForm = ({ onSubmit }) => {
  const { inputs, onChangeInput, errors, onSubmitForm, formValidity } = useForm(onSubmit)

  return (
    <form
      onSubmit={onSubmitForm}
      noValidate
      className="w100p left0p absolute flex z-i-2 bg-white  justify-space-between add-user-form p-2">
      <Input
        name="id"
        type="number"
        value={inputs.id}
        onChange={onChangeInput}
        error={errors.id}
        required={true}
        label="id"
        placeholder="1"
      />
      <Input
        name="firstName"
        type="text"
        value={inputs.firstName}
        onChange={onChangeInput}
        error={errors.firstName}
        required={true}
        label="firstName"
        placeholder="vas9"
      />
      <Input
        name="lastName"
        type="text"
        value={inputs.lastName}
        onChange={onChangeInput}
        error={errors.lastName}
        required={true}
        label="lastName"
        placeholder="pete4kin"
      />
      <Input
        name="email"
        type="email"
        value={inputs.email}
        onChange={onChangeInput}
        error={errors.email}
        required={true}
        label="email"
        placeholder="vasyapete4kin@mail.ru"
      />
      <Input
        name="phone"
        type="tel"
        value={inputs.phone}
        onChange={onChangeInput}
        error={errors.phone}
        required={true}
        label="phone"
        pattern="^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$"
        placeholder="+7 999 111 22 22"
      />
      <Button disabled={!formValidity} variant="dark" className="ml-2 " type="submit">
        Добавить пользователя
      </Button>
    </form>
  )
}

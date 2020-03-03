// здесь должна быть библиотека для работы с формами
import { useState } from 'react'

const inputTarget = {}
const errorTarget = {}

const handler = {
  get(target, prop) {
    Reflect.has(target, prop) || Reflect.set(target, prop, ``)
    return Reflect.get(target, prop)
  }
}

const input = new Proxy(inputTarget, handler)
const error = new Proxy(errorTarget, handler)

export default submitCallback => {
  const [errors, setErrors] = useState(error)
  const [inputs, setInputs] = useState(input)
  const [formValidity, setFormValidity] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const CheckValidityInput = target => {
    let { name, minLength, maxLength, pattern, type } = target
    const { tooShort, tooLong, typeMismatch, valid, valueMissing, patternMismatch } = target.validity

    if (tooShort || tooLong) {
      setErrors(errors => ({
        ...errors,
        [name]: `Поле должно содержать от ${minLength}  ${(maxLength !== -1 && `до ${maxLength}`) || ``} символов`
      }))
    } else if (valueMissing) {
      setErrors(errors => ({ ...errors, [name]: 'Это поле обязательно' }))
    } else if ((type = 'email' && typeMismatch)) {
      setErrors(errors => ({ ...errors, [name]: 'Введите корректную почту' }))
    } else if ((type = 'tel' && patternMismatch)) {
      setErrors(errors => ({ ...errors, [name]: 'Введите корректный номер телефона' }))
    } else if (!!valid) {
      setErrors(errors => ({ ...errors, [name]: false }))
    }
  }
  const isValidForm = target => {
    return Array.from(target.elements).every(input => input.validity.valid)
  }

  const onChangeInput = ({ target }) => {
    const form = target.closest('form')
    inputs.form && delete inputs.form
    const { name, value } = target
    setInputs(inputs => ({ ...inputs, [name]: value }))
    setErrors(errors => ({ ...errors, form: false }))
    CheckValidityInput(target)
    setFormValidity(() => isValidForm(form))
  }
  const checkTotalFormValidity = target => {
    setFormValidity(() => Array.from(target.elements).forEach(input => CheckValidityInput(input)))
  }

  const onSubmitForm = async e => {
    e.preventDefault()
    inputs.form && delete inputs.form
    checkTotalFormValidity(e.target)
    if (isValidForm(e.target)) {
      try {
        setFormSubmitting(true)
        await submitCallback(e)
        for (let prop in inputs) {
          inputs[prop] = ``
        }
        setInputs(inputs => ({ ...inputs, form: true }))
        setErrors(errors => ({ ...errors, form: false }))
      } catch (error) {
        setErrors(errors => ({ ...errors, form: error.message }))
        setInputs(inputs => ({ ...inputs, form: true }))
      } finally {
        setFormSubmitting(false)
      }
    }
  }
  return { inputs, onChangeInput, errors, formSubmitting, onSubmitForm, formValidity }
}

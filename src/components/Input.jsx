import React from 'react'

export const Input = ({ value, onChange, error, label, name, type, required = true, pattern, ...rest }) => {
  return (
    <label className="flex flex-column  justify-center align-center relative ">
      {label}
      <input
        className="mt-2 p-2"
        {...rest}
        required={required}
        type={type}
        name={name}
        value={value}
        pattern={pattern}
        onChange={onChange}
      />
      {error && (
        <div
          style={{
            top: '110%'
          }}
          className="flex-center absolute w100p bg-white  ">
          <p
            style={{
              textAlign: 'center'
            }}
            className="error-message flex-center ">
            {error}
          </p>
        </div>
      )}
    </label>
  )
}

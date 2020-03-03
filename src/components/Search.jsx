import React, { forwardRef } from 'react'

export const Search = forwardRef(({ value, onChange, type, ...props }, ref) => {
  return <input ref={ref} type={type} onChange={onChange} value={value} {...props} />
})

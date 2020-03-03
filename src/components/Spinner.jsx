import React from 'react'
import { Spinner as BootstrapSpinner } from 'react-bootstrap'

export const Spinner = ({ message }) => {
  return (
    <div className="mt-2 flex-center flex-column">
      <BootstrapSpinner animation="border" />
      <p className="mt-2">{message}</p>
    </div>
  )
}

import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

export const Dropdown = ({ children, buttonValue, ...rest }) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(o => !o)
  return (
    <>
      <Button variant="dark" className="ml-2 mt-2" {...rest} onClick={toggleOpen}>
        {buttonValue}
      </Button>
      {open && children}
    </>
  )
}

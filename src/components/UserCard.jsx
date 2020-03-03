import React from 'react'
import { Card } from 'react-bootstrap'
export const UserCard = ({
  firstName = '',
  lastName = '',
  description = '',
  streetAddress = '',
  city = '',
  state = '',
  zip = ''
}) => (
  <Card bg="dark" text="white" className="w100p">
    <Card.Body>
      <Card.Text>
        Выбран пользователь:
        <b>
          {firstName} {lastName}{' '}
        </b>
      </Card.Text>
      {description && (
        <Card.Text>
          Описание: <br />
          {description}
        </Card.Text>
      )}
      {streetAddress && (
        <Card.Text>
          Адрес проживания:<b>{streetAddress}</b>
        </Card.Text>
      )}
      {city && (
        <Card.Text>
          Город:
          <b>{city}</b>
        </Card.Text>
      )}
      {state && (
        <Card.Text>
          Провинция/штат:
          <b>{state}</b>
        </Card.Text>
      )}
      {zip && (
        <Card.Text>
          Индекс:
          <b>{zip}</b>
        </Card.Text>
      )}
    </Card.Body>
  </Card>
)

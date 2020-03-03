import React, { useEffect, useContext, useRef, useState, useCallback } from 'react'
import { Button } from 'react-bootstrap'

import { StateContext } from './components/StateContext'
import * as actions from './reducer/actions'

import { bigDataUrl, smallDataUrl } from './constants'

import { AddUserForm } from './components/AddUserForm'
import { Paginator } from './components/Paginator'
import { Dropdown } from './components/Dropdown'
import { UserCard } from './components/UserCard'
import { Spinner } from './components/Spinner'
import { Search } from './components/Search'
import { Table } from './components/Table'

const App = () => {
  const { state, dispatch } = useContext(StateContext)

  const [localTableData, setLocalTableData] = useState(state.loadedData)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowCount, setRowCount] = useState(50)
  const [maxPage, setMaxPage] = useState(null)
  const [search, setSearch] = useState(``)

  const searchInput = useRef(null)
  const types = useRef([
    ['id', 'number'],
    ['firstName', 'string'],
    ['lastName', 'string'],
    ['email', 'string'],
    ['phone', 'string']
  ])

  const addUser = ({ target: form }) => {
    const newUser = [...form.elements].reduce((acc, input) => {
      const { name, value } = input
      acc[name] = value
      form.reset()
      return acc
    }, {})
    dispatch(actions.addUser(newUser))
  }

  const changeSearchParams = e => {
    e.preventDefault()
    const value = searchInput.current.value
    setSearch(() => value)
  }

  const loadBigData = () => {
    dispatch(actions.selectDataUrl(bigDataUrl))
  }

  const loadSmallData = () => {
    dispatch(actions.selectDataUrl(smallDataUrl))
  }

  const changePage = page => setCurrentPage(() => +page)

  const showUserInformation = useCallback(user => {
    const { firstName, lastName, description, address } = user
    setSelectedUser(() => ({
      firstName,
      lastName,
      description,
      ...address
    }))
  }, [])

  const switchPage = useCallback(() => {
    if (localTableData) {
      const newMaxPage = Math.ceil(localTableData.length / rowCount)
      const newCurrentPage = currentPage > newMaxPage ? 1 : currentPage
      setCurrentPage(() => newCurrentPage)
      setMaxPage(() => newMaxPage)
    }
  }, [rowCount, currentPage, localTableData])

  const filterTable = useCallback(() => {
    const lowerValue = search.toLowerCase()
    const filter = pieaceData => {
      return Object.values(pieaceData).some(v =>
        v
          .toString()
          .toLowerCase()
          .includes(lowerValue)
      )
    }
    if (state.loadedData) setLocalTableData(() => state.loadedData.filter(filter))
  }, [state.loadedData, setLocalTableData, search])

  const loadData = useCallback(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(state.selectedDataUrl)
        const data = await res.json()
        dispatch(actions.fetchDataSucsess(data))
      } catch {
        dispatch(actions.fetchDataFail('Дружочек, я не смог загрузить данные. Попробуй позже '))
      }
    }
    if (state.selectedDataUrl) fetchData()
  }, [state.selectedDataUrl, dispatch])

  useEffect(filterTable, [filterTable])
  useEffect(switchPage, [switchPage])
  useEffect(loadData, [loadData])

  return state.selectedDataUrl ? (
    localTableData ? (
      <div className="flex flex-column">
        <div className="flex justify-space-between relative w100p mt-2">
          <form onSubmit={changeSearchParams}>
            <Search ref={searchInput} className="ml-2" type="text" />
            <Button variant="dark" className="ml-2 " type="submit">
              Найти
            </Button>
          </form>
          <div>
            <Dropdown className="mr-2" buttonValue="Добавить">
              <AddUserForm onSubmit={addUser} />
            </Dropdown>
          </div>
        </div>
        <Table
          onRowClick={showUserInformation}
          defaultSortField="id"
          currentPage={currentPage}
          rowCount={rowCount}
          data={localTableData}
          types={types.current}
        />
        {selectedUser && <UserCard {...selectedUser} />}
        <div className="flex justify-center">
          <Paginator className="mt-2" maxPage={maxPage} page={currentPage} onPageChange={changePage} />
        </div>
      </div>
    ) : (
      <div className="h100p flex-center">
        <Spinner message={'Гружу юзеров'} />
      </div>
    )
  ) : (
    <>
      <div className="flex-center w100p h100p">
        <Button variant="dark" className="ml-2 mt-2" onClick={loadBigData}>
          bigData
        </Button>
        <Button variant="dark" className="ml-2 mt-2" onClick={loadSmallData}>
          smallData
        </Button>
      </div>
    </>
  )
}

export default App

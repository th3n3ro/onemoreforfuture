import React, { useEffect, useContext, useRef, useCallback, useReducer } from 'react'
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

  const [{ filteredData, selectedUser, rowCount, currentPage, maxPage, search }, setAppState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    {
      filteredData: null,
      selectedUser: null,
      rowCount: 50,
      currentPage: 1,
      maxPage: null,
      search: ``
    }
  )

  const searchInput = useRef(null)
  const types = useRef([
    ['id', Number],
    ['firstName', String],
    ['lastName', String],
    ['email', String],
    ['phone', String]
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
    setAppState({ search: value })
  }

  const loadBigData = () => {
    dispatch(actions.selectDataUrl(bigDataUrl))
  }

  const loadSmallData = () => {
    dispatch(actions.selectDataUrl(smallDataUrl))
  }

  const changePage = page => setAppState({ currentPage: +page, selectedUser: null })

  const showUserInformation = useCallback(user => {
    const { firstName, lastName, description, address } = user
    setAppState({
      selectedUser: {
        firstName,
        lastName,
        description,
        ...address
      }
    })
  }, [])

  const switchPage = useCallback(() => {
    if (filteredData) {
      const newMaxPage = Math.ceil(filteredData.length / rowCount) || 1
      const newCurrentPage = currentPage > newMaxPage ? 1 : currentPage
      setAppState({
        currentPage: newCurrentPage,
        maxPage: newMaxPage
      })
    }
  }, [filteredData, rowCount, currentPage])

  const filterTable = useCallback(() => {
    // Фильтруем только те значения, которые в таблице
    const lowerValue = search.toLowerCase()
    const filter = pieaceData => {
      const onlyInViewOfTable = Object.entries(pieaceData).filter(([key]) =>
        types.current.some(([type]) => type === key)
      )

      const values = onlyInViewOfTable.map(([_, value]) => value)
      return values.some(v =>
        v
          .toString()
          .toLowerCase()
          .includes(lowerValue)
      )
    }
    if (state.loadedData) setAppState({ filteredData: state.loadedData.filter(filter) })
  }, [state.loadedData, search])

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

  if (state.errorMessage) return <div>{state.errorMessage}</div>

  return state.selectedDataUrl ? (
    filteredData ? (
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
          data={filteredData}
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

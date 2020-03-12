import React, { useState, memo } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'

export const Table = memo(
  ({ data, types, rowCount = 50, currentPage = 1, defaultSortField, defaultSortBy = 'desc', onRowClick }) => {
    // defaultSortBy= "desc"||"asc"
    const [sortBy, setSortBy] = useState(defaultSortBy)
    const [sortField, setSortField] = useState(defaultSortField)

    const generateUniqKey = (acc, value) => {
      return acc + value.toString()
    }
    const sortAsNumber = (a, b) => {
      const n = sortBy === 'desc' ? -1 : 1
      return +a[sortField] > +b[sortField] ? n : -n
    }
    const sortAsString = (a, b) => {
      const n = sortBy === 'desc' ? -1 : 1
      let i = 0
      try {
        while (a[sortField][i].toLowerCase() === b[sortField][i].toLowerCase()) ++i
      } catch {
        // если мы так будем сравнивать 2 строки йцук и йцукенг, то выкинет ошибку
        return 1
      }
      return a[sortField][i].toLowerCase() > b[sortField][i].toLowerCase() ? -n : n
    }
    const getTypeofSortField = () => {
      const [, sortFieldType] = types.find(([fieldName]) => fieldName === sortField)
      return sortFieldType
    }

    const sort = () => {
      const typeofSortField = getTypeofSortField(sortField)
      switch (typeofSortField) {
        case Number: {
          return sortAsNumber
        }
        case String: {
          return sortAsString
        }
        default: {
          throw new Error('Дружочек, я не могу сортировать по такому типу')
        }
      }
    }

    const reverseSort = () => setSortBy(prevSort => (prevSort === 'desc' ? 'asc' : 'desc'))

    const sortTable = ({ target }) => {
      if (target.tagName !== 'TD') return
      const clickedField = target.dataset.fieldName
      if (clickedField === sortField) return reverseSort()
      setSortField(clickedField)
      setSortBy(defaultSortBy)
    }
    const handleRowClick = ({ target }) => {
      const tr = target.closest('tr')
      const findWithTheSameId = data => Object.values(data).reduce(generateUniqKey, ``) === peaceDataKey
      if (!tr) return
      const peaceDataKey = tr.dataset.peaceDataKey
      const peaceData = viewData.find(findWithTheSameId)

      onRowClick(peaceData)
    }

    const sortedData = data.sort(sort())

    const viewDataStartIndex = (currentPage - 1) * rowCount
    const viewDataEndIndex = (currentPage - 1) * rowCount + rowCount

    const viewData = sortedData.slice(viewDataStartIndex, viewDataEndIndex)
    return (
      <BootstrapTable className="mt-2" striped bordered hover responsive variant="dark">
        <thead onClick={sortTable}>
          <tr>
            {types.map(([fieldName]) => (
              <td data-field-name={fieldName} key={fieldName}>
                <span> {fieldName} </span>
                {fieldName === sortField && sortBy === 'desc' && <span className="arrow-down"></span>}
                {fieldName === sortField && sortBy === 'asc' && <span className="arrow-up"></span>}
              </td>
            ))}
          </tr>
        </thead>
        <tbody onClick={handleRowClick}>
          {viewData.map((data, index) => {
            const peaceDataKey = Object.values(data).reduce(generateUniqKey, ``)
            const pieaceDataIndex = viewDataStartIndex + index
            return (
              <tr data-peace-data-key={peaceDataKey} key={peaceDataKey}>
                {types.map(([fieldName]) => (
                  <td key={fieldName}>{sortedData[pieaceDataIndex][fieldName]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
        <tfoot></tfoot>
      </BootstrapTable>
    )
  }
)

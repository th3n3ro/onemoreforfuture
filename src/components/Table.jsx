import React, { useState, memo } from 'react'
import { Table as BootstrapTable } from 'react-bootstrap'

export const Table = memo(
  ({ data, types, rowCount = 50, currentPage = 1, defaultSortField, sortType = 'desc', onRowClick }) => {
    // sortType= "desc"||"asc"
    const [[sortField, sortBy], setSort] = useState([defaultSortField, sortType])

    const generateUniqKey = (acc, value) => {
      return acc + value.toString()
    }
    const sortAsNumber = (a, b, sortType) => {
      const n = sortType === 'desc' ? -1 : 1
      return +a > +b ? n : -n
    }
    const sortAsString = (a, b, sortType) => {
      const n = sortType === 'desc' ? 1 : -1

      let i = 0
      try {
        while (a[i].toLowerCase() === b[i].toLowerCase()) ++i
      } catch {
        // если мы так будем сравнивать 2 строки йцук и йцукенг, то выкинет ошибку
        return 1
      }
      return a[i].toLowerCase() > b[i].toLowerCase() ? n : -n
    }
    const getTypeofSortField = field => {
      const [, sortFieldType] = types.find(([fieldName]) => fieldName === sortField)
      return sortFieldType
    }

    const sort = (a, b) => {
      const typeofSortField = getTypeofSortField(sortField)
      const sortFieldValue1 = a[sortField]
      const sortFieldValue2 = b[sortField]

      switch (typeofSortField) {
        case 'number': {
          return sortAsNumber(sortFieldValue1, sortFieldValue2, sortBy)
        }
        case 'string': {
          return sortAsString(sortFieldValue1, sortFieldValue2, sortBy)
        }
        default: {
          throw new Error('Дружочек, я не могу сортировать по такому типу')
        }
      }
    }

    const reverseSort = () => {
      const newSortBy = sortBy === 'desc' ? 'asc' : 'desc'
      setSort(() => [sortField, newSortBy])
    }

    const sortTable = ({ target }) => {
      if (target.tagName !== 'TD') return
      const clickedField = target.dataset.fieldName
      if (clickedField === sortField) return reverseSort()
      setSort(() => [clickedField, sortType])
    }
    const handleRowClick = ({ target }) => {
      const tr = target.closest('tr')
      const findWithTheSameId = data => Object.values(data).reduce(generateUniqKey, ``) === peaceDataKey
      if (!tr) return
      const peaceDataKey = tr.dataset.peaceDataKey
      const peaceData = viewData.find(findWithTheSameId)

      onRowClick(peaceData)
    }

    const sortedData = data.sort(sort)

    const viewDataStartIndex = (currentPage - 1) * rowCount
    const viewDataEndIndex = (currentPage - 1) * rowCount + rowCount

    const viewData = sortedData.slice(viewDataStartIndex, viewDataEndIndex)
    return (
      <BootstrapTable className="mt-2" striped bordered hover variant="dark">
        <thead onClick={sortTable}>
          <tr>
            {types.map(([fieldName]) => (
              <td data-field-name={fieldName} key={fieldName}>
                {fieldName}
                {fieldName === sortField && sortBy === 'desc' && <span> &#11167;</span>}
                {fieldName === sortField && sortBy === 'asc' && <span> &#11165;</span>}
              </td>
            ))}
          </tr>
        </thead>
        <tbody onClick={handleRowClick}>
          {viewData.map((data, index) => {
            const peaceDataKey = Object.values(data).reduce(generateUniqKey, ``)
            const pieaceDataIndex = viewDataStartIndex + index
            return (
              <tr data-peace-data-key={[peaceDataKey]} key={peaceDataKey}>
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

import React from 'react'
import { Pagination } from 'react-bootstrap'

export const Paginator = ({ maxPage, page, onPageChange, offset = 1, ...rest }) => {
  const nextPage = () => {
    if (page >= maxPage) return
    onPageChange(page + 1)
  }
  const prevPage = () => {
    if (page <= 1) return
    onPageChange(page - 1)
  }
  const firstPage = () => onPageChange(1)
  const lastPage = () => onPageChange(maxPage)
  const changePage = ({ target }) => {
    if (target.tagName !== 'A') return
    const page = +target.innerText
    onPageChange(page)
  }
  return (
    <Pagination {...rest}>
      <Pagination.First onClick={firstPage} />
      <Pagination.Prev onClick={prevPage} />
      {[...Array(offset)].map((_, index, arr) => {
        return (
          page - arr.length + index >= 1 && (
            <Pagination.Item key={index} onClick={changePage}>
              {page - arr.length + index}
            </Pagination.Item>
          )
        )
      })}
      <Pagination.Item onClick={changePage} active={true}>
        {page}
      </Pagination.Item>
      {[...Array(offset)].map((_, index) => {
        return (
          page + index + 1 <= maxPage && (
            <Pagination.Item key={index} onClick={changePage}>
              {page + 1 + index}
            </Pagination.Item>
          )
        )
      })}
      <Pagination.Next onClick={nextPage} />
      <Pagination.Last onClick={lastPage} />
    </Pagination>
  )
}

import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ListProducts from '../components/products/ListProducts'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('q')
  const params = `title__startswith=${search}`
  return (
    <ListProducts search={search} params={params} />
  )
}

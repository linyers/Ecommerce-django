import OrdersList from '../components/orders/OrdersList'

export default function Purchases() {
  return (
    <main className="bg-gray-600 flex flex-row gap-5 p-8">
      <div className="bg-gray-200 w-full rounded-md shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-950">Mis compras</h3>
        <OrdersList />
      </div>
    </main>
  )
}

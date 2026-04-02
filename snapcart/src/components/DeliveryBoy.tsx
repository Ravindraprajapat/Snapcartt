import React from 'react'
import DeliveryBoyDashBoard from './DeliveryBoyDashBoard'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import Order from '@/models/orderModel'

const DeliveryBoy = async () => {
  await connectDb()
  const session = await auth()
    const DeliveryBoyId = session?.user?.id
    const orders = await Order.find({
      assignedDeliveryBoy : DeliveryBoyId,
      deliveryOtpVerification:true
    })

    const today = new Date().toDateString()

     const todatOrders = orders.filter(order=>new Date(order.deliveredAt).toDateString() === today).length
     const todayEarning = todatOrders * 40

  return (
    <>
      <DeliveryBoyDashBoard earning={todayEarning} />
    </>
  )
}

export default DeliveryBoy

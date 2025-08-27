const { Order, OrderItem, Product, Payment } = require('../models')

const checkout = async (req, res) => {
  try {
    const { paymentMethod, currency } = req.body
    if (!paymentMethod) return res.status(400).json({ message: 'Payment method required' })

    const cart = await req.user.getCart({ include: { model: Product } })
    if (!cart || cart.Products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const totalAmount = cart.Products.reduce((sum, product) => {
      return sum + product.CartItem.quantity * product.price
    }, 0)

    const order = await Order.create({
      userId: req.user.id,
      status: 'pending',
      totalAmount,
      currency
    })

    await Promise.all(
      cart.Products.map(product =>
        OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: product.CartItem.quantity,
          price: product.price
        })
      )
    )

    const payment = await Payment.create({
      orderId: order.id,
      method: paymentMethod,
      status: 'pending',
      amount: totalAmount,
      currency
    })

    await cart.setProducts([])

    res.status(201).json({ order, payment })
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }, Payment]
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }, Payment]
    })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }, Payment]
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    await order.update({ status })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    await order.destroy()
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message })
  }
}

const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: Payment })
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const { status } = req.body
    if (!['success', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    if (!order.Payment) {
      return res.status(400).json({ message: 'No payment found for this order' })
    }

    await order.Payment.update({ status })

    if (status === 'success') {
      await order.update({ status: 'paid' })
    } else {
      await order.update({ status: 'failed' })
    }

    res.json({ message: 'Payment status updated', order })
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message })
  }
}

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  confirmPayment
}

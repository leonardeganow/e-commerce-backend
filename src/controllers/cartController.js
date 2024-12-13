import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, productid, quantity, color, size } = req.body;

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than zero" });
    }

    const product = await ProductModel.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    const cart =
      (await CartModel.findOne({ user: userId })) ||
      new CartModel({ user: userId, items: [] });

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productid &&
        item.color === color &&
        item.size === size
    );

    const currentQuantityInCart =
      existingItemIndex >= 0 ? cart.items[existingItemIndex].quantity : 0;
    const totalQuantity = currentQuantityInCart + quantity;

    // if (totalQuantity > product.stock) {
    //   return res.status(400).json({ message: `this item is out of stock` });
    // }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = totalQuantity;
    } else {
      cart.items.push({
        product: productid,
        color,
        size,
        quantity,
        price: product.price,
        currency: product.currency,
      });
    }

    await cart.save();

    // Deduct stock
    product.stock -= quantity;
    await product.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchCartWithDetails = async (req, res) => {
  try {
    const { userid } = req.params;
    const cart = await CartModel.findOne({ user: userid }).populate(
      "items.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Find the index of the item in the cart's items array
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart's items array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Removed Successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, operator } = req.body;

    // Find the cart for the provided userId
    let cart = await CartModel.findOne({ user: userId });

    // If cart doesn't exist, return an error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user." });
    }

    // Find the item in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    // If the item doesn't exist, return an error
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    if (operator === "+") {
      // Increase the quantity of the existing item by 1
      existingItem.quantity++;
    }

    if (operator === "-") {
      // Check if the quantity is greater than 1. If it isn't, return
      if (existingItem.quantity < 2) {
        return res.status(400).json({
          status: false,
          message: "You need more than one item in your cart to decrease",
        });
      } else {
        // Increase the quantity of the existing item by 1
        existingItem.quantity--;
      }
    }

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: `${operator == "+" ? "increased" : "decreased"}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await CartModel.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for the user." });
    }

    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export {
  addToCart,
  fetchCartWithDetails,
  removeFromCart,
  updateCartQuantity,
  clearCart,
};

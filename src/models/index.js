const { DataTypes } = require('sequelize');
const db = require('../config/db')


const User = db.define('User', {
    user_id : {
      type : DataTypes.UUID,
      primaryKey : true,
      allowNull : false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber : {
        type : DataTypes.BIGINT
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo : {
      type : DataTypes.STRING,
      allowNull : true
    },
    address : {
      type : DataTypes.STRING,
      allowNull : true
    },
    dateofBirth : {
      type : DataTypes.STRING,
      allowNull : true
    },
    point : {
      type : DataTypes.BIGINT,
      defaultValue : 0
    },
    isActive : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    firstname : {
      type : DataTypes.STRING
    },
    lastname : {
      type : DataTypes.STRING
    },
    gender : {
      type : DataTypes.STRING
    },
    deletedAt : {
      type : DataTypes.DATE
    }
  });
  
  const Category = db.define('Category', {
    category_id : {
      type : DataTypes.UUID,
      allowNull : false,
      primaryKey : true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  const Product = db.define('Product', {
    product_id : {
      type : DataTypes.UUID,
      allowNull : false,
      primaryKey : true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_id : {
      type : DataTypes.UUID,
      allowNull : true
    },
    deleted_at : {
      type : DataTypes.DATE
    }
  });
  
  const Order = db.define('Order', {
    order_id : {
      type : DataTypes.UUID,
      primaryKey : true, 
      allowNull : false
    },
    user_id : {
      type : DataTypes.UUID,
      allowNull : false
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
  });
  
  const OrderItem = db.define('OrderItem', {
    order_item_id : {
      type : DataTypes.UUID,
      primaryKey : true,
      allowNull : false
    },
    order_id : {
      type : DataTypes.UUID
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    product_id : {
      type : DataTypes.UUID
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  
  const Cart = db.define("Cart", {
    cart_id : {
      type : DataTypes.UUID,
      primaryKey : true,
      allowNull : false
    },
    user_id : {
      type : DataTypes.UUID
    },
    total : {
      type : DataTypes.BIGINT
    }
  })

  const CartItem = db.define("CartItem", {
    cart_item_id : {
      type : DataTypes.UUID,
      primaryKey : true,
      allowNull : false
    },
    cart_id : {
      type : DataTypes.UUID
    },
    product_id : {
      type : DataTypes.UUID
    },
    quantity : {
      type : DataTypes.BIGINT
    },
    price : {
      type : DataTypes.BIGINT
    }
  })

  // Define associations
  User.hasMany(Order, {foreignKey : "user_id"});
  Order.belongsTo(User, {foreignKey : "user_id"});
  OrderItem.belongsTo(Product, {foreignKey : "product_id"})

  Category.hasMany(Product, {foreignKey : "category_id"});
  Product.belongsTo(Category, {foreignKey : "category_id"});
  
  Order.hasMany(OrderItem, {foreignKey : 'order_id'})

  Cart.hasMany(CartItem, {foreignKey : "cart_id"})
  CartItem.belongsTo(Product, {foreignKey : "product_id"})
  // OrderItem.belongsTo(Order, {foreignKey : 'order_id'})

  // Order.belongsToMany(Product, { through: OrderItem });
  // Product.belongsToMany(Order, { through: OrderItem });
  
  module.exports = {
    User,
    Category,
    Product,
    Order,
    OrderItem,
    Cart,
    CartItem
  };
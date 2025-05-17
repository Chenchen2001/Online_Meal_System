require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mysql = require("mysql")

const app = express();
const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '011119',
  database : 'sky_take_out'
});

const JWT_EXP_PERIOD = '1h'
 
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('connected to mysql server');
});

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username: name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Missing name or password' });
  }

  try {
    connection.query('SELECT * FROM user WHERE openid = ?', [name], async (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const create_time = new Date();

      connection.query(
        'INSERT INTO user (openid, name, password, create_time, auth_flag, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        [name, name, hashedPassword, create_time, 'customer', '#'],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error creating user' });
          }
          return res.status(201).json({ message: 'User registered successfully', result });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', (req, res) => {
  const { username: name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Missing name or password' });
  }

  connection.query('SELECT * FROM user WHERE openid = ?', [name], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Contact IT Support!' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'No such user!' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        openid: user.openid,
        name: user.name,
        auth_flag: user.auth_flag,
        gender: user.sex,
        avatar: user.avatar,
        phone: user.phone,
        id_number: user.id_number,
        openid: user.openid,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXP_PERIOD }
    );

    res.json({ token });
  });
});


app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected data', user: req.user });
});

app.post('/updateProfile', authenticateToken, async (req, res) => {
  const { avatar, oldPassword, newPassword, phone, id_number, gender, name, openid } = req.body;
  const id = req.user.id;

  connection.query("SELECT password FROM user WHERE id = ?", [id], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const currentPasswordHash = results[0].password;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password is required to change password" });
      }

      const match = await bcrypt.compare(oldPassword, currentPasswordHash);
      if (!match) {
        return res.status(400).json({ message: "Old password incorrect" });
      }
    }

    const fields = [];
    const values = [];

    if (avatar && avatar.length <= 500) {
      fields.push("avatar = ?");
      values.push(avatar);
    }

    if (name && name.length <= 30) {
      fields.push("name = ?");
      values.push(name);
    }

    if (openid && openid.length <= 1) {
      fields.push("openid = ?");
      values.push(openid);
    }

    if (gender && gender.length <= 1) {
      fields.push("sex = ?");
      values.push(gender);
    }

    if (newPassword && newPassword.length <= 30) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (phone && phone.length <= 11) {
      fields.push("phone = ?");
      values.push(phone);
    }

    if (id_number && id_number.length <= 18) {
      fields.push("id_number = ?");
      values.push(id_number);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const sql = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    connection.query(sql, values, (err) => {
      if (err) return res.status(500).json({ message: "DB update error" });
      res.json({ message: "Profile updated successfully. Please re-login." });
    });
  });
});

app.get('/getFoodLst', authenticateToken, (req, res) => {
    const { page = 1, pageSize = 10, name, category_id } = req.query;
    const offset = (page - 1) * pageSize;

    let baseQuery = "SELECT * FROM dish WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM dish WHERE 1=1";
    const params = [];
    const countParams = [];

    if (name) {
        baseQuery += " AND name LIKE ?";
        countQuery += " AND name LIKE ?";
        params.push(`%${name}%`);
        countParams.push(`%${name}%`);
    }

    if (category_id) {
        baseQuery += " AND category_id = ?";
        countQuery += " AND category_id = ?";
        params.push(category_id);
        countParams.push(category_id);
    }

    baseQuery += " LIMIT ? OFFSET ?";
    params.push(parseInt(pageSize), parseInt(offset));

    connection.query(baseQuery, params, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Query failed', error });
        }

        connection.query(countQuery, countParams, (countError, countResults) => {
            if (countError) {
                return res.status(500).json({ success: false, message: 'Count query failed', error: countError });
            }

            res.json({
                success: true,
                data: results,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total: countResults[0].total
                }
            });
        });
    });
});


app.delete("/deleteDish", authenticateToken, async (req, res) => {
    const { id } = req.query;
        
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: 0,
            message: "Valid dish ID is required"
        });
    }

    connection.query(
        "DELETE FROM dish WHERE id = ?", 
        [id],
        (err, result, fields)=>{
            if(err) {
                console.error('Delete error:', error);
                res.status(500).json({
                    status: 0,
                    message: "Internal server error"
                });
            } else if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 0,
                    message: "Dish not found or already deleted"
                });
            } else {
                res.json({
                    status: 1,
                    data: {
                        message: "Dish deleted successfully",
                        deletedId: id
                    }
                });
            }
        }
    );
});

app.put("/updateDish", authenticateToken, async (req, res) => {
    const { id, name, price, image, description, status, category_id } = req.body;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: 0,
            message: "Valid dish ID is required"
        });
    }

    connection.query(
        "UPDATE dish SET name = ?, price = ?, image = ?, description = ?, status = ?, category_id = ? WHERE id = ?", 
        [name, price, image, description, status, category_id, id],
        (err, result, fields) => {
            if(err) {
                console.error('Update error:', err);
                res.status(500).json({
                    status: 0,
                    message: "Internal server error"
                });
            } else if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 0,
                    message: "Dish not found"
                });
            } else {
                res.json({
                    status: 1,
                    data: {
                        message: "Dish updated successfully",
                        updatedId: id
                    }
                });
            }
        }
    );
});

app.post("/addDish", authenticateToken, async (req, res) => {
    const { name, price, image, description, status, category_id } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({
            status: 0,
            message: "Name and price are required"
        });
    }

    connection.query(
        "INSERT INTO dish (name, price, image, description, status, category_id) VALUES (?, ?, ?, ?, ?, ?)", 
        [name, price, image, description, status, category_id],
        (err, result, fields) => {
            if(err) {
                console.error('Add error:', err);
                res.status(500).json({
                    status: 0,
                    message: "Internal server error"
                });
            } else {
                res.json({
                    status: 1,
                    data: {
                        message: "Dish added successfully",
                        insertedId: result.insertId
                    }
                });
            }
        }
    );
});

app.get("/getCategories", authenticateToken, (req, res) => {
  connection.query("SELECT id, name, sort, status FROM category ORDER BY sort ASC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
    res.json({ status: 1, data: results });
  });
});

app.get("/getAvailableCategories", authenticateToken, (req, res) => {
  connection.query("SELECT id, name, sort FROM category WHERE status = 1 ORDER BY sort ASC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
    res.json({ status: 1, data: results });
  });
});

app.delete("/deleteCategory", authenticateToken, (req, res) => {
  const id = req.query.id;
  connection.query("UPDATE category SET status = 0 WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
    res.json({ status: 1, data: { message: "Category deleted successfully" } });
  });
});

app.post("/addCategory", authenticateToken, (req, res) => {
  const { name, sort } = req.body;
  connection.query("INSERT INTO category (name, sort, status) VALUES (?, ?, 1)", [name, sort], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
    res.json({ status: 1, data: { message: "Category added successfully" } });
  });
});

app.put("/updateCategory", authenticateToken, (req, res) => {
  const { id, name, sort, status } = req.body;
  connection.query("UPDATE category SET name = ?, sort = ?, status = ? WHERE id = ?", [name, sort, status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Internal server error" });
    }
    res.json({ status: 1, data: { message: "Category updated successfully" } });
  });
});


app.get('/getUsers', authenticateToken, (req, res) => {
    const { page = 1, pageSize = 10, name, auth_flag } = req.query;
    const offset = (page - 1) * pageSize;

    let baseQuery = "SELECT id, openid, name, phone, sex, id_number, avatar, auth_flag FROM user WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM user WHERE 1=1";
    const params = [];
    const countParams = [];

    if (name) {
        baseQuery += " AND name LIKE ?";
        countQuery += " AND name LIKE ?";
        params.push(`%${name}%`);
        countParams.push(`%${name}%`);
    }

    if (auth_flag) {
        baseQuery += " AND auth_flag = ?";
        countQuery += " AND auth_flag = ?";
        params.push(auth_flag);
        countParams.push(auth_flag);
    }

    baseQuery += " LIMIT ? OFFSET ?";
    params.push(parseInt(pageSize), parseInt(offset));

    connection.query(baseQuery, params, (error, results) => {
        if (error) return res.status(500).json({ success: false, message: 'Query failed', error: error.message });

        connection.query(countQuery, countParams, (countErr, countResults) => {
            if (countErr) return res.status(500).json({ success: false, message: 'Count failed', error: countErr.message });

            res.json({
                success: true,
                data: results,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(pageSize),
                    total: countResults[0].total
                }
            });
        });
    });
});

app.post("/addUser", authenticateToken, (req, res) => {
  const { openid, name, phone, sex, id_number, avatar, auth_flag } = req.body;
  const create_time = new Date();

  connection.query(
    "INSERT INTO user (openid, name, phone, sex, id_number, avatar, create_time, auth_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [openid, name, phone, sex, id_number, avatar, create_time, auth_flag],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Add user failed" });
      }

      res.json({
        status: 1,
        message: "User added successfully",
        insertedId: result.insertId
      });
    }
  );
});

app.put("/updateUser", authenticateToken, (req, res) => {
  const { id, openid, name, phone, sex, id_number, avatar, auth_flag } = req.body;

  if (!id) {
    return res.status(400).json({ status: 0, message: "User ID is required" });
  }

  connection.query(
    "UPDATE user SET openid = ?, name = ?, phone = ?, sex = ?, id_number = ?, avatar = ?, auth_flag = ? WHERE id = ?",
    [openid, name, phone, sex, id_number, avatar, auth_flag, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: 0, message: "Update failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 0, message: "User not found" });
      }

      res.json({
        status: 1,
        message: "User updated successfully"
      });
    }
  );
});

app.delete("/deleteUser", authenticateToken, (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ status: 0, message: "User ID is required" });
  }

  connection.query("DELETE FROM user WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: 0, message: "Delete failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    res.json({
      status: 1,
      message: "User deleted successfully",
      deletedId: id
    });
  });
});

app.get("/getSettings", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM settings", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch setting info" });
    }
    res.json({ data: results });
  });
});

app.post("/updateSettings", authenticateToken, (req, res) => {
  const updates = req.body; 
  const keys = Object.keys(updates);

  const queries = keys.map(key => {
    return new Promise((resolve, reject) => {
      connection.query(
        "REPLACE INTO settings (key_name, value) VALUES (?, ?)",
        [key, String(updates[key])],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });

  Promise.all(queries)
    .then(() => res.json({ message: "Settings updated" }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Failed to update settings." });
    });
});

app.post('/analyzejwt', authenticateToken, async (req, res)=>{
    const { token } = req.body
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.sendStatus(401)
        }else{
            res.json({
                staus: 1,
                messgae: "success",
                data: user
            })
        }
    })
})

app.post("/createOrder", authenticateToken, async (req, res) => {
  const { items } = req.body; // [{ dish_id, quantity, price }]
  const user_id = req.user.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items to order" });
  }

  const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  connection.query(
    "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)",
    [user_id, total_price, 'pending'],
    (err, orderResult) => {
      if (err) return res.status(500).json({ message: "Order creation failed" });

      const order_id = orderResult.insertId;
      const itemValues = items.map(item => [order_id, item.dish_id, item.quantity, item.price]);

      connection.query(
        "INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES ?",
        [itemValues],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Failed to save order items" });

          res.json({ message: "Order created", order_id });
        }
      );
    }
  );
});

app.get("/getMyOrders", authenticateToken, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT o.id, o.total_price, o.status, o.create_time, 
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'dish_id', oi.dish_id,
               'name', d.name,
               'quantity', oi.quantity,
               'price', oi.price
             )
           ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN dish d ON oi.dish_id = d.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.create_time DESC
  `;

  connection.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch orders" });

    results.forEach(order => {
      order.items = JSON.parse(order.items);
    });

    res.json({ orders: results });
  });
});


app.get("/getAllOrders", authenticateToken, (req, res) => {
  const sql = `
    SELECT o.id, o.total_price, o.status, o.create_time, u.name AS user_name,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'dish_id', oi.dish_id,
               'name', d.name,
               'quantity', oi.quantity,
               'price', oi.price
             )
           ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN dish d ON oi.dish_id = d.id
    LEFT JOIN user u ON o.user_id = u.id
    GROUP BY o.id
    ORDER BY o.create_time DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching all orders:', err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    results.forEach(order => {
      order.items = JSON.parse(order.items);
    });

    res.json({ orders: results });
  });
});


app.get('/getOrderStats', authenticateToken, (req, res) => {
  // Get today's date at midnight for filtering
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // We'll run all queries in parallel for better performance
  Promise.all([
    // Query for today's order count
    new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) as todayOrders FROM orders WHERE create_time BETWEEN ? AND ?',
        [todayStart, todayEnd],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].todayOrders);
        }
      );
    }),
    
    // Query for today's revenue
    new Promise((resolve, reject) => {
      connection.query(
        'SELECT COALESCE(SUM(total_price), 0) as todayRevenue FROM orders WHERE create_time BETWEEN ? AND ? AND status != ?',
        [todayStart, todayEnd, 'cancelled'],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].todayRevenue);
        }
      );
    }),
    
    // Query for pending orders count
    new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) as pendingOrders FROM orders WHERE status = ?',
        ['pending'],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].pendingOrders);
        }
      );
    }),
    
    // Optional: Query for completed orders count (if you want to display it)
    new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) as completedToday FROM orders WHERE status = ? AND create_time BETWEEN ? AND ?',
        ['completed', todayStart, todayEnd],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].completedToday);
        }
      );
    })
  ])
  .then(([todayOrders, todayRevenue, pendingOrders, completedToday]) => {
    res.json({
      status: 1,
      data: {
        todayOrders: parseInt(todayOrders),
        todayRevenue: parseFloat(todayRevenue),
        pendingOrders: parseInt(pendingOrders),
        completedToday: parseInt(completedToday) // Optional field
      }
    });
  })
  .catch(err => {
    console.error('Error fetching order stats:', err);
    res.status(500).json({
      status: 0,
      message: 'Failed to fetch order statistics'
    });
  });
});

// Accept Order
app.post('/acceptOrder', authenticateToken, (req, res) => {
  const { order_id } = req.body;
  
  if (!order_id) {
    return res.status(400).json({ status: 0, message: "Order ID is required" });
  }

  connection.query(
    "UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'pending'",
    [order_id],
    (err, result) => {
      if (err) {
        console.error('Accept order error:', err);
        return res.status(500).json({ status: 0, message: "Database error" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(400).json({ 
          status: 0, 
          message: "Order not found or already processed" 
        });
      }
      
      res.json({ 
        status: 1, 
        message: "Order accepted successfully",
        order_id 
      });
    }
  );
});

// Reject Order
app.post('/rejectOrder', authenticateToken, (req, res) => {
  const { order_id } = req.body;
  
  if (!order_id) {
    return res.status(400).json({ status: 0, message: "Order ID is required" });
  }

  connection.query(
    "UPDATE orders SET status = 'cancelled' WHERE id = ? AND status = 'pending'",
    [order_id],
    (err, result) => {
      if (err) {
        console.error('Reject order error:', err);
        return res.status(500).json({ status: 0, message: "Database error" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(400).json({ 
          status: 0, 
          message: "Order not found or already processed" 
        });
      }
      
      res.json({ 
        status: 1, 
        message: "Order rejected successfully",
        order_id 
      });
    }
  );
});

// Mark Order as Completed
app.post('/completeOrder', authenticateToken, (req, res) => {
  const { order_id } = req.body;
  
  if (!order_id) {
    return res.status(400).json({ status: 0, message: "Order ID is required" });
  }

  connection.query(
    "UPDATE orders SET status = 'completed' WHERE id = ? AND status = 'paid'",
    [order_id],
    (err, result) => {
      if (err) {
        console.error('Complete order error:', err);
        return res.status(500).json({ status: 0, message: "Database error" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(400).json({ 
          status: 0, 
          message: "Order not found or not in paid status" 
        });
      }
      
      res.json({ 
        status: 1, 
        message: "Order marked as completed successfully",
        order_id 
      });
    }
  );
});

app.get('/getDashboardStats', authenticateToken, (req, res) => {
  // Calculate time ranges
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Execute all queries in parallel
  Promise.all([
    // Today's Orders count
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) as count 
         FROM orders 
         WHERE create_time BETWEEN ? AND ?`,
        [todayStart, todayEnd],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
        }
      );
    }),
    
    // Today's Revenue sum
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COALESCE(SUM(total_price), 0) as revenue 
         FROM orders 
         WHERE create_time BETWEEN ? AND ? 
         AND status IN ('paid', 'completed')`,
        [todayStart, todayEnd],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].revenue);
        }
      );
    }),
    
    // Pending Orders count
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) as count 
         FROM orders 
         WHERE status = 'pending'`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
        }
      );
    })
  ])
  .then(([todayOrders, todayRevenue, pendingOrders]) => {
    res.json({
      status: 1,
      data: {
        todayOrders,
        todayRevenue,
        pendingOrders
      }
    });
  })
  .catch(err => {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      status: 0,
      message: 'Failed to fetch dashboard statistics'
    });
  });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
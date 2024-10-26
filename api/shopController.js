var express = require('express')
var cors = require('cors')
const connection = require('../middleware/db_connect');
require('../globalFunctions'); 
var app = express()
app.use(cors())
app.use(express.json())
const bcrypt = require('bcrypt');
const saltRounds = 10;
const ShopController = {};

ShopController.get = async (req, res, next) => {
  try {
    connection.query(
      'SELECT * FROM `users`',
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.info = async (req, res, next) => {
  try {
    const id = req.body.id;

    connection.query(
      'SELECT * FROM `users` WHERE `id` = ?',
      [id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.create = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      connection.query(
        'INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `lastname`, `shop_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
        [req.body.username, req.body.email, hash, req.body.name, req.body.lastname, req.body.shop_id],
        function (err, results) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(results);
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.update = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      connection.query(
        'UPDATE `users` SET `username` = ?, `email` = ?, `password` = ?, `name` = ?, `lastname` = ?, shop_id = ? WHERE `id` = ?',
        [req.body.username, req.body.email, hash, req.body.name, req.body.lastname, req.body.shop_id, req.body.id],
        function (err, results) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(results);
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.delete = async (req, res, next) => {
  try {
    connection.query(
      'DELETE FROM `users` WHERE `id` = ?',
      [req.body.id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.products_create = async (req, res, next) => {
  try {
    connection.query(
      'INSERT INTO products (id, shop_id, product_name, status, created_by) VALUES (NULL, ?, ?, ?, ?)',
      [req.body.shop_id, req.body.product_name, req.body.status, req.body.created_by],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.products_update = async (req, res, next) => {
  try {
    connection.query(
      `UPDATE products 
      SET product_name = ?, status = ?, shop_id = ?
      WHERE id = ?`,
      [req.body.product_name, req.body.status, req.body.shop_id, req.body.id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {

    return res.status(500).json({ error: err.message });
  }
};

ShopController.staff_create = async (req, res, next) => {
  try {
    connection.query(
      `INSERT INTO staff (id, shop_id, staff_name, staff_wages, tell, status, create_by, birthday, address) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.shop_id, req.body.staff_name, req.body.staff_wages, req.body.tell, req.body.status, req.body.create_by, req.body.birthday, req.body.address],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.staff_update = async (req, res, next) => {
  try {
    connection.query(
      `UPDATE staff 
      SET staff_name = ?, staff_wages = ?, tell = ?, status = ?
      WHERE id = ? AND shop_id = ?`,
      [req.body.staff_name, req.body.staff_wages, req.body.tell, req.body.status, req.body.id, req.body.shop_id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.staff_get = async (req, res, next) => {
  try {
    connection.query(
      `SELECT st.*, sh.shop_name, sa.status_name, sa.status_code 
      FROM staff st
      JOIN status_web sa ON sa.id = st.status
      JOIN shops sh ON sh.id = st.shop_id
      WHERE st.shop_id = ?`,
      [req.body.shop_id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.message_menu_create = async (req, res, next) => {
  try {
    connection.query(
      `INSERT INTO message_menu (id, shop_id, message_name, message_price, message_staff, message_shop, create_by,message_time_hour, message_time_minute, status) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.shop_id, req.body.message_name, req.body.message_price, req.body.message_staff, req.body.message_shop, req.body.create_by, req.body.message_time_hour, req.body.message_time_minute, req.body.status],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.message_menu_update = async (req, res, next) => {
  try {
    connection.query(
      `UPDATE message_menu 
      SET  message_name = ?, message_price = ?, message_staff = ?, message_shop = ?, message_time_hour = ?, message_time_minute = ?, status = ?
      WHERE id = ? AND shop_id = ?`,
      [req.body.message_name, req.body.message_price, req.body.message_staff, req.body.message_shop, req.body.message_time_hour, req.body.message_time_minute, req.body.status, req.body.id, req.body.shop_id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.message_menu_get = async (req, res, next) => {
  try {
    connection.query(
      `SELECT mu.*, sh.shop_name, sa.status_name, sa.status_code 
      FROM message_menu mu
      JOIN status_web sa ON sa.id = mu.status
      JOIN shops sh ON sh.id = mu.shop_id
      WHERE mu.shop_id = ?`,
      [req.body.shop_id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.showfields = async (req, res, next) => {
  try {
    connection.query(
      `SELECT * FROM ${req.body.table_name}`,
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }


        console.log(fields);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.packages_create = async (req, res, next) => {
  try {
    connection.query(
      `INSERT INTO packages (id, shop_id, package_name, package_price, commission_member, commission_staff, status, create_by ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.shop_id, req.body.package_name, req.body.package_price, req.body.commission_member, req.body.commission_staff, req.body.status, req.body.create_by],
      function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.packages_update = async (req, res, next) => {
  console.log("req", req.body);
  
  try {
    const updates = []; // สร้างอาเรย์สำหรับเก็บข้อมูลที่จะอัปเดต
    const params = []; // สร้างอาเรย์สำหรับเก็บพารามิเตอร์ที่จะส่งไปยัง query

    // // ตรวจสอบแต่ละฟิลด์ว่าถูกส่งมาหรือไม่
    if (req.body.package_name) {
      updates.push('package_name = ?');
      params.push(req.body.package_name);
    }
    console.log("updates", updates);
    console.log("params", params);
    
    if (req.body.package_price) {
      updates.push('package_price = ?');
      params.push(req.body.package_price);
    }
    if (req.body.commission_member) {
      updates.push('commission_member = ?');
      params.push(req.body.commission_member);
    }
    if (req.body.commission_staff) {
      updates.push('commission_staff = ?');
      params.push(req.body.commission_staff);
    }
    if (req.body.status) {
      updates.push('status = ?');
      params.push(req.body.status);
    }

    // ต้องมีการส่ง id และ shop_id
    if (!req.body.id || !req.body.shop_id) {
      return res.status(400).json({ error: 'Missing required fields: id or shop_id' });
    }
    
    // เพิ่ม id และ shop_id เข้าไปยังพารามิเตอร์
    params.push(req.body.id);
    params.push(req.body.shop_id);

    // ตรวจสอบว่ามีการอัปเดตหรือไม่
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    console.log("params",params);
    
    // สร้าง string สำหรับ SET
    const sql = `UPDATE packages SET ${updates.join(', ')} WHERE id = ? AND shop_id = ?`;

    connection.query(sql, params, function (err, results) {
      if (err) {
        console.log("err", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: 200, message: 'Package updated successfully', results });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


ShopController.packages_info = async (req, res, next) => {
  try {
    connection.query(
      'SELECT * FROM `packages` WHERE `id` = ? AND shop_id = ? AND status = ?',
      [req.body.id, req.body.shop_id, req.body.status],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {   
          res.json({ status: 200, data: results[0] });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.packages_get = async (req, res, next) => {
  try {
    connection.query(
      'SELECT * FROM `packages` WHERE shop_id = ?',
      [req.body.shop_id],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

function get_packages(shop_id, package_id) {
  // คืนค่า Promise จากฟังก์ชันนี้
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `SELECT commission_staff FROM packages 
        WHERE shop_id = ?  AND status = 1 AND id = ? ORDER BY id DESC Limit 1`,
        [shop_id, package_id],
        function (err, results, fields) {
          if (err) {
            return reject(err); // คืนค่า Promise ที่ผิดพลาด
          }
          resolve(results[0].commission_staff); // คืนค่า Promise ที่สำเร็จ
        }
      );
    } catch (err) {
      reject(err); // คืนค่า Promise ที่ผิดพลาดจากการจับข้อผิดพลาดใน try/catch
    }
  });
}

ShopController.members_create = async (req, res, next) => {
  try {
    const staff_id_com = req.body.staff_id;
    var commission_staff = await get_packages(req.body.shop_id, req.body.package_id)
    const year = new Date().getFullYear().toString().slice(-2); // รับเฉพาะเลขสองหลักของปี
    connection.query(
      `SELECT member_no FROM members WHERE member_no LIKE ? ORDER BY member_no DESC LIMIT 1`,
      [`${year}-%`],
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }
        let newSequence;
        if (results.length > 0) {
          const lastMemberNo = results[0].member_no;
          const lastSequence = parseInt(lastMemberNo.split('-')[1]);
          newSequence = (lastSequence + 1).toString().padStart(4, '0');
        } else {
          newSequence = '0001';
        }
        const newMemberNo = `${year}-${newSequence}`;
        let members_id = 0;
        if (newMemberNo) {
          connection.query(
            `INSERT INTO members (id, shop_id, status, create_by, member_name, member_no, package_id, member_phone, member_old_price, six, note ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.body.shop_id, req.body.status, req.body.create_by, req.body.member_name, newMemberNo, req.body.package_id, req.body.member_phone, req.body.member_old_price, req.body.six, req.body.note],
            async function (err, results) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              // สร้างการตอบกลับสำหรับสมาชิกที่สร้าง
              const response = { member: results };
              members_id = results.insertId;

              if (staff_id_com) {
                commission_staff_cal = commission_staff / staff_id_com.length;
                // ใช้ Promise.all เพื่อรอการ insert ทั้งหมดเสร็จสิ้น
                const promises = staff_id_com.map(async (item) => {
                  return new Promise((resolve, reject) => {
                    connection.query(
                      `INSERT INTO member_staff_com (id, staff_id, memner_id, commission_staff) VALUES (NULL, ?, ?, ?)`,
                      [item.id, members_id, commission_staff_cal],
                      function (err, results) {
                        if (err) {
                          return reject(err);
                        }
                        resolve(results);
                      }
                    );
                  });
                });

                // รอให้ Promise ทั้งหมดเสร็จสิ้น
                await Promise.all(promises).catch(err => {
                  return res.status(500).json({ error: err.message });
                });
              }

              // ส่งการตอบกลับไปยัง client
              return res.json(response);
            }
          );
        }
      }
    );

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.members_update = async (req, res, next) => {
  try {
    const staff_id_com = req.body.staff_id;
    const members_id = req.body.members_id;
    var commission_staff = await get_packages(req.body.shop_id, req.body.package_id)
    connection.query(
      `UPDATE members 
      SET  status = ?, member_name = ?, package_id = ?, member_phone = ?, member_old_price = ?, six = ?, note = ?
      WHERE id = ? AND shop_id = ?`,
      [req.body.status, req.body.member_name, req.body.package_id, req.body.member_phone, req.body.member_old_price, req.body.six, req.body.note, req.body.id, req.body.shop_id],
      async function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        await get_packages(req.body.shop_id, req.body.package_id)
        connection.query(
          `DELETE FROM member_staff_com WHERE memner_id = ?`,
          [members_id],
          function (err, results) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
          }
        );

        if (staff_id_com) {
          commission_staff_cal = commission_staff / staff_id_com.length;
          // ใช้ Promise.all เพื่อรอการ insert ทั้งหมดเสร็จสิ้น
          const promises = staff_id_com.map(async (item) => {
            return new Promise((resolve, reject) => {
              connection.query(
                `INSERT INTO member_staff_com (id, staff_id, memner_id, commission_staff) VALUES (NULL, ?, ?, ?)`,
                [item.id, members_id, commission_staff_cal],
                function (err, results) {
                  if (err) {
                    return reject(err);
                  }
                  resolve(results);
                }
              );
            });
          });

          // รอให้ Promise ทั้งหมดเสร็จสิ้น
          await Promise.all(promises).catch(err => {
            return res.status(500).json({ error: err.message });
          });
          res.json({ status: 200, message: "Update success!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.members_info = async (req, res, next) => {
  try {
    connection.query(
      `SELECT * FROM members WHERE shop_id = ? AND status = ? 
      AND (member_no = ? OR member_phone = ? ) 
      LIMIT 1`,
      [
        req.body.shop_id,
        req.body.status,
        req.body.keyword, // member_no
        req.body.keyword // member_phone
      ],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }
        if (results.length !== 0) {

          
          res.json({ status: 200, data: results[0] });
        } else {
          res.json({ status: 404, message: "Data not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.members_get = async (req, res, next) => {
  try {
    connection.query(
      `SELECT * FROM members`,
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "Data not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.payment_type_get = async (req, res, next) => {
  try {
    connection.query(
      'SELECT * FROM `payment_type` WHERE status = 1',
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }
        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.staff_checkin_get = async (req, res, next) => {
  try {
    connection.query(
      `SELECT sc.id,  sc.staff_id, sc.wage, s.staff_name, sc.create_at, sc.check_out FROM staff_check_in as sc
      JOIN staff s ON s.id = sc.staff_id
      WHERE s.shop_id = ? AND s.status = 1`,
      [req.body.shop_id, req.body.status],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "User not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.job_massages_create = async (req, res, next) => {
  try {
    connection.query(
      `INSERT INTO job_massages (
      id, shop_id, menu_id, staff_id, prict_shop, price_staff, prict_income, time_start, time_end, payment_type, status_massage, status, create_by, checkin_id) VALUES 
       (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.body.shop_id, req.body.menu_id, req.body.staff_id, req.body.prict_shop, req.body.price_staff, req.body.prict_income, req.body.time_start, req.body.time_end, req.body.payment_type, req.body.status_massage, req.body.status, req.body.create_by, req.body.checkin_id],
      async function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // ส่งการตอบกลับไปยัง client
        res.json({ status: 200, data: results });
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.job_massages_update = async (req, res, next) => {
  try {
    const staff_id = req.body.staff_id;
    const time_start = req.body.time_start;
    const time_end = req.body.time_end;
    const job_id = req.body.job_id;
    const shop_id = req.body.shop_id;
    const update_by = req.body.update_by;
    
    connection.query(
      `UPDATE job_massages 
      SET  time_start = ?, time_end = ?, staff_id = ?, update_by = ?, checkin_id = ?
      WHERE id = ? AND shop_id = ?`,
      [time_start, time_end, staff_id, update_by, staff_id, job_id, shop_id],
      async function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ status: 200, message: "Update success!" });
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.job_massages_get_timeline = async (req, res, next) => {
  try {
    connection.query(
      `SELECT 
      x.checkin_id AS resourceId, 
      x.time_start AS start,
      x.time_end AS end,
      mm.message_time_hour as title_type,
      mm.message_name AS title, 
      mm.message_price AS price, 
      pt.payment_name as label1, 
      sa.status_name as label2, 
      x.id AS idJob, 
      sa.status_cs as cassColer 
      FROM job_massages x 
      JOIN message_menu mm ON x.menu_id = mm.id 
      JOIN payment_type pt ON pt.id = x.payment_type
      JOIN status_web sa ON sa.id = x.status_massage 
      WHERE x.shop_id = ?
      AND x.status = ?
      AND DATE(x.create_at) = DATE(NOW())
      `,
      [req.body.shop_id, req.body.status],
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "Data not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.job_massages_info = async (req, res, next) => {
  try {
    connection.query(
      `SELECT * FROM members`,
      function (err, results) {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }

        if (results.length !== 0) {
          res.json({ status: 200, data: results });
        } else {
          res.json({ status: 404, message: "Data not found!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

ShopController.job_massages_billing = async (req, res, next) => {
  try {
    const job_id = req.body.job_id;
    const shop_id = req.body.shop_id;
    const payment_type = req.body.payment_type;
    const prict_income = req.body.prict_income;
    const member_code = req.body.member_code;
    const update_by = req.body.update_by;  
    const member_id = req.body.member_id;  
    const price_shop = req.body.price_shop;
    
    const member_price_total = req.body.member_price_total;

    connection.query(
      `UPDATE job_massages m 
      JOIN message_menu mu ON mu.id = m.menu_id
      JOIN members mb ON mb.id = m.member_id
      SET m.update_by = ?, m.payment_type = ?, m.prict_income = ?, 
      m.member_code = ?, m.status_bill = 7,
      m.price_staff = mu.message_staff,
      m.prict_shop = mu.message_shop,
      mb.member_price = (mb.member_price - mu.message_price),
      m.member_id = ?
      WHERE m.id = ? AND m.shop_id = ?`,
      [update_by, payment_type, prict_income, member_code, member_id, job_id, shop_id],
      async function (err, results) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        if (results.affectedRows > 0 && member_id!='') {
          console.log("OK--");
          
          connection.query(
            `INSERT INTO member_transitions
            (id, jos_id, member_id, shop_id, price, balance, create_by)
            VALUES(NULL, ?, ?, ?, ?, ?, ?)`,
            [job_id, member_id, shop_id, price_shop, member_price_total, update_by],
            function (err, insertResults) {
              if (err) {
                return res.status(500).json({ status: 500, message: err.message });
              }

              if (insertResults.affectedRows > 0) {
                return res.json({ status: 200, data: insertResults });
              } else {
                return res.json({ status: 404, message: "Data not found!" });
              }
            }
          );
        } else {
          console.log("Nooo----");
          
          return res.json({ status: 200, essage: "yes!" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

ShopController.testgg = async (req, res, next) => {
  const dataToEncrypt = "ID=342";
  const encrypted = encryptData(dataToEncrypt);
  console.log("Encrypted in otherFile.js:", encrypted);

  const decrypted = decryptData(encrypted);
console.log("Decrypted in otherFile.js:", decrypted);

};





//console.log(fields); 
module.exports = ShopController;



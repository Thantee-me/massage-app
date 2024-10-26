const crypto = require('crypto');

// กำหนด key และ iv สำหรับการเข้ารหัสข้อมูล
// const key = crypto.randomBytes(32);  // สร้าง key ขนาด 32 bytes
// const iv = crypto.randomBytes(16);   // สร้าง iv ขนาด 16 bytes

const key = Buffer.from('12388478901234567890245456789012', 'utf8');  // ใช้ key ขนาด 32 bytes
const iv = Buffer.from('1945567590128546', 'utf8');     

// ฟังก์ชันเข้ารหัสข้อมูล
global.encryptData = function(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');  // ส่ง iv และข้อมูลที่เข้ารหัสแล้วกลับไป
};

// ฟังก์ชันถอดรหัสข้อมูล
global.decryptData = function(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');  // ดึง iv ออกจากข้อมูลที่เข้ารหัส
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();  // ส่งข้อมูลที่ถอดรหัสแล้วกลับไป
};

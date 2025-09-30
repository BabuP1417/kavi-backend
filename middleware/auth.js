const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'No token' });
const token = authHeader.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.admin = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};
// server/routes/buyNow.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/api/buy-now", async (req, res) => {
const { product, products, user } = req.body;
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // or any SMTP
      auth: {
        user: "velbab2020@gmail.com",
        pass: "srbenaolxpycwogi", 
      },
    });

     let subject;
    let productHtml = "";

    if (product) {
      // single product
      subject = `New Order: ${product.name}`;
      productHtml = `<p><strong>Product:</strong> ${product.name} - ₹${product.price}</p>
                     <p><strong>Title:</strong> ${product.title}</p>`;
   } else if (products && products.length > 0) {
  // multiple products (cart)
  subject = `New Cart Order: ${products.length} items`;

  let totalCost = 0;

  productHtml = products
    .map((p) => {
      const qty = p.quantity || 1;
      const itemTotal = p.price * qty;
      totalCost += itemTotal;
      return `
        <p><strong>Product:</strong> ${p.name} - ₹${p.price} (Qty: ${qty})</p>
        <p><strong>Title:</strong> ${p.title}</p>
        <p><strong>Subtotal:</strong> ₹${itemTotal}</p>
        <hr/>
      `;
    })
    .join("");

  // Append total cost at the bottom
  productHtml += `<h3>Total Cost: ₹${totalCost}</h3>`;
} else {
      return res.json({ success: false, error: "No products provided" });
    }

    const mailOptions = {
      from: "velbab2020@gmail.com",
      to: "velbab2020@gmail.com",
      subject,
      html: `
        <h3>New Order Details</h3>
        ${productHtml}
        <h4>Customer Info</h4>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>Address:</strong> ${user.address}, ${user.city}, ${user.state}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// In-memory storage for reservations (in production, use a database)
let reservations = [];

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shadsbrian@gmail.com', // Replace with your email
        pass: 'Kipkemoi44' // Your app password
    }
});

// Function to send admin notification
async function sendAdminNotification(reservation) {
    const mailOptions = {
        from: 'shadsbrian@gmail.com',
        to: 'shadsbrian@gmail.com', // Admin email
        subject: 'New Reservation Request - THE SAVANNAH WOODS',
        html: `
            <h2>New Reservation Request</h2>
            <p><strong>Name:</strong> ${reservation.name}</p>
            <p><strong>Email:</strong> ${reservation.email}</p>
            <p><strong>Phone:</strong> ${reservation.phone}</p>
            <p><strong>Date:</strong> ${reservation.date}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Guests:</strong> ${reservation.guests}</p>
            ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
            <p><strong>Submitted At:</strong> ${new Date(reservation.submittedAt).toLocaleString()}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Admin notification sent successfully');
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

// Routes
app.post('/reservations', async (req, res) => {
    try {
        const reservation = {
            id: Date.now().toString(),
            ...req.body
        };

        // Store reservation
        reservations.push(reservation);

        // Save to file (simple persistence)
        fs.writeFileSync('reservations.json', JSON.stringify(reservations, null, 2));

        // Send admin notification
        await sendAdminNotification(reservation);

        res.status(201).json({
            success: true,
            message: 'Reservation submitted successfully',
            reservationId: reservation.id
        });
    } catch (error) {
        console.error('Error processing reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process reservation'
        });
    }
});

app.get('/reservations', (req, res) => {
    res.json(reservations);
});

// Load existing reservations on startup
if (fs.existsSync('reservations.json')) {
    try {
        reservations = JSON.parse(fs.readFileSync('reservations.json', 'utf8'));
    } catch (error) {
        console.error('Error loading reservations:', error);
        reservations = [];
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Reservations are stored locally in reservations.json');
    console.log('Email notifications are enabled - admin will receive emails for new reservations');
});
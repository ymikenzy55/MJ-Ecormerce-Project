const ContactMessage = require('../models/ContactMessage');

// Submit contact message
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};

// Get all contact messages (admin only)
const getMessages = async (req, res) => {
  try {
    const { isRead } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filter = {};
    if (isRead === 'true') {
      filter.isRead = true;
    } else if (isRead === 'false') {
      filter.isRead = false;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Mark message as read (admin only)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
};

module.exports = {
  submitMessage,
  getMessages,
  markAsRead
};

import Kudo from '../models/Kudo.js';

// Send a kudo
export const sendKudo = async (req, res) => {
  try {
    const { sender, recipient, message,  reason, like } = req.body;
    const { badge, badgeicon } = message || {};
    const kudo = new Kudo({ sender, recipient, message, reason, like });
    await kudo.save();

    res.status(201).json({
      success: true,
      message: 'Kudo sent successfully!',
      data: kudo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending kudo.',
      error: error.message,
    });
  }
};

// Get all kudos
export const getAllKudos = async (req, res) => {
  try {
    const kudos = await Kudo.find()
      .populate('recipient', 'name email') 
      .sort({ timestamp: -1 });  
    res.status(200).json({
      success: true,
      data: kudos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching kudos.',
      error: error.message,
    });
  }
};

// Like/Unlike a Kudo
export const likeKudo = async (req, res) => {
  try {
    const { kudoId } = req.params; 
    const { userId, userName } = req.body; 
    // Find the kudo by its ID
    const kudo = await Kudo.findById(kudoId);

    if (!kudo) {
      return res.status(404).json({ message: 'Kudo not found' });
    }

    // Check if the user has already liked the kudo
    const existingLikeIndex = kudo.like.findIndex((like) => like.userId === userId);

    if (existingLikeIndex > -1) {
      // Unlike: Remove the like
      kudo.like.splice(existingLikeIndex, 1);
    } else {
      // Like: Add the like
      kudo.like.push({ userId, userName });
    }
    await kudo.save();

    res.status(200).json({ message: 'Kudo updated successfully', likes: kudo.like });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


// Get kudos analytics
export const getAnalytics = async (req, res) => {
  try {
    const analytics = await Kudo.aggregate([
      {
        $group: {
          _id: '$recipient',
          totalKudos: { $sum: 1 },
          totalLikes: { $sum: { $size: "$like" } }, // Sum up likes
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'recipientDetails',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics.',
      error: error.message,
    });
  }
};

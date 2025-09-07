// Session-based authentication middleware
export const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required. Please log in.' 
    });
  }
  
  // Add user info to request object for easy access
  req.user = {
    id: req.session.userId,
    email: req.session.userEmail,
    name: req.session.userName
  };
  
  next();
};

// Helper function to create session
export const createUserSession = (req, user) => {
  req.session.userId = user.id;
  req.session.userEmail = user.email;
  req.session.userName = user.name;
};

// Helper function to destroy session
export const destroyUserSession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

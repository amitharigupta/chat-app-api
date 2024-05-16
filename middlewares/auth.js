import jwtUtils from "../utils/jwt-utils.js";


const isAuthenticated = async (req, res, next) => {
  try {
    // Check if user is authenticated based on cookies, session, or tokens
    console.log('isAuthenticated middleware invoked');

    // Placeholder code for authentication
    if (req.cookies && req.cookies.authToken) {
      let token = req.cookies.authToken;
      // Perform authentication logic here
      console.log('Authentication successful');

      let decoded = await jwtUtils.verifyToken(token);
      console.log(decoded);

      req.user = decoded.id;
      next(); // Proceed to the next middleware or route handler
    } else {
      // If authentication fails, respond with an error
      res.status(401).json({ status: false, message: 'Unauthorized Access' });
    }
  } catch (error) {
    // Handle specific errors and provide meaningful error messages
    console.log(`Error while authenticating token: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export default isAuthenticated

# React & Node.js Skill Test

## Estimated Time

- 60 min

## Requirements

- Bug fix to login without any issues (20min) <br/>
  There is no need to change or add login function.
  Interpret the code structure and set the correct environment by the experience of building projects. <br/>
  Here is a login information. <br/>
  ✓ email: admin@gmail.com  ✓ password: admin123

- Implement Restful API of "Meeting" in the both of server and client sides (40min)<br/>
  Focus Code Style and Code Optimization. <br/>
  Reference other functions.

## Notes about needs to be fixed vournabilites

There is a vournability issue in storing user and token. Local storage is not safe for storing tokens or user data:
- it is vulnerable to XSS Attacks, Cross-Site Scripting (XSS) attacks.
- Data in local storage is stored in plain text. If someone gains access to the user's device, they can read the data directly.
- Data in local storage does not expire automatically. If a token is compromised, it can be used indefinitely unless explicitly cleared.
- While local storage is isolated by origin, any script running on the same origin can access it. This includes third-party libraries or compromised dependencies.

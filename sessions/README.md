# Installation

npm install --save express@4.16.2 pug@2.0.0-rc.4 body-parser@1.18.2 multer@1.3.0 sqlite3@3.1.13 cookie-parser@1.4.3 express-session@1.15.6
npm install nodemon

# Execution

run: `nodemon index.js`
goto: http://localhost:3000/sessionxss/login

# Example

Check for session fixation
Login with: `admin` `istrator`

enter

`<script>document.cookie='connect.sid=12345;path=/'</script>`

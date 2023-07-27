# SimpleLoginTemplate
This template is based on Tutorial on YT
(https://www.youtube.com/watch?v=-RCnNyD0L-s)

There is some problem waiting to be solved maybe because of the version for each package inside(The tutorial is 4 years ago)

Briefly Introduce the function of different packages:
1. Express : backend framework
2. ejs : kind of writing html
3. nodemon, dotenv : convenient developement environment and variable setting tool
4. bcrypt : hashing tool for password
5. passport, passport-local : authentication and our strategy?
6. express-session : save the user information and stay signed in
7. express-flash : error message package when authentication goes wrong

Problem:
When I signed in, I can't get my user information by 'req.user.name'

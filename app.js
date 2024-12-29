const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Route for Login Page
app.get('/login', (req, res) => {
    res.send(`
        <form onsubmit="localStorage.setItem('username', this.username.value)" action="/" method="GET">
            <input type="text" name="username" placeholder="Enter your username" required>
            <button type="submit">Login</button>
        </form>
    `);
});


app.get('/', (req, res) => {

    fs.readFile('messages.json', (err, content) => {
        const messages = content ? JSON.parse(content) : [];


        const messageList = messages
            .map(msg => `<li><b>${msg.username}:</b> ${msg.message}</li>`)
            .join('');

        res.send(`
            <ul>${messageList}</ul>
            <form action="/send-message" method="POST">
                <input type="text" name="message" placeholder="Enter your message" required>
                <input type="hidden" name="username" id="username">
                <button type="submit">Send</button>
            </form>
            <script>
                document.getElementById('username').value = localStorage.getItem('username');
            </script>
        `);
    });
});


app.post('/send-message', (req, res) => {
    const { username, message } = req.body;


    fs.readFile('messages.json', (err, content) => {
        const messages = content ? JSON.parse(content) : [];


        messages.push({ username, message });


        fs.writeFile('messages.json', JSON.stringify(messages), err => {
            if (err) console.error(err);


            res.redirect('/');
        });
    });
});

app.listen(3000);



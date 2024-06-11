const express = require('express');
const secretsRouter = express.Router();

secretsRouter.route('/')
    .get((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(
            `<html>
                <body>
                    <div>
                        <div>Connection Status: ${res.statusCode}</div>
                        <div>You are now Connected</div>
                        <div>James Bond</div>
                    </div>
                </body>
            </html>`
        )
    })

module.exports = secretsRouter;

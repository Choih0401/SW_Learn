import express from 'express'
import next from 'next'
import cors from 'cors'
import morgan from 'morgan'

import v1 from './routes/v1/v1'

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({dev})
//const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    
    server.set('port', process.env.PORT || 5000)

    server.use(morgan('dev'));
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }));
    server.use(cors())

    server.use('/v1', v1)

    server.get('*', (req, res) => {
        res.sendStatus(404)
    })

    server.listen(server.get('port'), () => {
        console.log('Express server listening on port ' + server.get('port'))
    })
})
.catch(ex => {
    console.error(ex.stack)
    process.exit(1)
})
import express from 'express'
import next from 'next'
import cors from 'cors'
import morgan from 'morgan'
import expressSession from 'express-session'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
//import redisStore from 'connect-redis' Redis session 추후 추가 예정

import v1 from './routes/v1/v1'

const dev = process.env.NODE_ENV !== 'production'; // production setting
const prod = process.env.NODE_ENV === 'production';

const app = next({dev})
const handle = app.getRequestHandler()

const swaggerDefinition = { // swagger main definition
    info: {
        title: 'Auth Service',
        version: '0.1',
        description: 'Auth API'
    },
    host: 'localhost:5000',
    basePath: '/'
};

const options = { // swagger option
    swaggerDefinition,
    apis: ['./routes/v1/api.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.prepare().then(() => {
    const server = express()
    
    server.set('port', process.env.PORT || 5000)

    server.use(morgan('dev')); // 로그 찍어주는 모듈 (dev) 사용
    server.use(express.json()) // json 사용
    server.use(express.urlencoded({ extended: true }));
    server.use(cors()) // cors 세팅
    server.use(
        expressSession({ // 세션 세팅
            resave: false,
            saveUninitialized: false,
            secret: process.env.COOKIE_SECRET,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 10, // 60000ms
            }
        })
    )

    server.use('/v1', v1) // /v1으로 라우팅

    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // /api-docs로 들어가면 swagger-api로 라우팅 

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
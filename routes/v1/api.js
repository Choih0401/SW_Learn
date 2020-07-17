import crypto from 'crypto'
import async from 'async'

var mysql_dbc = require('../../db/db_con')()
var connection = mysql_dbc.init()

require('dotenv').config({silent: true})

export const signUp = ((req, res) => {
    var {
        id,
        name,
        password1,
        password2
    } = req.body
    if (!id || !name || !password1 || !password2) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        if (id > 50)
            id = id.slice(0, 50)
        if (name > 50)
            name = name.slice(0, 50)
        async.waterfall([
                (callback) => {
                    password1 = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password1).digest('base64')).digest('base64');
                    password2 = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password2).digest('base64')).digest('base64');
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ? OR name = ?'
                    connection.query(sql, [id, name], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else if (password1 == password2) {
                            if (result[0].count > 0) {
                                callback({
                                    err: 'ERR_SIGNUP',
                                    message: 'USER_ID OR NAME ALREADY EXISTS'
                                })
                            } else {
                                callback(null, '')
                            }
                        } else {
                            callback({
                                err: 'ERR_SIGNUP',
                                message: 'PASSWORD NOT MATCHED'
                            })
                        }
                    })
                },
                (resultData, callback) => {
                    var sql = 'INSERT INTO user_list (id, name, password) values(?, ?, ?)'
                    connection.query(sql, [id, name, password1], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            callback(null, '')
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_SIGNUP',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Sign up successful!'
                    })
                }
            })
    }
})

export const signIn = ((req, res) => {
    var {
        id,
        password
    } = req.body
    if (!id || !password) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        if (id > 50)
            id = id.slice(0, 50)
        async.waterfall([
                (callback) => {
                    password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('base64')).digest('base64');
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ? AND password = ?'
                    connection.query(sql, [id, password], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            if (result[0].count == 0) {
                                callback({
                                    err: 'ERR_SIGNIN',
                                    message: 'INVALID PASSWORD OR ID'
                                })
                            } else {
                                callback(null, '')
                            }
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_SIGNIN',
                        detail: err
                    })
                } else {
                    req.session.user = {
                        id: id
                    }
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Sign in successful!'
                    })
                }
            })
    }
})

const mysql = require('mysql2')
const { sqlHost, sqlUser, sqlPass, sqlPort, sqlDatabase } = require('./config.json')


class SqlHandler {

    static conn = mysql.createConnection({
        host: sqlHost,
        port: sqlPort,
        user: sqlUser,
        password: sqlPass,
        database: sqlDatabase,
    })

    static init() {
        SqlHandler.conn.connect( (err) => {
            if (err) throw err;
            console.log("Connected to mysql database!");
        })
    }

    static sendSQL(sql, params) {

        return new Promise((resolve, reject) => {
            this.conn.execute(sql, params, (err, res) => {
                if (err) reject(err);
                resolve(res)
            })
        })

    }

}


module.exports = SqlHandler
let express = require('express')
let cors = require('cors')
let app = express()
let port = 3002
const { v4: uuidv4 } = require('uuid')

let sheetHelper = require('./sheet')
let MoralisHelper = require('./MoralisHelper')
const path = __dirname + '/dist/';


app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path));


let timeout = 15000000


app.get('/uploadAssets', async function (req, res) {
    let tempFolder = uuidv4()
    req.setTimeout(timeout);
    try {
        console.log('request received', req.query)
        let sheetId = req.query.sheetId

        sheetHelper.handleSheet(sheetId,tempFolder, async function (data) {
            if (data !== undefined) {
                data.projectId = req.query.projectId

                MoralisHelper.updateProject(data).catch(error=>{
                    console.log(error.stack)
                })

            } 
        })
        res.json({ msg: 'data uploaded'})
    } catch (error) {
        console.log("error server.js")
        res.json({ msg: 'error'})
    }
})


app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
})




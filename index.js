const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const left = require('./lib/left')
const intro = require('./lib/intro')
const msgHandler = require('./msgHndlr')
const options = require('./options')
const fs = require('fs') 

// AUTO UPDATE BY NURUTOMO
// THX FOR NURUTOMO
// Cache handler and check for file change
require('./msgHndlr.js')
nocache('./msgHndlr.js', module => console.log(`'${module}' Updated!`))

const adminNumber = JSON.parse(fs.readFileSync('./lib/admin.json'))
const setting = JSON.parse(fs.readFileSync('./lib/setting.json'))
const isWhite = (chatId) => adminNumber.includes(chatId) ? true : false

let { 
    limitCount,
    memberLimit, 
    groupLimit,
    banChats,
    prefix,
    restartState: isRestart,
    mtc: mtcState
    } = setting

function restartAwal(client){
    setting.restartState = false
    isRestart = false
    client.sendText(setting.restartId, 'Restart Succesfull!')
    setting.restartId = 'undefined'
    //fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
}


const start = async (client = new Client()) => {
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((async (message) => {
            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 1000) {
                    client.cutMsgCache()
                }
            })
            msgHandler(client, message)
        }))

        client.onGlobalParticipantsChanged((async (heuh) => {
            await welcome(client, heuh)
            intro(client, heuh)
            left(client, heuh)
            }))

        
        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 257) { 
            	client.sendText(chat.id, `Halo warga ${name} mohon maaf, jika mau menginvite bot, silahkan membeli akses premium bot melalui wa.me//6281289096745`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                client.sendText(chat.groupMetadata.id, `Hello group members *${name}*, thank you for inviting this bot, to see the bot menu send *#menu*`)
            }
        }))

        /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/

    // ketika bot diinvite ke dalam group
    client.onAddedToGroup(async (chat) => {
    const groups = await client.getAllGroups()
    // kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
    if (groups.length > groupLimit) {
    await client.sendText(chat.id, `Sorry, bot tidak bisa join di grub untuk menginvite bot silahkan hubungi owner bot https://wa.me/6281289096745 max group: ${groupLimit}`).then(() => {
          client.leaveGroup(chat.id)
          client.deleteChat(chat.id)
      }) 
    } else {
    // kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
        if (chat.groupMetadata.participants.length < memberLimit) {
        await client.sendText(chat.id, `Sorry, BOT comes out if the group members do not exceed ${memberLimit} people`).then(() => {
          client.leaveGroup(chat.id)
          client.deleteChat(chat.id)
        })
        } else {
        await client.simulateTyping(chat.id, true).then(async () => {
          await client.sendText(chat.id, `Hai minna~, Im RIDHO BOT. To find out the commands on this bot type #menu`)
        })
        }
    }
    })

        // listening on Incoming Call
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!.\nbila ingin di unblock kamu harus berdonasi dan hubungi whatsapp owner: wa.me/6281289096745')
            .then(() => client.contactBlock(call.peerJid))
        }))
    }

    function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
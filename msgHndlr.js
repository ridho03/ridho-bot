const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const os = require('os')
const { BikinTikel } = require('./lib/tikel_makel')
const urlShortener = require('./lib/shortener')
const get = require('got')
const speed = require('performance-now')
const color = require('./lib/color')
const fetch = require('node-fetch')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const google = require('google-it')
const tiktok = require('tiktok-scraper')
const { getStickerMaker } = require('./lib/ttp')
const translatte = require('translatte')
const { wallpaper } = require('./wallpaper');
const getZodiak = require('./zodiak');
const { downloader, liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss, msgFilter, processTime, nulis } = require('./lib/functions')
const { help, BotName, diamond, iklan, peraturan, preminfo, privat, rdp, jasa, freemusic, cmd, snk, info, akun, donasi, readme } = require('./lib/help')
const { stdout } = require('process')
const { uploadImages, custom, fetchBase64, getBase64 } = require('./lib/fetcher')
const quotedd = require('./settings/quote.json')
const nsfw_ = JSON.parse(fs.readFileSync('./settings/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./settings/welcome.json'))
const intr = JSON.parse(fs.readFileSync('./settings/intro.json'))
const setting = JSON.parse(fs.readFileSync('./settings/config.json'))
const limit = JSON.parse(fs.readFileSync('./lib/limit.json'));
const msgLimit = JSON.parse(fs.readFileSync('./lib/msgLimit.json'));
const left = JSON.parse(fs.readFileSync('./settings/left.json')) 
const banned = JSON.parse(fs.readFileSync('./lib/banned.json'))
const muted = JSON.parse(fs.readFileSync('./lib/muted.json'))
const premiumNumber = JSON.parse(fs.readFileSync('./settings/premium.json'))
let antilink = JSON.parse(fs.readFileSync('./settings/antilink.json'))
let antibadword = JSON.parse(fs.readFileSync('./settings/antibadword.json'))
const afk = JSON.parse(fs.readFileSync('./lib/afk.json'))
const daftar = JSON.parse(fs.readFileSync('./lib/daftar.json'))
const { ind, eng } = require('./lib/text')
const bent = require('bent')
var request = require('request');
const rugaapi = require('./lib/rugaapi')
const resep = require('./lib/resep')
const images = require('./lib/images')
const shortlink = require('./lib/shortener')
const ubah = "```"

const {
    toxic,
    quotes,
    quotes2,
    quotes3,
    hilih,
    alay,
    ninja,
    pantunpakboy,

} = require('./lib/tools')
let { 
    limitCount,
    memberLimit, 
    groupLimit,
    banChats,
    prefix,
    restartState: isRestart,
    mtc: mtcState
    } = setting

let state = {
    status: () => {
        if(banChats){
            return 'Nonaktif'
        }else if(mtcState){
            return 'Nonaktif'
        }else if(!mtcState){
            return 'Aktif'
        }else{
            return 'Aktif'
        }
    }
}

moment.tz.setDefault('Asia/Jakarta').locale('id')
module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, author, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const isCmd = command.startsWith(prefix)
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
                const isMuted = (chatId) => {
            if(muted.includes(chatId)){
                return false
            }else{
                return true
            }
        }

        const addAfkUser = (userId, time, reason) => {
            const obj = {id: `${userId}`, time: `${time}`, reason: `${reason}`}
            afk.push(obj)
            fs.writeFileSync('./lib/afk.json', JSON.stringify(afk))
        }

        const checkAfkUser = (userId) => {
            let status = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    status = true
                }
            })
            return status
        }

        const getAfkReason = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].reason
            }
        }

        const getAfkTime = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].time
            }
        }

        const getAfkId = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            if (position !== false) {
                return afk[position].id
            }
        }

        const getAfkPosition = (userId) => {
            let position = false
            Object.keys(afk).forEach((i) => {
                if (afk[i].id === userId) {
                    position = i
                }
            })
            return position
        }

        function restartAwal(client){
            setting.restartState = false
            isRestart = false
            client.sendText(setting.restartId, 'Restart Succesfull!')
            setting.restartId = 'undefined'
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null,2));
        }


       
        function banChat () {
            if(banChats == true) {
            return false
        }else{
            return true
            }
        }

        // AFK
        if (isGroupMsg) {
            for (let ment of mentionedJidList) {
                if (checkAfkUser(ment)) {
                    const getId = getAfkId(ment)
                    const getReason = getAfkReason(getId)
                    const getTime = getAfkTime(getId)
                    await client.reply(from, ind.afkMentioned(getReason, getTime), id)
                }
            }
            if (checkAfkUser(sender.id) && !isCmd) {
                afk.splice(getAfkPosition(sender.id), 1)
                fs.writeFileSync('./lib/afk.json', JSON.stringify(afk))
                await client.sendText(from, ind.afkDone(pushname))
            }
        }
                // END HELPER FUNCTION


        //BEGIN HELPER


        if (typeof Array.prototype.splice === 'undefined') {
            Array.prototype.splice = function (index, howmany, elemes) {
                howmany = typeof howmany === 'undefined' || this.length;
                var elems = Array.prototype.slice.call(arguments, 2), newArr = this.slice(0, index), last = this.slice(index + howmany);
                newArr = newArr.concat.apply(newArr, elems);
                newArr = newArr.concat.apply(newArr, last);
                return newArr;
            }
        }

        function isMsgLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            for (let i of addmsg){
                if(i.id === id){
                    if (i.msg >= 12) {
                        found === true 
                        console.log(i)
                        client.reply(from, '*[ANTI-SPAM]*\nMaaf, akun anda kami blok karena SPAM, dan tidak bisa di UNBLOK!', id)
                        client.contactBlock(id)
                        banned.push(id)
                        fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                        return true;
                    }else if(i.msg >= 7){
                        found === true
                        client.reply(from, '*[ANTI-SPAM]*\nNomor anda terdeteksi spam!\nMohon tidak spam 5 pesan lagi atau nomor anda AUTO BLOK!', id)
                        return true
                    }else{
                        found === true
                        return false;
                    }   
                }
            }
            if (found === false){
                let obj = {id: `${id}`, msg:1};
                addmsg.push(obj);
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                return false;
            }  
        }

        function addMsgLimit(id){
            if (isSadmin) {return;}
            var found = false
            const addmsg = JSON.parse(fs.readFileSync('./lib/msgLimit.json'))
            Object.keys(addmsg).forEach((i) => {
                if(addmsg[i].id == id){
                    found = i
                    console.log(addmsg[0])
                }
            })
            if (found !== false) {
                addmsg[found].msg += 1;
                fs.writeFileSync('./lib/msgLimit.json',JSON.stringify(addmsg));
                console.log(addmsg[0])
            }
        }

        function isLimit(id){
            if (isSadmin) {return false;}
            let found = false;
            for (let i of limit){
                if(i.id === id){
                    let limits = i.limit;
                    if (limits >= limitCount) {
                        found = true;
                        console.log(`Limit Abis : ${serial}`)
                        return true;
                    }else{
                        limit
                        found = true;
                        return false;
                    }
                    }
            }
            if (found === false){
                let obj = {id: `${id}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                return false;
            }  
        }

        function limitAdd (id) {
            if (isSadmin) {return;}
            var found = false;
            const limidat = JSON.parse(fs.readFileSync('./lib/limit.json'))
            Object.keys(limidat).forEach((i) => {
                if(limidat[i].id == id){
                    found = i
                    console.log(limidat[i])
                }
            })
            if (found !== false) {
                limidat[found].limit += 1;
                console.log(limidat[found])
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limidat));
            }
        }
        
        const msgs = (message) => {
            if (command.startsWith('#')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const isWhite = (chatId) => premiumNumber.includes(chatId) ? true : false
        const isWhiteList = (chatId) => {
            if(premiumNumber.includes(sender.id)){
                if(muted.includes(chatId)) return false
                return true
            }else{
                return false
            }
        }

        const apakah = [
            'Ya',
            'Tidak',
            'Coba Ulangi'
            ]

        const bisakah = [
            'Bisa',
            'Tidak Bisa',
            'Coba Ulangi'
            ]

        const kapankah = [
            '1 Minggu lagi',
            '1 Bulan lagi',
            '1 Tahun lagi'
            ]

        const rate = [
            '100%',
            '90%',
            '80%',
            '70%',
            '60%',
            '50%',
            '40%',
            '30%',
            '20%',
            '10%'
            ]

        const mess = {
            wait: 'Proses bor tunggu aja sabar ^_^',
            error: {
                St: '[❗] Kirim gambar dengan caption *#sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan Admin group!',
                Sp: '[❗] Bot tidak bisa mengeluarkan Admin',
                Ow: '[❗] Bot tidak bisa mengeluarkan Owner',
                Bk: '[❗] Bot tidak bisa memblockir Owner',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }

        
        // PROTECT
        const isDetectorLink = antilink.includes(chatId)
        const isDetectorBadword = antibadword.includes(chatId)

        const puppeteer = require('puppeteer')
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const isAfkOn = checkAfkUser(sender.id)
        const serial = sender.id
        const isSadmin = serial
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        
        const isdaftar = daftar.includes(sender.id)
        const adminNumber = ['6281289096745@c.us']
        const isAdmin = adminNumber.includes(sender.id)
        const ownerNumber = '6281289096745@c.us'
        const isOwner = ownerNumber.includes(sender.id)
        const isPrem = premiumNumber.includes(sender.id)
        const isBanned = banned.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        /* const isSimi = isGroupMsg ? simi_.includes(chat.id) : false */
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        

        const vhtearkey = 'ridho2k99KKYli' // https://api.vhtear.com
        //const barbarkey = 'xXvQeSgB0iWpJbri4TyU' // https://mhankbarbar.herokuapp.com/api

        const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

                // END HELPER FUNCTION
                if(body === '#mute' && isMuted(chatId) == true){
                    if(isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }
                }

                if(body === '#unmute' && isMuted(chatId) == false){
                    if(isGroupMsg) {
                        if (!isGroupAdmins) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin grup!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)         
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)                   
                    }
                }
                if(body === '#banchat enable' && banChats == true){
                    if(isGroupMsg) {
                        if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner bot', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        if(setting.banChats === true) return
                        setting.banChats = true
                        banChats = true
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                       client.reply(from,'Global chat has been enable!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        if(setting.banChats === false) return
                        setting.banChats = true
                        banChats = true
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }
                }
                if(body === '#banchat disable' && banChats == false){
                    if(isGroupMsg) {
                        if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        setting.banChats = false
                        banChats = false
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        setting.banChats = false
                        banChats = false
                        fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2))
                        client.reply(from, 'Global chat has been disable!', id)
                    }
                }
                if(body === '#mute' && isMuted(chatId) == true){
                    if(isGroupMsg) {
                        if (!isAdmin) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        muted.push(chatId)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di mute pada chat ini! #unmute untuk unmute!', id)
                    }
                }
                if(body === '#unmute' && isMuted(chatId) == false){
                    if(isGroupMsg) {
                        if (!isAdmin) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh admin bot!', id)
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)         
                    }else{
                        if(isMsgLimit(serial)){
                            return
                        }else{
                            addMsgLimit(serial)
                        }
                        let index = muted.indexOf(chatId);
                        muted.splice(index,1)
                        fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null, 2))
                        client.reply(from, 'Bot telah di unmute!', id)                   
                    }
                }

                // END HELPER FUNCTION
                if (isGroupMsg && isDetectorLink && !isGroupAdmins && !isPrem && !isOwner){
                    if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                        const check = await client.inviteInfo(chats);
                        if (!check) {
                            return
                        } else {
                            client.reply(from, `*「 GROUP LINK DETECTOR 」*\nKamu mengirimkan link grup chat, maaf kamu di kick dari grup :(`, id).then(() => {
                                client.removeParticipant(groupId, sender.id)
                            })
                        }
                    }
                }
                // MRHRTZ
                if (isGroupMsg && isDetectorBadword && !isGroupAdmins && !isPrem && !isOwner){
                    if (chats.match("anjing") || chats.match("gblk") || chats.match("tolol") || chats.match("kntl")) {
                        if (!isGroupAdmins) {
                            return client.reply(from, "JAGA UCAPAN DONG!! 😠", id)
                            .then(() => client.removeParticipant(groupId, sender.id))
                            .then(() => {
                                client.sendText(from, `*「 ANTI BADWORD 」*\nKamu mengirimkan link grup chat, maaf kamu di kick dari grup 🙁`)
                            }).catch(() => client.sendText(from, `Untung RIDHO BOT Bukan Admin, Kalo Jadi Admin Udah Aku Kick Tuh! 😑`))
                        } else {
                            return client.reply(from, "Tolong Jaga Ucapan Min 😇", id)
                        }
                    }
                }


        if (isCmd && !isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))}
        if (isCmd && isGroupMsg) {console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))}

        if (isBanned) return
        if (mtcState) return
        if (!banChat()) return
        if (!isMuted(chatId)) return
        if (isBlocked) return
        switch(command) {

        
        case '#unmute':
            console.log(`Unmuted ${name}!`)
            await client.sendSeen(from)
            break

        case 'tes':
            client.reply(from, 'ok', id)
            break
        case '#banchat disable':
            console.log(`Banchat ${name}!`)
            await client.sendSeen(from)
            break

        case '#limit':
            var found = false
            const limidat = JSON.parse(fs.readFileSync('./lib/limit.json'))
            for(let lmt of limidat){
                if(lmt.id === serial){
                    let limitCounts = limitCount-lmt.limit
                    if(limitCounts <= 0) return client.reply(from, `Limit request anda sudah habis\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
                    client.reply(from, `Sisa limit request anda tersisa : *${limitCounts}*\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
                    found = true
                }
            }
            console.log(limit)
            console.log(limidat)
            if (found === false){
                let obj = {id: `${serial}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/limit.json',JSON.stringify(limit, 1));
                client.reply(from, `Sisa limit request anda tersisa : *${limitCount}*\n\n_Note : Limit akan direset setiap jam 21:00!_`, id)
            }
            break

        
        case '#restartlimit':
        case '#restart':
            if (!isOwner) return client.reply(from, `_Hanya Owner Bot Yang Bisa Mereset Limit!_`, id)
            client.reply(from, '⚠️*[INFO]* Reseting ...', id)
            setting.restartState = true
            setting.restartId = chat.id
            fs.writeFileSync('./lib/setting.json', JSON.stringify(setting, null, 2));
            fs.writeFileSync('./lib/limit.json', JSON.stringify(limit));
            //fs.writeFileSync('./lib/muted.json', JSON.stringify(muted, null,2));
            fs.writeFileSync('./lib/msgLimit.json', JSON.stringify(msgLimit));
            //fs.writeFileSync('./lib/banned.json', JSON.stringify(banned));
            await sleep(5000).then(() => client.reply(from, `✅ _Reset limit Completed!_`, id))

            await client.sendSeen(from)
            break

        case '#premium':
        await client.sendContact(from, ownerNumber)
        .then(() => client.sendText(from, 'untuk upgrade ke premium silahkan chat nomor owner! untuk liat info premium ketik #preminfo'))
        break
        case '#upprem':
            if (!isOwner) return client.reply(from, `_Hanya Owner Bot Yang Bisa upgrade premium_`, id)
                for (let i = 0; i < mentionedJidList.length; i++) {
                premiumNumber.push(mentionedJidList[i])
                fs.writeFileSync('./settings/premium.json', JSON.stringify(premiumNumber))
                client.reply(from, 'Succes upgrade target!',id)
            }
            break

        case '#antilink':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            if (!isGroupAdmins) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Admin group!`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Perintah ini hanya bisa di gunakan jika Bot menjadi Admin!`, id)
            if (args[1] == 'enable') {
                var cek = antilink.includes(chatId);
                if(cek){
                    return client.reply(from, `*「 ANTI GROUP LINK 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nJika Ingin Send Link Harap Izin Ke Admin`, id)
                } else {
                    antilink.push(chatId)
                    fs.writeFileSync('./settings/antilink.json', JSON.stringify(antilink))
                    client.reply(from, `*「 ANTI GROUP LINK 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nJika Ingin Send Link Harap Izin Ke Admin`, id)
                }
            } else if (args[1] == 'disable') {
                var cek = antilink.includes(chatId);
                if(!cek){
                    return client.reply(from, `*「 ANTI GROUP LINK 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nJika Ingin Send Link Harap Izin Ke Admin`, id)
                } else {
                    let nixx = antilink.indexOf(chatId)
                    antilink.splice(nixx, 1)
                    fs.writeFileSync('./settings/antilink.json', JSON.stringify(antilink))
                    client.reply(from, `*「 ANTI GROUP LINK 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nJika Ingin Send Link Harap Izin Ke Admin`, id)
                }
            } else {
                client.reply(from, `Pilih enable atau disable udin!`, id)
            } 
            break   

        case '#antibadword':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            if (!isGroupAdmins) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Admin group!`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Perintah ini hanya bisa di gunakan jika Bot menjadi Admin!`, id)
            if (args[1] == 'enable') {
                var cek = antibadword.includes(chatId);
                if(cek){
                    return client.reply(from, `*「 ANTI BADWORD 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nHarap Jangan Toxic Di Sini Atau RIDHO BOT Akan Kick!`, id)
                } else {
                    antibadword.push(chatId)
                    fs.writeFileSync('./settings/antibadword.json', JSON.stringify(antibadword))
                    client.reply(from, `*「 ANTI BADWORD 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nHarap Jangan Toxic Di Sini Atau RIDHO BOT Akan Kick!`, id)
                }
            } else if (args[1] == 'disable') {
                var cek = antibadword.includes(chatId);
                if(!cek){
                    return client.reply(from, `*「 ANTI BADWORD 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nHarap Jangan Toxic Di Sini Atau RIDHO BOT Akan Kick!`, id)
                } else {
                    let nixx = antibadword.indexOf(chatId)
                    antibadword.splice(nixx, 1)
                    fs.writeFileSync('./settings/antibadword.json', JSON.stringify(antibadword))
                    client.reply(from, `*「 ANTI BADWORD 」*\nPerhatian Untuk Member Grup ${name} Tercinta\nHarap Jangan Toxic Di Sini Atau RIDHO BOT Akan Kick!`, id)
                }
            } else {
                client.reply(from, `Pilih enable atau disable !`, id)
            } 
            break   

        case '#addprem':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
                const addprem = body.slice(9)
                {
                premiumNumber.push(addprem+'@c.us')
                fs.writeFileSync('./settings/premium.json', JSON.stringify(premiumNumber))
                client.reply(from, 'Success Menambahkan user premium', id)
            }
            break

        case '#delprem':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
                const delprem = body.slice(9)
                let inq = premiumNumber.indexOf(delprem+'@c.us') 
                premiumNumber.splice(inq, 1)
                fs.writeFileSync('./settings/premium.json', JSON.stringify(premiumNumber))
                client.reply(from, 'Success Menghapus premium!', id)
            break

        case '#dowprem':
            if (!isOwner) return client.reply(from, `_Hanya Owner Bot Yang Bisa cancel upgrade premium_`, id)
                let inz = premiumNumber.indexOf(mentionedJidList[0])
                premiumNumber.splice(inz, 1)
                fs.writeFileSync('./settings/premium.json', JSON.stringify(premiumNumber))
                client.reply(from, 'Unband prem User!', id)
            break

        case '#toimage':
        case '#toimg':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length === 2) return client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *!toimage*`, id)
            if (quotedMsg) {
                client.reply(from, '_Mohon tunggu sedang mengkonversi stiker..._', id)
                if( quotedMsg.type === 'sticker') {
                mediaData = await decryptMedia(quotedMsg, uaOverride)
                await client.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sticker berhasil dikonversi! ${pushname}`)
                   //  
                   } else {
                        client.reply(from, `Hai ${pushname} sepertinya yang ada tag bukan stiker, untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *!toimage*`, id)
                   }
                } else {
                    client.reply(from, `Hai ${pushname} untuk menggunakan fitur sticker to image, mohon tag stiker! dan kirim pesan *#toimage*`, id)
                }
            await client.sendSeen(from)
            break

        case '#':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length === 1) return client.reply(from, `Chat dengan simi caranya ketik perintah :\n*$* _Pesan kamu_\nContoh :\n*$* _Halo simi_`, id)
            const que = body.slice(2)
            const sigot = await get.get(`http://simsumi.herokuapp.com/api?text=${que}&lang=id`).json() 
            client.reply(from, sigot.success, id)
            console.log(sigot)
            await client.sendSeen(from)
            break

        case '#fresh':
            try {
                await client.refresh().then((pres) => client.reply(from, `Berhadil direfresh ${pres}`, id)) 
            } catch (err){
                ERRLOG(err)
            }
            await client.sendSeen(from)
            break

        case '#indohot': 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)   
            const faksx = `https://test.mumetndase.my.id/indohot`
            const gettingx = await get.get(faksx).json()
            //console.log(gettingx)
            await client.reply(from, `*Judul* : ${gettingx.data.judul}\n*Genre* : ${gettingx.data.genre}\n*Negara* : ${gettingx.data.country}\n*Durasi* : ${gettingx.data.durasi}\n*Link gan* : ${gettingx.data.url}`, id).catch((e) => console.log(e))
            await client.sendSeen(from)
            break

        case '#pantun':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                client.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#quran':
            //if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah Surah Quran kamu dengan cara ketik perintah :\n*#quran* [ Urutan Surat ]\nContoh :\n*#quran 1*`, id)
            const qura = `https://api.vhtear.com/quran?no=${args[1]}&apikey=${vhtearkey}`
            const quraan = await axios.get(qura)
            const quraann = quraan.data
            let hasqu = `*「 AL-QURAN 」*\n\n*Surah : ${quraann.result.surah}*\n*Quran* : ${quraann.result.quran}*`
            await client.reply(from, `${hasqu}`, id).catch((e) => client.reply(from, `*Terdapat kesalahan saat mencari surat ${args[1]}*`, id))
            await limitAdd(serial)
            break
        
        case '#fakta':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#katabijak':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.reply(from, randombijak, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#pantun1':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                client.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#afk':
                if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
                //if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user owner RIDHO BOT', id)
                const qa = args.join(' ').slice(5)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (isAfkOn) return await client.reply(from, ind.afkOnAlready(), id)
                const reason = qa ? qa : 'Nothing.'
                addAfkUser(sender.id, time, reason)
                await client.reply(from, ind.afkOn(pushname, reason), id)
            break;
    
        case '#sticker':
        case '#stiker':
        case '#s':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break

        case '#ttp':
                if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
                if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', message.id)
                try
                {
                    const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                    if(args)
                    {
                        if(quotedMsgObj == null)
                        {
                            const gasMake = await getStickerMaker(string)
                            if(gasMake.status == true)
                            {
                                try{
                                    await client.sendImageAsSticker(from, gasMake.base64)
                                }catch(err) {
                                    await client.reply(from, 'Gagal membuat.', id)
                                } 
                            }else{
                                await client.reply(from, gasMake.reason, id)
                            }
                        }else if(quotedMsgObj != null){
                            const gasMake = await getStickerMaker(quotedMsgObj.body)
                            if(gasMake.status == true)
                            {
                                try{
                                    await client.sendImageAsSticker(from, gasMake.base64)
                                }catch(err) {
                                    await client.reply(from, 'Gagal membuat.', id)
                                } 
                            }else{
                                await client.reply(from, gasMake.reason, id)
                            }
                        }
                       
                    }else{
                        await client.reply(from, 'Tidak boleh kosong.', id)
                    }
                }catch(error)
                {
                    console.log(error)
                }
            break;

        case '#pinterest':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id) */
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#pinterest [query]*\nContoh : *#pinterest ronaldo*', id)
            const ptrsq = body.slice(11)
            const ptrs = await axios.get('https://api.fdci.se/rep.php?gambar='+ptrsq)
            const b = JSON.parse(JSON.stringify(ptrs.data))
            const ptrs2 =  b[Math.floor(Math.random() * b.length)]
            const image = await bent("buffer")(ptrs2)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, 'ptrs.jpg', `*Pinterest*\n\n*Hasil Pencarian : ${ptrsq}*`)
            break 

        case '#shota':
            /* if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id) */
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const imageToBase64 = require('image-to-base64')
            var shouta = ['shota anime','anime shota'];
            var shotaa = shouta[Math.floor(Math.random() * shouta.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + shotaa;
            
            axios.get(urlshot)
            .then((result) => {
            var sht = JSON.parse(JSON.stringify(result.data));
            var shotaak =  sht[Math.floor(Math.random() * sht.length)];
            imageToBase64(shotaak)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            client.sendFile(from, img, "shota.jpg", `*SHOTA*`, id)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break   

        case '#stickergif':
        case '#stikergif':
        case '#sgif':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            client.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
            if (isMedia && type === 'video' || mimetype === 'image/gif') {
                try {
                    const mediaData = await decryptMedia(message, uaOverride)
                    await client.sendMp4AsSticker(from, mediaData, {fps: 17, startTime: `00:00:00.0`, endTime : `00:00:05.0`,loop: 0})
                } catch (e) {
                    client.reply(from, `Size media terlalu besar! mohon kurangi durasi video.`, id)
                }
            } else if (quotedMsg && quotedMsg.type == 'video' || quotedMsg && quotedMsg.mimetype == 'image/gif') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                await client.sendMp4AsSticker(from, mediaData, {fps: 15, startTime: `00:00:00.0`, endTime : `00:00:05.0`,loop: 0})
            } else {
                client.reply(from, `Kesalahan ⚠️ Hanya bisa video/gif apabila file media berbentuk gambar ketik #stiker`, id)
            } 
            await client.sendSeen(from)
            break

        case '#cewe':
        case '#cewek':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            var items = ["ullzang girl", "cewe cantik", "cewe hijab", "hijaber", "hijab cantik", "korean girl"];
            var cewe = items[Math.floor(Math.random() * items.length)];
            var apalo = "http://api.fdci.se/rep.php?gambar=" + cewe;
            axios.get(apalo).then((result) => {
                var b = JSON.parse(JSON.stringify(result.data));
                var cewek =  b[Math.floor(Math.random() * b.length)];
                client.sendFileFromUrl(from, cewek, 'cewe.jpg', 'Aku cantik gak\n\n', id)
            });
            break

       
        case '#tostiker':
        case '#tosticker':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length === 1) return client.reply(from, `Penggunaan teks to sticker : *!tosticker [Teks]*\n\nContoh : !tosticker bot ganteng`)
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') return client.reply(from, 'Fitur ini hanya untuk teks! bukan gambar.', id)
           
            const texk = body.slice(10)
            client.reply(from, '_Sedang mengkonversi teks ke stiker..._', id)
            try {
                 if (quotedMsgObj == 'stiker') {
                     const GetData = await BikinTikel(texk)
                     if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *#tosticker [teks]*', id)
                     try {
                         await client.sendImageAsSticker(from, GetData.base64)
                     } catch (err) {
                         console.log(err)
                     }
                 } else {
                     const GetData = await BikinTikel(quotedMsgObj.body)
                     if (GetData.status == false) return client.reply(from, 'Kesalahan dalam mengkonversi teks! tag tulisan atau gunakan teks setelah perintah *!tosticker [teks]*', id)
                     try {
                         await client.sendImageAsSticker(from, GetData.base64)
                     } catch (err) {
                         console.log(err)
                     }
                 }
            } catch (err){
                console.log(err)
            }

            try
                 {
                     const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                     if(args)
                     {
                         if(quotedMsgObj == null)
                         {
                             const gasMake = await getStickerMaker(string)
                             if(gasMake.status == true)
                             {
                                 try{
                                     await client.sendImageAsSticker(from, gasMake.base64)
                                 }catch(err) {
                                     await client.reply(from, 'Gagal membuat.', id)
                                 } 
                             }else{
                                 await client.reply(from, gasMake.reason, id)
                             }
                         }else if(quotedMsgObj != null){
                             const gasMake = await getStickerMaker(quotedMsgObj.body)
                             if(gasMake.status == true)
                             {
                                 try{
                                     await client.sendImageAsSticker(from, gasMake.base64)
                                 }catch(err) {
                                     await client.reply(from, 'Gagal membuat.', id)
                                 } 
                             }else{
                                 await client.reply(from, gasMake.reason, id)
                             }
                   }
                       
                     }else{
                         await client.reply(from, 'Tidak boleh kosong.', id)
                     }
                 }catch(error)
                 {
                     console.log(error)
                 }
            await client.sendSeen(from)
            break; 


        case '#cowo':
        case '#cowok':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            var items = ["ullzang boy", "cowo ganteng", "cogan", "korean boy", "jepang boy", "cowo korea"];
            var cewe = items[Math.floor(Math.random() * items.length)];
            var apalo = "http://api.fdci.se/rep.php?gambar=" + cewe;
            axios.get(apalo).then((result) => {
                var b = JSON.parse(JSON.stringify(result.data));
                var cewek =  b[Math.floor(Math.random() * b.length)];
                client.sendFileFromUrl(from, cewek, 'cowo.jpg', 'aku ganteng gak\n\nby:ridho', id)
            });
            break

    case '#maps':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#maps [optional]*, Contoh : *#maps Jakarta*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const mapz = await slicedArgs.join(' ')
            console.log(mapz)
            try {
            const mapz2 = await axios.get('https://mnazria.herokuapp.com/api/maps?search=' + mapz)
            const { gambar } = mapz2.data
            const pictk = await bent("buffer")(gambar)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, 'maps.jpg', `*Hasil Maps : ${mapz}*`)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
             client.sendText(ownerNumber, 'Error Maps : '+ err)
           }
          break

        case '#groupinfo' :
        case '#infogroup' :
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', message.id)
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = welkom.includes(chat.id)
            var intro = intr.includes(chat.id)
            var leftgrp = left.includes(chat.id)
            var antbad = antibadword.includes(chat.id)
            var antlink = antilink.includes(chat.id)
            var ngrp = nsfw_.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `➸ *Name : ${groupname}* 
*➸ Members : ${totalMem}*
*➸ Welcome : ${welgrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ Left : ${leftgrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ NSFW : ${ngrp ? 'Aktif' : 'Tidak Aktif'}*
*➸ Intro : ${intro ? 'Aktif' : 'Tidak Aktif'}*
*➸ Anti Link : ${antlink ? 'Aktif' : 'Tidak Aktif'}*
*➸ Anti Badword : ${antbad ? 'Aktif' : 'Tidak Aktif'}*
*➸ Group Description* 
${desc}`)
            break

        /*case '#quoterandom' :
        case '#quote' :
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            const quotex = await rugaapi.quote()
            await client.reply(from, quotex, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break*/

        case '#addlimit':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner, !isPrem) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            var found = false;
                    Object.keys(limit).forEach((i) => {
                        if(limit[i].id == mentionedJidList[0]){
                            found = i
                        }
                    })
                    if (found !== false) {
                        limit[found].limit -= args[1];
                        fs.writeFileSync('./lib/limit.json',JSON.stringify(limit));
                    }
                        client.sendTextWithMentions(from, `menambahkan ${args[1]} limit ke @${mentionedJidList[0].replace('@c.us', '')}` )
                    break

        /*case '#ytmp4':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
           if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#ytmp4 [ Link Yt ]*, untuk contoh silahkan kirim perintah *#readme*`, id)
            let isLin1 = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLin1) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const ytvh = await fetch(`http://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhtearkey}`)
                if (!ytvh.ok) throw new Error(`Error Get Video : ${ytvh.statusText}`)
                const ytvh2 = await ytvh.json()
                 if (ytvh2.status == false) {
                    client.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    const { title, UrlVideo, imgUrl, size } = await ytvh2.result
                    if (Number(ytvh2.result.size.split(' MB')[0]) > 30.00) return client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, `*「 YOUTUBE MP4 」*\n\n• *Judul* : ${title}\n• *Filesize* : ${size}\n\n__Maaf, Durasi video melebihi 30 MB. Silahkan download video melalui link dibawah_.\n${UrlVideo}`, id)
                    client.sendFileFromUrl(from, imgUrl, 'thumb.jpg', `*「 YOUTUBE MP4 」*\n\n• *Judul* : ${title}\n• *Filesize* : ${size}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`, id)
                    /await client.sendFileFromUrl(from, UrlVideo, `${title}.mp4`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                    await limitAdd(serial)
                }
            } catch (err) {
                client.sendText(ownerNumber, 'Error ytmp4 : '+ err)
                client.reply(from, mess.error.Yt4, id)
                console.log(err)
            }
            break*/

    

        /*case '#play':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #ceklimit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length == 1) return client.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: #play judul lagu`, id)
            try {
                client.reply(from, mess.wait, id)
                const serplay = body.slice(6)
                const webplay = await fetch(`https://api.vhtear.com/ytmp3?query=${serplay}&apikey=${vhtearkey}`)
                if (!webplay.ok) throw new Error(`Error Get Video : ${webplay.statusText}`)
                const webplay2 = await webplay.json()
                 if (webplay2.status == false) {
                    client.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    if (Number(webplay2.result.size.split(' MB')[0]) >= 10.00) return client.reply(from, 'Maaf durasi music sudah melebihi batas maksimal 10 MB!', id)
                    const { image, mp3, size, ext, title, duration } = await webplay2.result
                    const captplay = `*「 PLAY 」*\n\n➸ *Judul* : ${title}\n➸ *Durasi* : ${duration}\n➸ *Filesize* : ${size}\n➸ *Exp* : ${ext}\n\n_*Music Sedang Dikirim*_`
                    client.sendFileFromUrl(from, image, `thumb.jpg`, captplay, id)
                    await client.sendFileFromUrl(from, mp3, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                    await limitAdd(serial)
                }
            } catch (err) {
                client.sendText(ownerNumber, 'Error Play : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break   */

        case '#iph':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #iph ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const t = body.slice(5).split('|')[0]
            const text25 = body.split('|')[1]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", t);
            await page.type("#text-1", text25);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 5000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error iph : '+ err)
                client.reply(from, mess.error, id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#ift':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #ift ridho`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const tt = body.slice(5).split('|')[0]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", tt);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error ift : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#ise':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #ise ridho`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const ttt = body.slice(5).split('|')[0]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/create-snow-text-effects-for-winter-holidays-1005.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", ttt);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error ise : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#ims':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #ims ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const tttt = body.slice(5).split('|')[0]
        const text23 = body.split('|')[1]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/text-logo-3d-metal-silver-946.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", tttt);
            await page.type("#text-1", text23);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error ims : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#imr':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #imr ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const ttttt = body.slice(5).split('|')[0]
            const text24 = body.split('|')[1]
            try {
                (async () => {
                    const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/text-logo-3d-metal-rose-gold-945.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", ttttt);
            await page.type("#text-1", text24);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error imr : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#img':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #img ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const tttttt = body.slice(5).split('|')[0]
        const text21 = body.split('|')[1]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/text-logo-3d-metal-gold-944.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", tttttt);
            await page.type("#text-1", text21);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error img : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#irg':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #irg ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const ttttttt = body.slice(5).split('|')[0]
        const text22 = body.split('|')[1]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/text-logo-3d-metal-rose-gold-945.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", ttttttt);
            await page.type("#text-1", text22);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error irg : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#inl':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #inl ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const tttttttt = body.slice(5).split('|')[0]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/neon-light-text-effect-online-882.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", tttttttt);
            //await page.type("#text-1", text2);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error inl : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

        case '#icg':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `kirim dengan\n\nPenggunaan: #icg ridho|bot`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const ttttttttt = body.slice(5).split('|')[0]
            try {
                (async () => {
            const browser = await puppeteer.launch({
            headless: true,
                });
            const page = await browser.newPage();
            await page
            .goto("https://textpro.me/3d-chrome-text-effect-827.html", {
            waitUntil: "networkidle2"
                })
            .then(async () => {
            await page.type("#text-0", ttttttttt);
            //await page.type("#text-1", text2);
            await page.click("#submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            const element = await page.$(
                'div[class="btn-group"] > a'
                );
            const text = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, text, id)
            browser.close();
                })
            .catch((err => {
            client.sendText(ownerNumber, 'Error icg : '+ err)
                client.reply(from, 'error', id)
                }))
            })();
            } catch (error) {
            console.log(owner, 'error bang')
            }
            break

    case '#creategroup':
    case '#bikingroup':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            arg = body.trim().split(' ')
            client.reply(from, mess.wait, id)
            const jhoin = '6281289096745@c.us'
            const gcname = arg[1]
            client.createGroup(gcname, jhoin)
            await client.reply(from, 'Group Created ✨️', id)
            break

        case '#culik':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk bot', id)
            arg = body.trim().split(' ')
            const gcnamo = arg[1]
            client.createGroup(gcnamo, mentionedJidList)
            await client.sendText(from, 'Group Created ✨️')
            break

        case '#magernulis':
            if (args.length == 1) return benny.reply(from, 'Kirim perintah *#lirik [optional]*, contoh *#lirik aku bukan boneka*', id)
            client.sendFileFromUrl(from, `https://api.vhtear.com/write?text=${body.slice(12)}&apikey=${vhtearkey}`, 'nulis.jpg', 'Neh..', id)
                break

        /*case '#ytv':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `Untuk mendownload video dari youtube\n\nPenggunaan: #ytv link`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 5 min!', id)
            const urlyt = body.slice(5)
            try {
                (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                });
            const page = await browser.newPage();
            await page
                .goto("https://www.y2mate.com/en5/download-youtube", {
                waitUntil: "networkidle2"
                })
                .then(async () => {
            await page.type("#txt-url", urlyt);
            await page.click("#btn-submit");
            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.click('[data-ftype="mp4"]');
            await new Promise(resolve => setTimeout(resolve, 5000));
            const element = await page.$(
                'div[class="form-group has-success has-feedback"] > a'
                );
            const texts = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, texts, id)
            browser.close();
        })
        .catch((err => {
            client.sendText(ownerNumber, 'Error ytv : '+ err)
                client.reply(from, mess.error.Yt4, id)
        }))
            })();
                } catch (error) {
                    console.log(from, 'error bang', id)
                    }
            break

        case '#ytm':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `Untuk mendownload video dari youtube\n\nPenggunaan: #ytv link`, id)
            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
            const urlyt1 = body.slice(5)
            try {
                (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                });
            const page = await browser.newPage();
            await page
                .goto("https://www.y2mate.com/en30/youtube-mp3", {
                waitUntil: "networkidle2"
                })
                .then(async () => {
            await page.type("#txt-url", urlyt1);
            await page.click("#btn-submit");
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.click('[data-ftype="mp3"]');
            await new Promise(resolve => setTimeout(resolve, 5000));
            const element = await page.$(
                'div[class="form-group has-success has-feedback"] > a'
                );
            const texts = await (await element.getProperty("href")).jsonValue();
            client.sendFileFromUrl(from, texts, id)
            browser.close();
        })
        .catch((err => {
            client.sendText(ownerNumber, 'Error ytm : '+ err)
                client.reply(from, mess.error.Yt4, id)
        }))
            })();
                } catch (error) {
                    console.log('error bang', id)
                    }
            break*/

        case '#playf':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: #play judul lagu`, id)
            try {
                client.reply(from, mess.wait, id)
                const serplay = body.slice(6)
                const webplay = await fetch(`https://api.vhtear.com/ytmp3?query=${serplay}&apikey=${vhtearkey}`)
                if (!webplay.ok) throw new Error(`Error Get Video : ${webplay.statusText}`)
                const webplay2 = await webplay.json()
                 if (webplay2.status == false) {
                    client.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    if (Number(webplay2.result.size.split(' MB')[0]) >= 10.00) return client.reply(from, 'Maaf durasi music sudah melebihi batas maksimal 10 MB!', id)
                    const { image, mp3, size, ext, title, duration } = await webplay2.result
                    const captplay = `*「 PLAY 」*\n\n➸ *Judul* : ${title}\n➸ *Durasi* : ${duration}\n➸ *Filesize* : ${size}\n➸ *Exp* : ${ext}\n\n_*Music Sedang Dikirim*_`
                    client.sendFileFromUrl(from, image, `thumb.jpg`, captplay, id)
                    await client.sendFileFromUrl(from, mp3, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                    await limitAdd(serial)
                }
            } catch (err) {
                client.sendText(ownerNumber, 'Error Play : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break   

        /*case '#ytmp3':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
           if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#ytmp3 [ Link Yt ]*, untuk contoh silahkan kirim perintah *#readme*`, id)
            let isLinks1 = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks1) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const vhtearyt3 = await fetch(`https://api.vhtear.com/ytdl?link=${args[1]}&apikey=${vhtearkey}`)
                if (!vhtearyt3.ok) throw new Error(`Error ytmp3 3 : ${vhtearyt3.statusText}`)
                const vhtearyt33 = await vhtearyt3.json()
                 if (vhtearyt33.status == false) {
                    client.reply(from, `*Maaf Terdapat kesalahan saat mengambil data, mohon pilih media lain...*`, id)
                } else {
                    const { title, ext, size, UrlMp3, status, imgUrl } = await vhtearyt33.result
                    console.log(`VhTear Giliran ${ext}\n${size}\n${status}`)
                    if(Number(vhtearyt33.result.size.split(' MB')[0]) >= 10.00) return client.sendFileFromUrl(from, imgUrl, `thumb.jpg`, `*「 YOUTUBE MP3 」*\n\n• *Judul* : ${title}\n• *Filesize* : ${size}\n\n_Maaf, Durasi audio melebihi 10 MB. Silahkan download audio melalui link dibawah_.\n${UrlMp3}`, id)
                    const captions = `*「 YOUTUBE MP3 」*\n\n• *Judul* : ${title}\n• *Filesize* : ${size}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                    client.sendFileFromUrl(from, imgUrl, `thumb.jpg`, captions, id)
                    //await client.sendFile(from, UrlMp3, `${title}.mp3`, '', id)
                    await client.sendFileFromUrl(from, UrlMp3, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                    await limitAdd(serial)
                }
            } catch (err) {
                client.sendText(ownerNumber, 'Error ytmp3 : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break*/   

        case '#tts':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#tts* [id, en, jp, ar, ru, ko] [teks], contoh *#tts* id halo semua')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
            const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const ttsRu = require('node-gtts')('ru')
            const ttsKo = require('node-gtts')('ko')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Kode Bahasa yang digunakan salah', id)
            if (dataText.length > 500) return client.reply(from, 'Teks tidak boleh terlalu panjang', id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', message.id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', message.id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', message.id)
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', message.id)
                })
            } else if (dataBhs == 'ru') {
                ttsRu.save('./media/tts/resRu.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resRu.mp3', message.id)
                })
            } else if (dataBhs == 'ko') {
                ttsKo.save('./media/tts/resKo.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resKo.mp3', message.id)
                })
            } else {
                client.reply(from, 'Masukin kode bahasanya : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, [ar] untuk arab, [ru] untuk russia, dan [ko] untuk korea\n\nContoh : #tts id selamat pagi', id)
            }
            break

        case '#koin':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
              client.sendStickerfromUrl(from, 'https://i.ibb.co/YTWZrZV/2003-indonesia-500-rupiah-copy.png', { method: 'get' })
            } else {
              client.sendStickerfromUrl(from, 'https://i.ibb.co/bLsRM2P/2003-indonesia-500-rupiah-copy-1.png', { method: 'get' })
            }
            break

        case '#dadu':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const dice = Math.floor(Math.random() * 6) + 1
            await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' })
            break

        case '#kapankah':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const when = args.join(' ')
            const ans = kapankah[Math.floor(Math.random() * (kapankah.length))]
            if (!when) client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await client.sendText(from, `Pertanyaan: *${when}* \n\nJawaban: ${ans}`)
            break

        case '#nilai':
        case '#rate':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const rating = args.join(' ')
            const awr = rate[Math.floor(Math.random() * (rate.length))]
            if (!rating) client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await client.sendText(from, `Pertanyaan: *${rating}* \n\nJawaban: ${awr}`)
            break

        case '#apakah':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const nanya = args.join(' ')
            const jawab = apakah[Math.floor(Math.random() * (apakah.length))]
            if (!nanya) client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await client.sendText(from, `Pertanyaan: *${nanya}* \n\nJawaban: ${jawab}`)
            break

         case '#bisakah':
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const bsk = args.join(' ')
            const jbsk = bisakah[Math.floor(Math.random() * (bisakah.length))]
            if (!bsk) client.reply(from, '⚠️ Format salah! Ketik *#menu* untuk penggunaan.')
            await client.sendText(from, `Pertanyaan: *${bsk}* \n\nJawaban: ${jbsk}`)
            break

        case '#owner':
        case '#creator':
            client.sendContact(chatId, `6281289096745@c.us`)
            client.reply(from, 'tu owner saya:) ada yang di tanyakan, jangan di spam atau telpon', id)
            break

        case '*member':
            const m = body.slice(0)
            client.reply(from, m, id)
            break

        case '#nsfw':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSWF Command berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSFW Command berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break

        case '#left':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                left.push(chat.id)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                client.reply(from, 'Fitur left berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                left.splice(chat.id, 1)
                fs.writeFileSync('./lib/left.json', JSON.stringify(left))
                client.reply(from, 'Fitur left berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable udin!', id)
            }
            break

        case '#welcome':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable!', id)
            }
            break

        case '#intro':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                intr.push(chat.id)
                fs.writeFileSync('./settings/intro.json', JSON.stringify(intr))
                client.reply(from, 'Fitur intro berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                intr.splice(chat.id, 1)
                fs.writeFileSync('./settings/intro.json', JSON.stringify(intr))
                client.reply(from, 'Fitur intro berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable!', id)
            }
            break

        // ANIME //
        case '#malanime':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const keyword = message.body.replace('#malanime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan', id)
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Ditemukan!*
✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`
            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Anime tidak ditemukan')
           }
          break

        // MEDIA //
        case '#cuaca':
            if (args.length == 1) return client.reply(from, `Untuk melihat cuaca pada suatu daerah\nketik: ${prefix}cuaca [daerah]`, id)
            const cuacaq = body.slice(7)
            const cuacap = await rugaapi.cuaca(cuacaq)
            await client.reply(from, cuacap, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#covid':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                await client.sendText(from, '🌎️ Covid Info - ' + country + ' 🌍️\n\n✨️ Total Cases: ' + `${cases}` + '\n📆️ Today\'s Cases: ' + `${todayCases}` + '\n☣️ Total Deaths: ' + `${deaths}` + '\n☢️ Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️ Active Cases: ' + `${active}` + '.')
            break
        
        case '#google':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah seperti contoh berikut *#google gta sfile.mobi*')
            var googleQuery1 = body.slice(8)
            if(googleQuery1 == undefined || googleQuery1 == ' ') return
            google({ 'query': googleQuery1, 'limit': '2' }).then(results => {
                let vars = results[0];
                    client.sendText(from, `_*Hasil Pencarian Google*_\n\n~> Judul : \n${vars.title}\n\n~> Deskripsi : \n${vars.snippet}\n\n~> Link : \n${vars.link}`);
            }).catch(e => {
                client.sendText(e);
            })
            break

         case '#translate':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id) */
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if(args[1] == undefined || args[2] == undefined) return
            if(args.length >= 2){
                var codelang = args[1]
                var text = body.slice(11+codelang.length);
                translatte(text, {to: codelang}).then(res => {
                    client.sendText(from,res.text);
                    limitAdd(serial)
                }).catch(err => {
                     client.sendText(from,`[ERROR] Teks tidak ada, atau kode bahasa ${codelang} tidak support\n~> *#bahasa* untuk melihat list kode bahasa`);
                });
            }
            break

        case '#search':
            if (args.length === 1) return client.reply(from, `Kirim perintah Google search dengan cara ketik perintah :\n*#search* _Query search_\nContoh :\n*!search* _Detik News hari ini_`, id)
            client.reply(from, mess.wait, id)
            const googleQuery = body.slice(8)
            if(googleQuery == undefined || googleQuery == ' ') return client.reply(from, `_Kesalahan tidak bisa menemukan hasil from ${googleQuery}_`, id)
            google({ 'query': googleQuery }).then(results => {
            let captserch = `_*Hasil Pencarian Google from*_ ${googleQuery}\n`
            for (let i = 0; i < results.length; i++) {
                captserch += `\n\n=============================\n\n`
                captserch +=  `\n*Judul* : ${results[i].title}\n*Deskripsi* : ${results[i].snippet}\n*Link* : ${results[i].link}\n`
            }
                client.reply(from, captserch, id);
            }).catch(e => {
                ERRLOG(e)
                client.sendText(ownerNumber, e);
            })
            await client.sendSeen(from)
            break

        case '#nyanyi1':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!nyanyi _Lagunya_*, untuk contoh silahkan kirim perintah *!readme*')
            const quernyanyi = body.slice(8)
            try {
                client.reply(from, mess.wait, id)
                const bahannyanyi = await fetch(`https://api.vhtear.com/music?query=${quernyanyi}&apikey=${vhtearkey}`)
                if (!bahannyanyi) throw new Error(`Err nyanyi :( ${bahannyanyi.statusText}`)
                const datanyanyi = await bahannyanyi.json()
                console.log(datanyanyi)
                client.reply(from, `_Bot sedang vn..._`)
                if (Number(datanyanyi.result[0].duration.split(':')[1]) >= 12) return client.reply(from, '_Mohon maaf sepertinya durasi video telah melebihi batas._', id)
                if (!datanyanyi.result[0].judul == '') {
                    client.sendFileFromUrl(from, datanyanyi.result[0].linkImg, 'Thumbnyanyi.jpg',`Bot nyanyi lagu : ${datanyanyi.result[0].judul}\nDari penyanyi : ${datanyanyi.result[0].penyanyi}\nDurasinya : ${datanyanyi.result[0].duration}`)
                    await client.sendFileFromUrl(from, datanyanyi.result[0].linkMp3, 'Laginyanyi.mp3', '', id).catch((errs) => console.log(errs))
                } else {
                    client.reply(from, `_Kayanya bot gabisa nyanyi lagu itu :(_`, id)
                }
            } catch (err) {
                console.log(err)
                client.reply(from, `_Kayanya bot gabisa nyanyi lagu itu hemm :(_`, id)
            }
            await client.sendSeen(from)
            break   

        

        case '#playstore':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            //https://api.vhtear.com/playstore?query=ff&apikey=droidstah
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!PlayStore* _Aplikasi/Games yang akan dicari_')
            const keywotp = body.slice(11)
            client.reply(from, mess.wait, id)
            try {
                //client.reply(from, '_Sedang mencari data..._', id)
                const dataplay = await get.get(`https://api.vhtear.com/playstore?query=${keywotp}&apikey=${vhtearkey}`).json()
                //console.log(dataplay)
                let keluarplay = `*Menampilkan list app ${keywotp}*\n`
                for (let i = 0; i < dataplay.result.length; i++) {
                    keluarplay += `\n*Nama* : ${dataplay.result[i].title}\n*Developer* : ${dataplay.result[i].developer}\n*Deskripsi* : ${dataplay.result[i].description}\n*Paket ID* : ${dataplay.result[i].app_id}\n*Harga* : ${dataplay.result[i].price}\n*Link App* : https://play.google.com${dataplay.result[i].url}\n`
                }
                await client.sendFileFromUrl(from, dataplay.result[0].icon, `icon_app.webp`, keluarplay, id)
            }   catch (err){
                console.log(err)
            }
            await client.sendSeen(from)
            break

        case '#ytsearch':
        case '#searchyt':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!searchyt* _Channel/Title YT yang akan dicari_')
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            
            await limitAdd(serial)
            const keywot = body.slice(10)
            client.reply(from, mess.wait, id)
            try {
                //client.reply(from, '_Sedang mencari data..._', id)
                const response2 = await fetch(`https://api.vhtear.com/youtube?query=${encodeURIComponent(keywot)}&apikey=${vhtearkey}`)
                if (!response2.ok) throw new Error(`unexpected response ${response2.statusText}`)
                const jsonserc = await response2.json()
                const { result } = await jsonserc
                let xixixi = `*Hasil pencarian dari ${keywot}*\n`
                for (let i = 0; i < result.length; i++) {
                    xixixi += `\n*Title* : ${result[i].title}\n*Channel* : ${result[i].channel}\n*URL* : ${result[i].urlyt}\n*Durasi* : ${result[i].duration}\n*Views* : ${result[i].views}\n`
                }
                await client.sendFileFromUrl(from, result[0].image, 'thumbserc.jpg', xixixi, id)
            } catch (err) {
                    console.log(err)
            }
            await client.sendSeen(from)
            break   

        case '#ramalpasangan':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#ramalpasangan [kamu|pasangan]*\nContoh : *#ramalpasangan ridho|${pushname}*`, id)
            arg = body.trim().split('|')
            if (arg.length >= 2) {
            client.reply(from, mess.wait, id)
            const kamu = arg[0]
            const pacar = arg[1]
            const rpmn = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn2 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn3 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn4 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn5 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn6 = rate[Math.floor(Math.random() * (rate.length))]
            const rjh2 = `*Hasil Pengamatan!*\nPasangan dengan nama ${kamu} dan ${pacar}\n\n➸ Cinta : ${rpmn}\n➸ Jodoh : ${rpmn2}\n➸ Kemiripan : ${rpmn3}\n➸ Kesukaan : ${rpmn4}\n➸ Kesamaan : ${rpmn5}\n➸ Kebucinan ${rpmn6}`
            client.reply(from, rjh2, id)
            } else {
            await client.reply(from, 'Wrong Format!', id)
            }
            break

        /*case '#artinama':
            if (args.length == 1) return client.reply(from, `Untuk mengetahui arti nama seseorang\nketik ${prefix}artinama namakamu`, id)
            rugaapi.artinama(body.slice(10))
            .then(async(res) => {
                await client.reply(from, `Arti : ${res}`, id)
            })
            break*/

        case '#tiktok':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#tiktok* _linkVideoTikTod_, untuk contoh silahkan kirim perintah *!readme*', id)
            client.reply(from, mess.wait, id)
            try{
            function tiktod(url) {
              return new Promise((resolve, reject) => {
                try {
                  tiktok.getVideoMeta(url)
                  .then((result) => {
                    const data = result.collector[0]
                    let Tag = []
                    for (let i = 0; i < data.hashtags.length; i++) {
                      const name = data.hashtags[i].name
                      Tag.push(name)
                    }
                    // console.log(data)
                    const id = data.id
                    const text = data.text
                    const date = data.createTime
                    const name = data.authorMeta.name
                    const nick = data.authorMeta.nickName
                    const music = data.musicMeta.musicName
                    const thumb = data.imageUrl
                    const hastag = Tag

                    resolve({
                      id: id,
                      name: name,
                      nickname: nick,
                      timestamp: date,
                      thumb: thumb,
                      text: text,
                      music: music,
                      hastag: hastag
                    })
                  })
                .catch(reject)
              } catch (error) {
                console.log(error)
              }
              })
            }

            tiktod(args[1]).then(resul => {
              const meta = resul
              const exekute = exec('tiktok-scraper video ' + args[1] + ' -d')

              exekute.stdout.on('data', function(data) {
                const res = { loc: `${data.replace('Video location: ','').replace('\n','')}` }
                const json = {
                  meta,
                  res,
                } 
                let hastagtik = `[ `
                for (var i = 0; i < json.meta.hastag.length; i++) {
                    hastagtik += `${json.meta.hastag[i]} `
                }
                hastagtik += ` ]`
                const capt_tikt = `*Data berhasil didapatkan!*

*Nama* : ${json.meta.name}
*Nickname* : ${json.meta.nickname}
*Text* : ${json.meta.text}
*Music* : ${json.meta.music}
*Hastag* : ${hastagtik}
`
            client.sendFile(from, json.res.loc, `tiktod.${json.res.loc.substr(-3)}`, capt_tikt, id)
              })
            })
            } catch (err){
                ERRLOG(err)
                client.sendText(ownerNumber, 'Error tiktod = '+err)
                client.reply(from, `Terjadi kesalahan saat mengakses file tersebut, tidak bisa mengirim video!`)
            }
            await client.sendSeen(from)
            break

        case '#hilih':
            if (quotedMsg) {
                const dataHlih = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
                client.reply(from, dataHlih.replace(/a|u|e|o/gi, 'i'), id)
            } else {
                client.reply(from, body.slice(7).replace(/a|u|e|o/gi, 'i'). id)
            }
            await client.sendSeen(from)
            break

         case '#smule':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#smule [linkSmule]*\nContoh : *#smule https://www.smule.com/p/767512225_3062360163*', id)
            client.reply(from, mess.wait, id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const sml = await slicedArgs.join(' ')
            console.log(sml)
            try {
            const sml2 = await axios.get('https://api.vhtear.com/getsmule?link=' + sml + '&apikey=' + vhtearkey)
            const { Type, title, url, image } = sml2.data.result
            const sml3 = `*Music Ditemukan!*

➸ *Judul:* ${title}
➸ *Type:* ${Type}`

            const pictk = await bent("buffer")(image)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, title, sml3)
            client.sendFileFromUrl(from, url, `${title}.mp3`, sml3, id)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Music tidak ditemukan')
           }
           break

        case '#resep1':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 0) return client.reply(from, `Untuk mencari resep makanan\nCaranya ketik: ${prefix}resep [search]\n\ncontoh: ${prefix}resep tahu`, id)
            const cariresep = body.slice(8)
            const hasilresep = await resep.resep(cariresep)
            await client.reply(from, hasilresep + '\n\nIni kak resep makanannya..', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#wiki':            
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#wiki [query]*\nContoh : *#wiki asu*', id)
            const query_ = body.slice(6)
            client.reply(from, mess.wait, id)
            try {
                const wiki = await get.get(`https://api.vhtear.com/wikipedia?query=${encodeURIComponent(query_)}&apikey=${vhtearkey}`).json()
                if (wiki.error) {
                    client.reply(from, wiki.error, id)
                } else {
                    client.sendFileFromUrl(from, wiki.result.ImgResult[0], wiki.jpg, `*Hasil wikipedia from ${query_}*\n\n${wiki.result.Info}`, id).catch(() => hurtz.reply(from, `*Hasil wikipedia from ${query_}*\n\n${wiki.result.Info}`, id))
                }
            } catch (err){
                ERRLOG(err)
                client.reply(from, `_Mohon maaf kesalahan saat mencari data ${query_}_`)
            }
            await client.sendSeen(from)
            break

        case '#igstalk':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1)  return client.reply(from, 'Kirim perintah *#igstalk @username*\nContoh *#igstalk @duar_amjay*', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const istalk = await slicedArgs.join(' ')
            console.log(istalk)
            try {
            const istalk2 = await axios.get('https://api.vhtear.com/igprofile?query=' + istalk + '&apikey=' + vhtearkey)
            const { biography, follower, follow, post_count, full_name, username, picture, is_private } = istalk2.data.result
            const istalk3 = `*User Ditemukan!*
➸ *Username:* ${username}
➸ *Nama:* ${full_name}
➸ *Bio:* ${biography}
➸ *Mengikuti:* ${follow}
➸ *Pengikut:* ${follower}
➸ *Jumlah Postingan:* ${post_count}`

            const pictk = await bent("buffer")(picture)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, username, istalk3)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
           }
          break

        case '#tiktokstalk':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1)  return client.reply(from, 'Kirim perintah *#tiktokstalk @username*\nContoh *#tiktokstalk @duar_amjay*', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const tstalk = await slicedArgs.join(' ')
            console.log(tstalk)
            try {
            const tstalk2 = await axios.get('https://api.vhtear.com/tiktokprofile?query=' + tstalk + '&apikey=' + vhtearkey)
            const { username, bio, follow, follower, title, like_count, video_post, description, picture, url_account } = tstalk2.data.result
            const tiktod = `*User Ditemukan!*
➸ *Username:* ${username}
➸ *Judul:* ${title}
➸ *Bio:* ${bio}
➸ *Mengikuti:* ${follow}
➸ *Pengikut:* ${follower}
➸ *Jumlah Like*: ${like_count}
➸ *Jumlah Postingan:* ${video_post}
➸ *Deskripsi:* ${description}
➸ *Link:* ${url_account}`

            const pictk = await bent("buffer")(picture)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, title, tiktod)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
           }
          break

        case '#smulestalk':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#smulestalk [@username]*\nContoh : *#smulestalk loli*', id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const sstalk = await slicedArgs.join(' ')
            console.log(sstalk)
            try {
            const sstalk2 = await axios.get('https://api.vhtear.com/smuleprofile?query=' + sstalk + '&apikey=' + vhtearkey)
            const { username, full_name, follower, follow, biography, is_vip, picture, recording } = sstalk2.data.result
            const smule = `*User Ditemukan!*
➸ *Username:* ${username}
➸ *Full Name:* ${title}
➸ *Biografi:* ${biography}
➸ *Mengikuti:* ${follow}
➸ *Pengikut:* ${follower}
➸ *VIP*: ${is_vip}
➸ *Total Rekaman:* ${recording}`

            const pictk = await bent("buffer")(picture)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, title, smule)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
            }
          break

        case '#starmaker':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#starmaker [linkStarmaker]* untuk contoh silahkan kirim perintah *#readme*')
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const smkr = await slicedArgs.join(' ')
            console.log(smkr)
            try {
            const smkr2 = await axios.get('https://api.vhtear.com/starmakerdl?link=' + smkr + '&apikey=' + vhtearkey)
            const { image, desc, url, title } = smkr2.data.result
            const smkr3 = `*User Ditemukan!*

➸ *Judul:* ${title}
➸ *Deskripsi:* ${desc}`

            const pictk = await bent("buffer")(image)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, 'image.jpg', 'nihh mhank')
            client.sendFileFromUrl(from, url, `${title}.mp4`, '', id)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
           }
          break

        case '#joox':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            /* if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id) */
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#joox [optional]*\nContoh : *#joox Alan Walker*', id)
            client.reply(from, mess.wait, id)
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const music = await slicedArgs.join(' ')
            console.log(music)
            try {
            const music2 = await axios.get('hhttps://api.vhtear.com/music?query=' + music + '&apikey=' + vhtearkey)
            const { penyanyi, judul, album, linkImg, linkMp3, filesize, duration } = music2.data.result[0]
            const musik = `*User Ditemukan!*

➸ *Penyanyi:* ${penyanyi}
➸ *Judul:* ${judul}
➸ *Album:* ${album}
➸ *Size:* ${filesize}
➸ *Durasi:* ${duration}`

            const pictk = await bent("buffer")(linkImg)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            client.sendImage(from, base64, judul, musik)
            client.sendFileFromUrl(from, linkMp3, `${judul}.mp3`, '', id)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, User tidak ditemukan')
           }
          break

        case '#linkgrup':
        case '#linkgroup':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isLimit(serial)) return client.reply(from, `_Hai ${pushname} Limit request anda sudah mencapai batas, Akan direset kembali setiap jam 9 dan gunakan seperlunya!_`, id)
            
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
                client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            }
            await client.sendSeen(from)
            break   

        case '#covidindo':
            rugaapi.covidindo()
            .then(async (res) => {
                await client.reply(from, `${res}`, id)
            })
            break
        case '#alay':
            if (args.length == 1) return client.reply(from, `Mengubah kalimat menjadi alayyyyy\n\nketik ${prefix}alay kalimat`, id)
            rugaapi.bapakfont(body.slice(6))
            .then(async(res) => {
                await client.reply(from, `${res}`, id)
            })
            break
        case '#movie':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari suatu movie dari website sdmovie.fun\nketik: ${prefix}movie judulnya`, id)
            rugaapi.movie((body.slice(7)))
            .then(async (res) => {
                if (res.status == 'error') return client.reply(from, res.hasil, id)
                await client.sendFileFromUrl(from, res.link, 'movie.jpg', res.hasil, id)
            })
            break
        case '#sreddit':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari gambar di sub reddit\nketik: ${prefix}sreddit [search]\ncontoh: ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            await client.sendFileFromUrl(from, hasilreddit, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case '#images':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Untuk mencari gambar di pinterest\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            await client.sendFileFromUrl(from, hasilwall, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case 'speed':
        case '#speed':
        case 'ping':
            const timestamp1 = speed()
            const latensi1 = speed() - timestamp1
            await client.sendText(from, `Pong!!!!\nSpeed: ${latensi1.toFixed(3)} _Second_`)
            break

        case '#brainly':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id) */
           
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('|')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `➣ *Pertanyaan* : ${tanya.split('.')[0]}\n\n➣ *Jumlah jawaban* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `➣ *Pertanyaan* : ${x.pertanyaan}\n\n➣ *Jawaban* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `➣ *Pertanyaan* : ${x.pertanyaan}\n\n➣ *Jawaban* 〙: ${x.jawaban.judulJawaban}\n\n➣ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n!brainly [pertanyaan] [|jumlah]\n\nEx : \n!brainly NKRI |2', id)
            }
            await client.sendSeen(from)
            break

        case '#quotemaker':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = arg[1]
                const author = arg[2]
                const theme = arg[3]
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','neh...').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, 'Usage: \n#quotemaker |teks|watermark|theme\n\nEx :\n#quotemaker |ini contoh|bicit|random', id)
            }
            break

        case '#bc':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ Info ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break

        case '#adminlist':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await sleep(2000)
            await client.sendTextWithMentions(from, mimin)
            break

        case '#ownergroup':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break

        case '#otagall':
        case '#omentionall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const groupMek = await client.getGroupMembers(groupId)
            let heho = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMek.length; i++) {
                heho += '╠➥'
                heho += ` @${groupMek[i].id.replace(/@c.us/g, '')}\n`
            }
            heho += '╚═〘 RIDHO BOT 〙✪══'
            await sleep(2000)
            await client.sendTextWithMentions(from, heho)
            break

        case '#tagall':
        case '#mentionall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 RIDHO BOT 〙✪══'
            await sleep(2000)
            await client.sendTextWithMentions(from, hehe)
            break

        case prefix+'group':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (args.length === 1) return client.reply(from, 'Pilih open atau close!', id)
            if (args[1].toLowerCase() === 'open') {
                client.setGroupToAdminsOnly(groupId, false)
                client.sendTextWithMentions(from, `Group telah dibuka oleh admin @${sender.id.replace('@c.us','')}\nSekarang *semua member* dapat mengirim pesan`)
            } else if (args[1].toLowerCase() === 'close') {
                client.setGroupToAdminsOnly(groupId, true)
                client.sendTextWithMentions(from, `Group telah ditutup oleh admin @${sender.id.replace('@c.us','')}\nSekarang *hanya admin* yang dapat mengirim pesan`)
            } else {
                client.reply(from, 'Pilih open atau disable close!', id)
            }
            break

        case '#okickall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (ownerNumber.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            client.reply(from, 'Succes kick all member', id)
            break

        case '#kickall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMek = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMek.length; i++) {
                if (adminNumber.includes(allMek[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMek[i].id)
                }
            }
            client.reply(from, 'Succes kick all member', id)
            break
        case '#leaveall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', id)
            break

        case '#clearall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', id)
            break

        case '#ban':
            if (!isAdmin) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin RIDHO BOT!', id)
                for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Succes ban target!',id)
            }
            if (args[0] == 'del') {
                let xnxx = banned.indexOf(args[1]+'@c.us')
                banned.splice(xnxx,1)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Success unbanned target!')
            }
            break

        case '#unban':
            if (!isAdmin) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin ridho!', id)
                let xnxx = banned.indexOf(args[0]+'@c.us')
                banned.splice(xnxx, 0)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                client.reply(from, 'Unbanned User!', id)
            break

        case '#block':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id) 
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                let unblock = `${mentionedJidList[i]}`
                await client.contactBlock(unblock).then((a)=>{
                    console.log(a)
                    client.reply(from, `Success block ${args[1]}!`, id)
                })
            }
            break

        case '#unblock':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                let unblock = `${mentionedJidList[i]}`
                await client.contactUnblock(unblock).then((a)=>{
                    console.log(a)
                    client.reply(from, `Success unblok ${args[1]}!`, id)
                })
            } 
            break

        case '#delblock':
            if(!isOwner) return client.reply(from, `Anda siapa? Hanya owner yang dapat melakukannya! 😏`, id)
            if (args.length === 1) return client.reply(from, `Mau unblock siapa nich??`, id)
            if(args.length == 2){
                let unblock = `${args[1]}@c.us`
                await client.contactUnblock(unblock).then((a)=>{
                    console.log(a)
                    client.reply(from, `Sukses unblok ${args[1]}!`, id)
                })
            } 
            await client.sendSeen(from)
            break

        case '#oadd':
            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break

        case '#add':
            const orgh = args[1]
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#add* 628xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await client.addParticipant(from,`${orgh}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break

        case '#okick':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#okick* @tagmember', id)
            await client.sendText(from, `Perintah Owner diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (ownerNumber.includes(mentionedJidList[i])) return client.reply(from, mess.error.Sp, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break

        case '#kick':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *#kick* @tagmember', id)
            await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Sp, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break

        case '#oleave':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            await client.sendText(from,'LAWLIET DIPERINTAHKAN KELUAR OLEH OWNER!!').then(() => client.leaveGroup(groupId))
            break

        case '#leave':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break

        case '#opromote':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah Owner diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break

        case '#promote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break

        case '#odemote':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah Owner diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break

        case '#demote':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *#demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break

        case '#join':
            if (args.length === 1) return client.reply(from, 'Hanya Owner yang bisa memasukan Bot ke dalam Grup!', id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const link = body.slice(6)
            const tGr = await client.getAllGroups()
            const minMem = 5
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Ini link? 👊🤬', id)
            if (tGr.length > 256) return client.reply(from, 'Maaf jumlah group sudah maksimal!', id)
            if (check.size < minMem) return client.reply(from, 'Member group tidak melebihi 5, bot tidak bisa masuk', id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk!', id))
            } else {
                client.reply(from, 'Link group tidak valid!', id)
            }
            break

        case '#odelete':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isOwner, !isAdmin) return client.reply(from, 'Perintah ini hanya untuk Owner & Admin bot', id)
            if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *#delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '#ridhogroup':
        case '#ridogroup':
        case '#groupridho':
        case '#grupridho':
            client.reply(from, `Link Group RIDHO BOT
            group 1 : https://chat.whatsapp.com/Kjv5IWzNIeCBSaH4lJKX8v
            group 2 : https://chat.whatsapp.com/LX1nAiZUuB5FmTCMwe0o4g\nJangan Lupa Join Ya Kak ${pushname}`, id)
            break

         case '#sosmed':
            client.reply(from, `*SOSIAL MEDIA OWNER YANG DAPAT DI IKUTI*
YOUTUBE    : https://youtube.com/c/lowoijo/
INSTAGRAM  : https://instagram.com/ridho_setiawan02/
WHATSAPP   : https://wa.me/6281289096745\nJangan Lupa bantu subscribe follow ya ${pushname}`, id)
            break    

        case '#delete':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *#delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '#getses':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)            
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', 'Nih boss', id)
            break

        case '#nulis':
            if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
            if (args.length == 1) return client.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis i love you 3000`, id)
            const nulisq = body.slice(7)
            const nulisp = await rugaapi.tulis(nulisq)
            await client.sendImage(from, `${nulisp}`, '', 'Nih...', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#lirik':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length == 1) return client.reply(from, 'Kirim perintah *#lirik [optional]*, contoh *#lirik aku bukan boneka*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            client.reply(from, lirik, id)
            break

        case '#chord':
            if (args.length == 1) return client.reply(from, `Untuk mencari lirik dan chord dari sebuah lagu\bketik: ${prefix}chord [judul_lagu]`, id)
            const chordq = body.slice(7)
            const chordp = await rugaapi.chord(chordq)
            await client.reply(from, chordp, id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#ridhoadmin':
            let admn = `This is list of ridho Admin\nTotal : ${adminNumber.length}\n`
            for (let i of adminNumber) {
                admn += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, admn, id)
            break

        case '#listgroup':
                client.getAllGroups().then((res) => {
                let berhitung1 = 1
                let gc = `*This is list of group* :\n`
                for (let i = 0; i < res.length; i++) {
                    gc += `\n═════════════════\n\n*No : ${i+1}*\n*Nama* : ${res[i].name}\n*Pesan Belum Dibaca* : ${res[i].unreadCount} chat\n*Tidak Spam* : ${res[i].notSpam}\n`
                }
                client.reply(from, gc, id)
            })
            break

        case '#listblock':
            //if(!isOwner) return client.reply(from, 'Perintah ini hanya untuk owner bot!', id)
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, hih, id)
            break

        case '#ping':
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            const timestamp = speed()
            const latensi = speed() - timestamp
            client.sendText(from, `Penggunaan RAM: *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*\nCPU: *${os.cpus().length}*\n\nStatus :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats\n- *${daftar.length}* Total Pendaftar\n\nSpeed: ${latensi.toFixed(3)} _Second_`)
            break

        case '#bcgc':
                if (!isOwner) return client.reply(from, `Khusus owner aja yoo`, id)
                await client.getAllGroups().then((ez) => {
                    let ideh = ``
                    for (let i = 0; i < ez.length; i++) {
                        client.sendText(ez[0].id, '')
                     } 
                })
            break

        case `${prefix}sth`:
                    if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
                    const stha = body.slice(5)
                    if (stha.length > 10) return client.reply(from, 'Teksnya kepanjangan sayang', id)
                    client.reply(from, mess.wait, id)
                    client.sendFileFromUrl(from, "https://api.vhtear.com/hartatahta?text=" + stha + "&apikey=" + vhtearkey)
                    break
        case `${prefix}bp`:
                    if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
                    const sthaa = body.slice(4)
                    if (sthaa.length > 10) return client.reply(from, 'Teksnya kepanjangan sayang', id)
                    client.reply(from, mess.wait, id)
                    client.sendFileFromUrl(from, "https://api.vhtear.com/blackpinkicon?text=" + sthaa + "&apikey=" + vhtearkey)
                    break

        case '#edotensei':
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Fitur untuk menghapus member lalu menambahkan member kembali,kirim perintah #edotensei @tagmember', id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                if (ownerNumber.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
                await sleep(3000)
                await client.addParticipant(from,`${mentionedJidList}`)
            } 
            break

        case '#wait':
             if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
             if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id) 
             if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
             if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            const tutor = 'https://i.ibb.co/Hp1XGbL/a4dec92b8922.jpg'
            await limitAdd(serial)
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        client.reply(from, 'Maaf, saya tidak tau ini anime apa', id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFileFromUrl(from, tutor, 'Tutor.jpg', 'Neh contoh mhank!', id)
            }
            break

        case `${prefix}ttps`:
                    if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
                    if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
                    if (quotedMsg) {
                        const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
                        aksa.sendStickerfromUrl(from, `https://api.vhtear.com/textmaker?text=${quoteText}&warna=white&apikey=${vhtearkey}`)
                    } else {
                        const bjbjbjaa = body.slice(5)
                        client.sendStickerfromUrl(from, `https://api.vhtear.com/textmaker?text=${bjbjbjaa}&warna=white&apikey=${vhtearkey}`)
                    }
                    break

        case '#ttp2':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#ttp2 [ Teks ]*, contoh *#ttp2 ridho*`, id)
            const ttp2t = body.slice(6)
            const lttp2 = ["Orange","White","Green","Black","Purple","Red","Yellow","Blue","Navy","Grey","Magenta","Brown","Gold"]
            const rttp2 = lttp2[Math.floor(Math.random() * (lttp2.length))]
            await client.sendStickerfromUrl(from, `https://api.vhtear.com/textmaker?text=${ttp2t}&warna=${rttp2}&apikey=${vhtearkey}`)
            break
        case '#ttg':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
            if (!isGroupMsg) return client.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            try {
                if (quotedMsgObj == null) {
                    if (args.length === 1) return client.reply(from, `Kirim perintah *#ttg [ Teks ]*, contoh *#ttg aku bukan boneka*`, id)
                        await client.sendStickerfromUrl(from, `https://api.vhtear.com/textxgif?text=${body.slice(5)}&apikey=${vhtearkey}`)
                        limitAdd(serial)
                } else {
                    await client.sendStickerfromUrl(from, `https://api.vhtear.com/textxgif?text=${quotedMsgObj}&apikey=${vhtearkey}`)
                    limitAdd(serial)
                }
            } catch(e) {
                console.log(e)
                client.reply(from, 'Maaf, Server sedang Error')
            }
            break

        case prefix+'lovemessage':
            if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}lovemessage [ Teks ]*, contoh *${prefix}lovemessage ridho*`, id)
            client.reply(from, mess.wait, id)
            const lovemsg = body.slice(12)
            if (lovemsg.length > 10) return client.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await client.sendFileFromUrl(from, `https://api.vhtear.com/lovemessagetext?text=${lovemsg}&apikey=${vhtearkey}`, 'lovemsg.jpg', '', id)
            break

        case prefix+'romance':
            if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}romance [ Teks ]*, contoh *${prefix}romance ridho*`, id)
            client.reply(from, mess.wait, id)
            const rmnc = body.slice(9)
            if (rmnc.length > 10) return client.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await client.sendFileFromUrl(from, `https://api.vhtear.com/romancetext?text=${rmnc}&apikey=${vhtearkey}`, 'romance.jpg', '', id)
            break

        case prefix+'party':
            if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}party [ Teks ]*, contoh *${prefix}party ridho*`, id)
            client.reply(from, mess.wait, id)
            const prty = body.slice(7)
            if (prty.length > 10) return client.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await client.sendFileFromUrl(from, `https://api.vhtear.com/partytext?text=${prty}&apikey=${vhtearkey}`, 'party.jpg', '', id)
            break

        case prefix+'silk':
            if (args.length === 1) return client.reply(from, `Kirim perintah *${prefix}silk [ Teks ]*, contoh *${prefix}silk ridho*`, id)
            client.reply(from, mess.wait, id)
            const slkz = body.slice(5)
            if (slkz.length > 10) return client.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await client.sendFileFromUrl(from, `https://api.vhtear.com/silktext?text=${slkz}&apikey=${vhtearkey}`, 'silk.jpg', '', id)
            break

        case '#runtime':
            function format(seconds){
            function pad(s){
            return (s < 10 ? '0' : '') + s;
            }
            var hours = Math.floor(seconds / (60*60));
             var minutes = Math.floor(seconds % (60*60) / 60);
             var seconds = Math.floor(seconds % 60);
             return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
              }
            var uptime = process.uptime();
            client.reply(from, `\n\n*BOT TELAH BERJALAN SELAMA*\n\n*TIME : ${format(uptime)} ✨*\n\n`, id)
            break

        case '#listprem':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            let lv = `Ini adalah list User premium RIDHO BOT\nTotal : ${premiumNumber.length}\n`
            for (let i of premiumNumber) {
                lv += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, lv, id)
            break

        case '#nekopoi':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isNsfw) return client.reply(from, 'command/Perintah NSFW belum di aktifkan di group ini!', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#nekopoi [linkNekopoi]*\nContoh : *#nekopoi https://nekopoi.care/tsunpuri-episode-1-subtitle-indonesia/*', id)
            try {
            client.reply(from, mess.wait, id)
            const nekipoi = await axios.get('https://mhankbarbars.herokuapp.com/api/nekopoi?url=' + body.slice(7) + '&apikey=' + vhtearkey)
            const nekop = nekipoi.data.result
            const nekop2 = `*Anime Ditemukan!*\n➸ Judul : ${nekop.judul}\n➸ Dilihat : ${nekop.dilihat}\n➸ Info : ${nekop.info}`
            const image = await bent("buffer")(nekop.thumbnail)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, judul, nekop2)
            } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Video tidak ditemukan')
             client.sendText(ownerNumber, 'Nekopoi Error : ' + err)
            }
            break

        case '#subreddit':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            arg = body.trim().split(' ')
            const sr = arg[1]
            try {
            const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + sr + '/');
            const { postLink, title, subreddit, url, nsfw, spoiler } = response1.data
                if (nsfw == true) {
                    if ((isGroupMsg) && (isNsfw)) {
                        await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `*Title*: ${title}` + '\n\n*Postlink*:' + `${postLink}`)
                    } else if ((isGroupMsg) && (!isNsfw)) {
                        await client.reply(from, `Nsfw belum diaktifkan di Grup *${name}*`, id)
                    }
                } else { 
                    await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `*Title*: ${title}` + '\n\n*Postlink*:' + `${postLink}`)
                }
            } catch(err) {
                await client.sendFileFromUrl(from, errorurl, id) 
            }
            break

        case '#reader': 
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
           if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)                
           if (!quotedMsg) return client.reply(from, 'Balas/reply pesan saya kak', id)
           if (!quotedMsgObj.fromMe) return client.reply(from, 'Balas/reply pesan saya kak', id)
           {
           const reader = await client.getMessageReaders(quotedMsgObj.id)
           let list = ''
           for (let pembaca of reader) {
           list += `- @${pembaca.id.replace(/@c.us/g, '')}\n` 
             }
           client.sendTextWithMentions(from, `nah. ini nih sider mau nimbrung apa gua kick\n${list}`)
           }
           break

        case '#pink':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
             if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
             if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
             const jrenge = body.slice(6)
             if (!jrenge) return client.reply(from, 'Kirim perintah #pink [teks]\n\nContoh #pink erdwpe', id)
             if (jrenge.length > 7) return client.reply(from, 'Maksimal 7 Huruf!', id)
             client.sendText(from, 'Sedang diproses, mohon tunggu sebentar!...', id)
             await client.sendFileFromUrl(from, `https://api.vhtear.com/blackpinkicon?text=${jrenge}&apikey=${vhtearkey}`,`${jrenge}.jpg`,`dah jadi gan`, id)        
             break
        case `#thunder`:
                if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
                if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya dapat digunakan didalam Group', id)
                if (args.length === 1)return client.reply(from, `Kirim perintah ${prefix}thunder [text].\nContoh: ${prefix}thunder ridho`, id)
                if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis.`, id)
                const th = body.slice(9)
                const tu = `https://api.vhtear.com/thundertext?text=${th}&apikey=${vhtearkey}`
                client.reply(from, 'Tunggu sebentar!.', id)
                await client.sendFileFromUrl(from, tu, 'Thunder.jpg', 'Nih Kak...', id)
                await limitAdd(serial)
                break
        case '#graffity':
        if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
        if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
        const graffity = body.slice(10)
        const graffitystrz = await get.get('http://inyourdream.herokuapp.com/graffity?kata=' + graffity).json()
        client.sendFileFromUrl(from, graffitystrz.status, id)
        break
        case '#katacinta':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
            fetch('https://raw.githubusercontent.com/beniismael/whatsapp-bot/master/bucin.txt')
            .then(res => res.text())
            .then(body => {
                let splitcinta = body.split('\n')
                let randomcinta = splitcinta[Math.floor(Math.random() * splitcinta.length)]
                client.reply(from, randomcinta, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case `${prefix}babi`:
                    const gmek = await client.getGroupMembersId(groupId)
                    let gmik = gmek[Math.floor(Math.random() * gmek.length)]
                    const mmkk = `YANG PALING BABI DISINI ADALAH @${gmik.replace(/@c.us/g, '')}`
                    client.sendTextWithMentions(from, mmkk, id)
                    break

        case `${prefix}ganteng`:
                    const gmekk = await client.getGroupMembersId(groupId)
                    let gmikk = gmekk[Math.floor(Math.random() * gmekk.length)]
                    const mmkkkk = `YANG PALING GANTENG DISINI ADALAH @${gmikk.replace(/@c.us/g, '')}`
                    client.sendTextWithMentions(from, mmkkkk, id)
                    break

        case `${prefix}cantik`:
                    const gme = await client.getGroupMembersId(groupId)
                    let gm = gmekk[Math.floor(Math.random() * gme.length)]
                    const mmkkkkk = `YANG PALING CANTIK DISINI ADALAH @${gm.replace(/@c.us/g, '')}`
                    client.sendTextWithMentions(from, mmkkkkk, id)
                    break

        case '#shopee':
                if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
                if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik _limit Untuk Mengecek Kuota Limit Kamu`, id)
                
                await limitAdd(serial)
                if (args.length === 1) return client.reply(from, 'Kirim perintah *_shopee [query]*, Contoh : *_shopee HP Samsul a20*', id)
                const shopek = body.slice(8)
                client.reply(from, mess.wait, id)
                try {
                    const dataplai = await axios.get(`https://api.vhtear.com/shopee?query=${shopek}&count=5&apikey=${vhtearkey}`)
                    const dataplay = dataplai.data.result
                     let shopeq = `*Hasil Pencarian : ${shopek}*\n`
                    for (let i = 0; i < dataplay.items.length; i++) {
                        shopeq += `\n═════════════════\n\n*Nama* : ${dataplay.items[i].nama}\nHarga* : ${dataplay.items[i].harga}\n*Terjual* : ${dataplay.items[i].terjual}\n*Lokasi Toko* : ${dataplay.items[i].shop_location}\n*Deskripsi* : ${dataplay.items[i].description}\n*Link Product : ${dataplay.items[i].link_product}*\n`
                    }
                    await client.sendFileFromUrl(from, dataplay.items[0].image_cover, `shopee.jpg`, shopeq, id)
                }   catch (err){
                    console.log(err)
                }
                break

        case '#zodiak':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#zodiak [zodiak kamu]*\nContoh : *#zodiak scorpio*', id)
            try {
            const resp = await axios.get('https://api.vhtear.com/zodiak?query=' + body.slice(8) + '&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Zodiak : ${resp.data.result.zodiak}\n➸ Ramalan : ${resp.data.result.ramalan}\n➸ Nomor Keberuntungan : ${resp.data.result.nomorKeberuntungan}\n➸ Motivasi : ${resp.data.result.motivasi}\n➸ Inspirasi : ${resp.data.result.inspirasi}`
            client.reply(from, anm2, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Zodiak tidak ditemukan')
                client.sendText(ownerNumber, 'Zodiak Error : ' + err)
           }
           break

        case '#tebakgambar':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)  
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            try {
            const resp = await axios.get('https://api.vhtear.com/tebakgambar&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`
            client.sendFileFromUrl(from, resp.data.result.soalImg, 'tebakgambar.jpg', '_Silahkan Jawab Maksud Dari Gambar Ini_', id)
            client.sendText(from, `30 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            client.reply(from, jwban, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                client.sendText(ownerNumber, 'Tebak Gambar Error : ' + err)
           }
           break

        case '#heroml':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#heroml [nama hero]*\nContoh : *#heroml akai*', id)
            try {
            const resp = await axios.get('https://api.vhtear.com/herodetail?query=' + body.slice(8) + '&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Title : ${resp.data.result.title}\n➸ Quotes : ${resp.data.result.quotes}\n➸ Info : ${resp.data.result.info}\n➸ Atribut : ${resp.data.result.attributes}`
            client.sendFileFromUrl(from, resp.data.result.pictHero, 'hero.jpg', anm2, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Hero tidak ditemukan')
                client.sendText(ownerNumber, 'Heroml Error : ' + err)
           }
            break

        case '#tahta':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)  
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
    
             await limitAdd(serial)
             const jreng = body.slice(7)
             if (!jreng) return client.reply(from, 'Kirim perintah *#tahta [teks]*\n\nContoh *#tahta RIDHO BOT*', id)
             if (jreng.length > 7) return client.reply(from, 'Maksimal 7 Huruf!', id)
             client.sendText(from, '_Sedang diproses, mohon tunggu sebentar!..._', id)
             await client.sendFileFromUrl(from, `https://api.vhtear.com/hartatahta?text=${jreng}&apikey=${vhtearkey}`,`${jreng}.jpg`,`Harta Tahta ${jreng}`, id)        
             break


        case `${prefix}unreg`: //menghapus nomor dari database
                    if (!isOwner) return client.reply(from, 'Fitur ini hanya dapat digunakan oleh Owner ridho')
                    if (args.length === 1) return aksa.reply(from, 'Masukkan nomornya, *GUNAKAN AWALAN 62* contoh: 6281289096745')
                    let inx = daftar.indexOf(args[1] + '@c.us')
                    daftar.splice(inx, 1)
                    fs.writeFileSync('./lib/daftar.json', JSON.stringify(daftar))
                    client.reply(from, 'Sukses menghapus nomor from database', id)
                    break

        case `${prefix}yourpic`:
                    if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
                    if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        var ypic = await client.getProfilePicFromServer(mentionedJidList[i])
                        if (ypic === undefined) {
                            var ypfp = errorurl
                        } else {
                            var ypfp = ypic
                        }
                    }
                    client.sendFileFromUrl(from, ypfp, 'pfpy.jpg', `Nih kak`)
                    break

                case `${prefix}mypic`:
                    if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
                    if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                    const mpic = await client.getProfilePicFromServer(author)
                    if (mpic === undefined) {
                        var mpfp = errorurl
                    } else {
                        var mpfp = mpic
                    }
                    client.sendFileFromUrl(from, mpfp, 'pfpm.jpg', `Nih kak`)
                    break

        case `${prefix}slap`: //thanks to SASHA BOT
                    arg = body.trim().split(' ')
                    const jejiik = author.replace('@c.us', '')
                    await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
                    client.sendTextWithMentions(from, `${prefix}` + jejiik + ' *slapped* ' + arg[1])
                    break
                case `${prefix}hug`: //thanks to SASHA BOT
                    arg = body.trim().split(' ')
                    const janjing = author.replace('@c.us', '')
                    await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif')
                    client.sendTextWithMentions(from, `${prefix}` + janjing + ' *peyuuuk* ' + arg[1])
                    break
                case `${prefix}nye`: //thanks to SASHA BOT
                    arg = body.trim().split('')
                    const jancuk7 = author.replace('@c.us', '')
                    await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/cute-baka-13LunYkkBppSBa/giphy.gif')
                    client.sendTextWithMentions(from, `${prefix}` + jancuk7 + ' *nye nye ' + arg[1])
                    break
                case `${prefix}pat`: //thanks to SASHA BOT
                    arg = body.trim().split(' ')
                    const jartod = author.replace('@c.us', '')
                    await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/Z7x24IHBcmV7W/giphy.gif')
                    client.sendTextWithMentions(from, `${prefix}` + jartod + ' *👈 Si Mengelu-elus si👉* ' + arg[1])
                    break

        case '#math':
             if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id) 
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *#math [ Angka ]*\nContoh : #math 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /', id)
            const mtk = body.slice(6)
            if (typeof Math_js.evaluate(mtk) !== "number") {
            client.reply(from, `"${mtk}", bukan angka!\n[❗] Kirim perintah *#math [ Angka ]*\nContoh : #math 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /`, id)
        } else {
            client.reply(from, `*「 MATH 」*\n\n*Kalkulator*\n${mtk} = ${Math_js.evaluate(mtk)}`, id)
        }
        break

        case '#pornhub':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (args.length === 1) return client.reply(from, `Kirim perintah #pornhub [ |Teks1|Teks2 ], contoh #pornhub |ridho|robot`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
                client.reply(from, mess.wait, id)
                const lpornhub = argz[1]
                const lpornhub2 = argz[2]
                if (lpornhub.length > 10) return client.reply(from, 'Teks1 Terlalu Panjang!\n_Maksimal 10 huruf!_', id)
                if (lpornhub2.length > 10) return client.reply(from, 'Teks2 Terlalu Panjang!\n_Maksimal 10 huruf!_', id)
                client.sendFileFromUrl(from, `https://api.vhtear.com/pornlogo?text1=${lpornhub}&text2=${lpornhub2}&apikey=${vhtearkey}`)
                await limitAdd(serial)
            } else {
                await client.reply(from, `Wrong Format!\n[❗] Kirim perintah #pornhub [ |Teks1|Teks2 ], contoh #pornhub |ridho|robot`, id)
            }
            break

        case '#esticker':
        case '#es':
                    if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id)
                        const emojiUnicode = require('emoji-unicode')
                        const bjbjbja = emojiUnicode(args[1])
                        client.sendStickerfromUrl(from, "https://api.vhtear.com/emojitopng?code="+ bjbjbja +"&apikey=" + vhtearkey)
                        break

        case '#setgroupname':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            const namagrup = body.slice(14)
            let sebelum = chat.groupMetadata.formattedName
            let halaman = global.page ? global.page : await client.getPage()
            await halaman.evaluate((chatId, subject) =>
            Store.WapQuery.changeSubject(chatId, subject),groupId, `${namagrup}`)
            client.sendTextWithMentions(from, `Nama group telah diubah oleh admin @${sender.id.replace('@c.us','')}\n\n• Before: ${sebelum}\n• After: ${namagrup}`)
            break

        case '#getpic':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
            if (!isGroupMsg) return client.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            const texnugm = body.slice(8)
            const getnomber =  await client.checkNumberStatus(texnugm)
            const useriq = getnomber.id.replace('@','') + '@c.us'
                try {
                    var jnck = await client.getProfilePicFromServer(useriq)

                    client.sendFileFromUrl(from, jnck, `awok.jpg`)
                } catch {
                    client.reply(from, `Tidak Ada Foto Profile!`, id)
                }
            break

        case '#setprofilepic':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner ridho bot!`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.setProfilePic(imageBase64)
                client.sendTextWithMentions(`Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.setProfilePic(imageBase64)
                client.sendTextWithMentions(from, `Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else {
                client.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan #setprofilepic`, id)
            }
            break

        case '#setname':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner ridho bot!`, id)
                const setnem = body.slice(9)
                await client.setMyName(setnem)
                client.sendTextWithMentions(from, `Makasih Nama Barunya @${sender.id.replace('@c.us','')} 😘`)
            break

        case '#setstatus':
            if (!isOwner) return client.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner ridho bot!`, id)
                const setstat = body.slice(11)
                await client.setMyStatus(setstat)
                client.sendTextWithMentions(from, `Makasih Status Barunya @${sender.id.replace('@c.us','')} 😘`)
            break

        case '#setgroupicon':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return client.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.setGroupIcon(from, imageBase64)
                client.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.setGroupIcon(from, imageBase64)
                client.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else {
                client.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan #setgroupicon`, id)
            }
            break

    case '#sticker3d':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            //if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)             
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #sticker3d ridho', id)
            client.reply(from, mess.wait, id)
            const textnyi = body.slice(11)
            const gbrnyi = `https://docs-jojo.herokuapp.com/api/text3d?text=${textnyi}`
            client.sendStickerfromUrl(from, gbrnyi)
            break

    case '#stickerpetir':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            //if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)             
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #stickerpetir ridho', id)
            client.reply(from, mess.wait, id)
            const texts = body.slice(14)
            const petirnyi = `https://docs-jojo.herokuapp.com/api/thunder?text=${texts}`
            client.sendStickerfromUrl(from, petirnyi)
            break

    case '#stickerbp':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            //if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)             
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #stickerbp ridho', id)
            client.reply(from, mess.wait, id)
            const textnyu = body.slice(11)
            const bpnyi = `http://docs-jojo.herokuapp.com/api/blackpink?text=${textnyu}`
            client.sendStickerfromUrl(from, bpnyi)
            break

    case '#stickerglitch':
    case '#stickglitch':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            //if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)             
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #stickerglitch ridho|robot', id)
            arg = body.trim().split('|')
            client.reply(from, mess.wait, id)
            const texta = arg[1]
            const textb = arg[2]
            const glitchnyi = `http://docs-jojo.herokuapp.com/api/ttlogo?text1=${texta}&text2=${textb}`
            client.sendStickerfromUrl(from, glitchnyi)
            break

    case '#stickerph':
    case '#stickph':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #stickerph ridho|robot', id)
            arg = body.trim().split('|')
            client.reply(from, mess.wait, id)
            const ph3 = arg[1]
            const ph4 = arg[2]
            const phnyi = `http://docs-jojo.herokuapp.com/api/phblogo?text1=${ph3}&text2=${ph4}`
            client.sendStickerfromUrl(from, phnyi)
            break

    case '#stickerneon':
    case '#stickneon':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (args.length === 1) return client.reply(from, 'kirim perintah dengan contoh #stickerph ridho|robot|bot', id)
            arg = body.trim().split('|')
            client.reply(from, mess.wait, id)
            const textx = arg[1]
            const textt = arg[2]
            const texth = arg[3]
            const neonnyi = `http://docs-jojo.herokuapp.com/api/neon?text1=${textx}&text2=${textt}&text3=${texth}`
            client.sendStickerfromUrl(from, neonnyi)
            break

    case '#sticker2':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (args.length == 0) return client.reply(from, `Untuk mencari sticker dari pinterest\nketik: ${prefix}sticker2 [search]\ncontoh: ${prefix}sticker2 naruto`, id)
            const cariwallu = body.slice(10)
            const hasilwallu = await images.fdci(cariwallu)
            await client.sendStickerfromUrl(from, hasilwallu, '', '', id)
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break

        case '#loli':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
           await limitAdd(serial)
            const loli = await axios.get(`https://api.vhtear.com/randomloli&apikey=${vhtearkey}`)
            const loly = loli.data.result
            client.sendFileFromUrl(from, loly.result, 'loli.jpeg', '*LOLI*', id)
            break

        case '#husbu':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break

         case '#profile':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            var role = 'None'
            //if (isGroupMsg) {
              if (!quotedMsg) {
              var block = banned.includes(author)
              var pic = await client.getProfilePicFromServer(author)
              var namae = pushname
              var sts = await client.getStatus(author)
              var adm = isGroupAdmins
              var donate = isAdmin
              const { status } = sts
               if (pic == undefined) {
               var pfp = errorurl 
               } else {
               var pfp = pic
               } 
             await client.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Ban: ${block}*\n\n➸ *Role: ${role}*\n\n➸ *Admin: ${adm}*\n\n➸ *Special: ${donate}*`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var block = blockNumber.includes(qmid)
             var pic = await client.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.name
             var sts = await client.getStatus(qmid)
             var adm = isGroupAdmins
             var donate = isAdmin
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
             await client.sendFi

             leFromUrl(from, pfp, 'pfo.jpg', `**User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n*➸ Ban: ${block}*\n\n➸ *Role: ${role}*\n\n➸ *Admin: ${adm}*\n\n➸ *Special: ${donate}*`)
            }
            break

        case '#inu':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
           // if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
            break

        case '#qrcode':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
           //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
           if(!args.lenght >= 2) return
           let qrcodes = body.slice(8)
           await client.sendFileFromUrl(from, `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${qrcodes}`, 'gambar.png', 'Process sukses!')
           break

        case '#ptl':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const pptl = ["https://i.pinimg.com/564x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/236x/98/08/1c/98081c4dffde1c89c444db4dc1912d2d.jpg","https://i.pinimg.com/236x/a7/e2/fe/a7e2fee8b0abef9d9ecc8885557a4e91.jpg","https://i.pinimg.com/236x/ee/ae/76/eeae769648dfaa18cac66f1d0be8c160.jpg","https://i.pinimg.com/236x/b2/84/55/b2845599d303a4f8fc4f7d2a576799fa.jpg","https://i.pinimg.com/564x/78/7c/49/787c4924083a9424a900e8f1f4fdf05f.jpg","https://i.pinimg.com/236x/eb/05/dc/eb05dc1c306f69dd43b7cae7cbe03d27.jpg","https://i.pinimg.com/236x/d0/1b/40/d01b40691c68b84489f938b939a13871.jpg","https://i.pinimg.com/236x/31/f3/06/31f3065fa218856d7650e84b000d98ab.jpg","https://i.pinimg.com/236x/4a/e5/06/4ae5061a5c594d3fdf193544697ba081.jpg","https://i.pinimg.com/236x/56/45/dc/5645dc4a4a60ac5b2320ce63c8233d6a.jpg","https://i.pinimg.com/236x/7f/ad/82/7fad82eec0fa64a41728c9868a608e73.jpg","https://i.pinimg.com/236x/ce/f8/aa/cef8aa0c963170540a96406b6e54991c.jpg","https://i.pinimg.com/236x/77/02/34/77023447b040aef001b971e0defc73e3.jpg","https://i.pinimg.com/236x/4a/5c/38/4a5c38d39687f76004a097011ae44c7d.jpg","https://i.pinimg.com/236x/41/72/af/4172af2053e54ec6de5e221e884ab91b.jpg","https://i.pinimg.com/236x/26/63/ef/2663ef4d4ecfc935a6a2b51364f80c2b.jpg","https://i.pinimg.com/236x/2b/cb/48/2bcb487b6d398e8030814c7a6c5a641d.jpg","https://i.pinimg.com/236x/62/da/23/62da234d941080696428e6d4deec6d73.jpg","https://i.pinimg.com/236x/d4/f3/40/d4f340e614cc4f69bf9a31036e3d03c5.jpg","https://i.pinimg.com/236x/d4/97/dd/d497dd29ca202be46111f1d9e62ffa65.jpg","https://i.pinimg.com/564x/52/35/66/523566d43058e26bf23150ac064cfdaa.jpg","https://i.pinimg.com/236x/36/e5/27/36e52782f8d10e4f97ec4dbbc97b7e67.jpg","https://i.pinimg.com/236x/02/a0/33/02a033625cb51e0c878e6df2d8d00643.jpg","https://i.pinimg.com/236x/30/9b/04/309b04d4a498addc6e4dd9d9cdfa57a9.jpg","https://i.pinimg.com/236x/9e/1d/ef/9e1def3b7ce4084b7c64693f15b8bea9.jpg","https://i.pinimg.com/236x/e1/8f/a2/e18fa21af74c28e439f1eb4c60e5858a.jpg","https://i.pinimg.com/236x/22/d9/22/22d9220de8619001fe1b27a2211d477e.jpg","https://i.pinimg.com/236x/af/ac/4d/afac4d11679184f557d9294c2270552d.jpg","https://i.pinimg.com/564x/52/be/c9/52bec924b5bdc0d761cfb1160865b5a1.jpg","https://i.pinimg.com/236x/1a/5a/3c/1a5a3cffd0d936cd4969028668530a15.jpg"]
            let pep = pptl[Math.floor(Math.random() * pptl.length)]
            client.sendFileFromUrl(from, pep, 'pptl.jpg', 'Follow ig : https://www.instagram.com/ptl_repost untuk mendapatkan penyegar timeline lebih banyak', message.id)
            break

        case '#wallanime' :
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', id)
            break

        case '#neko':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
            break

        case '#pokemon':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            //i[f (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
            break
        
        case '#quotes':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
          //  if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const quotes = await get.get('https://mhankbarbars.herokuapp.com/api/randomquotes').json()
            client.reply(from, `➸ *Quotes* : ${quotes.quotes}\n➸ *Author* : ${quotes.author}`, id)
            break

        case '#quotesnime':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
           // if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const skya = await get.get('https://mhankbarbars.herokuapp.com/api/quotesnime/random').json()
            skya_ = skya.data
            client.reply(from, `➸ *Quotes* : ${skya_.quote}\n➸ *Character* : ${skya_.character}\n➸ *Anime* : ${skya_.anime}`, id)
            break

        case '#meme':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
           // if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break

        case '#bug':
            /* if (!isGroupMsg) return client.reply(from, 'Bot sekarang hanya bisa digunakan digrup saja! untuk dimasukan ke grup bot ini sifatnya berbayar, konfirmasi ke owner bot wa.me/6282235205986 untuk pertanyaan lebih lanjut', id)         */
            if (args.length === 1) return client.reply(from, `Kirim laporan bug dengan cara ketik perintah :\n*#bug* _Ketik pesan_\nContoh :\n*!bug* _Bug di perintah !musik tolong fix_`, id)
            const ygingin = body.slice(5)
            await client.sendText(ownerNumber, `*BUG!!!* :\n\n*From* ${pushname}\n*Grup* : ${name}\n*WA* : wa.me/${sender.id.replace('@c.us','')}\n*Message From* : ${from}\n*Message ID* : ${id}\n*Content* : ${ygingin}\n*TimeStamp* : ${time}`)
            client.reply(from, `_[DONE] Laporan telah terkirim, mohon kirim laporan dengan jelas atau kami tidak akan menerima laporan tersebut sebagai bug!_`, id)
            await client.sendSeen(from)
            break

        case '#pesan':
        if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *#pesan [teks]*\ncontoh : *#pesan hai bg, tolong save nomor ku bg😁*', id)
        const pesan1 = body.slice(7)
        if(!pesan1) return
        if (isGroupMsg){
            client.sendText(ownerNumber, `*[PESAN]*\n*WAKTU : ${time}*\n*NO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}*\n*GROUP : ${formattedTitle}*\n\n*ISI PESAN : ${pesan1}*`)
            client.reply(from, '*PESAN ANDA AKAN SEGERA DI TANGGAPI OLEH OWNER*.' ,id)
        }else{
            client.sendText(ownerNumber, `*[PSAN]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\n\n*ISI PESAN : ${pesan1}*`)
            client.reply(from, '*PESAN ANDA AKAN SEGERA DI TANGGAPI OLEH OWNER*.', id)
        }
        break

        case '#toxic':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            console.log(`Auto Toxic Sedang Dibuat.`)
            toxic().then(toxic => {
                let msg = `${toxic}`
                client.reply(from, msg, id).then(() => {
                console.log(`Auto Toxic Telah Dikirim. Loaded Processed for ${processTime(moment())} Second`)
                }).catch((err) => console.log(err))
            })
            break

        case '#cat':
                if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
                q2 = Math.floor(Math.random() * 900) + 300;
                q3 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','')
                break

           case '#caklontong':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id) 
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            try {
            const resp = await axios.get('https://api.vhtear.com/funkuis&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Soal : ${resp.data.result.soal}\n➸ Deskripsi : ${resp.data.result.desk}\n➸ Poin : ${resp.data.result.poin}`
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`
            client.reply(from, anm2, id)
            client.sendText(from, `30 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            client.reply(from, jwban, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                client.sendText(ownerNumber, 'Zodiak Error : ' + err)
           }
           break

        case '#family100':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id) 
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            try {
            const resp = await axios.get('https://api.vhtear.com/family100&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Soal : ${resp.data.result.soal}\n_Silahkan DiJawab_`
            const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`
            client.reply(from, anm2, id)
            client.sendText(from, `30 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `20 Detik Lagi...`, id)
            await sleep(10000)
            client.sendText(from, `10 Detik Lagi...`, id)
            await sleep(10000)
            client.reply(from, jwban, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Soal Quiz tidak ditemukan')
                client.sendText(ownerNumber, 'Family100 Error : ' + err)
           }
           break

        case '#nomorhoki':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#nomorhoki [no hp kamu]*\nContoh : *#nomorhoki 081289096745*', id)
            try {
            const resp = await axios.get('https://api.vhtear.com/nomerhoki?no=' + body.slice(11) + '&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Hasil :\n ${resp.data.result.hasil}`
            client.reply(from, anm2, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Nomor Hoki tidak ditemukan')
                client.sendText(ownerNumber, 'Nomorhoki Error : ' + err)
           }
            break

        case '#artimimpi':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#artimimpi [mimpi]*\nContoh : *#artimimpi ular*', id)
            try {
            const resp = await axios.get('https://api.vhtear.com/artimimpi?query=' + body.slice(10) + '&apikey=' + vhtearkey)
            if (resp.data.error) return client.reply(from, resp.data.error, id)
            const anm2 = `➸ Artimimpi : ${resp.data.result.hasil}`
            client.reply(from, anm2, id)
            } catch (err) {
                console.error(err.message)
                await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Maaf, Mimpi tidak ditemukan')
                client.sendText(ownerNumber, 'Artimimpi Error : ' + err)
           }
            break

        case `${prefix}ptlvid`:
                if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)           
                if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
                if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                    client.reply(from, mess.wait, id)
                    const ditai = fs.readFileSync('./lib/asupan.json')
                    const ditaiJsin = JSON.parse(ditai)
                    const rindIndixa = Math.floor(Math.random() * ditaiJsin.length)
                    const rindKiya = ditaiJsin[rindIndixa]
                    client.sendFileFromUrl(from, rindKiya, 'asupan.mp4', 'Nih', id)
                    break

        case '#kbbi':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 1) return client.reply(from, `Kirim perintah *#kbbi [ Query ]*\nContoh : *#kbbi asu*`, id)
            const kbbl = body.slice(6)
            const kbbl2 = await axios.get(`https://api.vhtear.com/kbbi?query=${kbbl}&apikey=${vhtearkey}`)

            if (kbbl2.data.error) {
                client.reply(from, kbbl2.data.error, id)
            } else {
                client.sendText(from, `*「 KBBI 」*\n\n➸ *Query* : ${kbbl}\n\n➸ *Result* : ${kbbl2.data.result.hasil}`, id)
                await limitAdd(serial)
            }
            break

        case '#shorturl':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isPrem) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh user premium, untuk upgrade hubungi owner ketik *_#owner_*', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return client.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu`, id)           
            await limitAdd(serial)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *#shorturl [linkWeb]*\nContoh : *#shorturl https://neonime.vip*', id)
            const surl = await axios.get('https://api.vhtear.com/shortener?link=' + body.slice(10) + '&apikey=' + vhtearkey)
            const surll = surl.data
            if (surll.error) return client.reply(from, ssww.error, id)
            const surl2 = `Link : ${surll.result.Url}\nShort URL : ${surll.result.Short}`
            client.sendText(from, surl2, id)
            break

        case '#wa.me':
        case '#wame':
        if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
        await client.reply(from, `*Neh Mhank Link Nomor Wa Lu ${pushname}*\n\n*wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n\n*Atau*\n\n*api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*`, id)
            break

        case '#kpop':
            if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
            if (args.length == 1) return client.reply(from, `Untuk menggunakan #kpop\nSilahkan ketik: #kpop [query]\nContoh #kpop bts\n\nquery yang tersedia:\nblackpink, exo, bts`, id)
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    client.sendFileFromUrl(from, randomkpopx, '', 'Nee..', id)
                })
            } else {
                client.reply(from, `Maaf query tidak tersedia. Silahkan ketik #kpop untuk melihat list query`)
            }
            break   

        case 'makasih':
        case 'thanks':
            return client.reply(from, `Sama-Sama Bor`)
            break   

        case '#berita':
        if (!isPrem) return client.reply(from, `${ubah}Perintah ini hanya untuk user premium! hubungi owner untuk upgrade premium atau ketik #owner${ubah}`, id) 
        if (isLimit(serial)) return client.reply(from, `${ubah}Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik #limit Untuk Mengecek Kuota Limit Kamu${ubah}`, id)
        const respons = await axios.get('http://newsapi.org/v2/top-headlines?country=id&apiKey=b2d3b1c264c147ae88dba39998c23279')
        const { totalResults, articles } = respons.data
        res = totalResults
        if (args[1] >= totalResults) {
            res = totalResults
          } else {
            res = args[1]
          }
          i = 0
          pesan = '_*Berita Terbaru Hari Ini*_\n\n'
          for (const isi of articles) {
            i++
            pesan = pesan + i + '. ' + '_' + isi.title + '_' + '\n' + isi.publishedAt + '\n' + isi.description + '\n' + isi.url
            if (i<res) {
              pesen = pesan + '\n\n'
            } else if(i > res){
              break
            }
          }
          await client.sendText(from, pesan)
          break 
        case '#spek':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            const iscas = await client.getIsPlugged() ? "charging 🔌" : "not charging 💻"
            const MyPhone = await client.getMe()
            client.sendText(from, `*INFORMASI:*\n🔋BATTERY : ${MyPhone.battery}% ${iscas}\n💻HOST : ${os.hostname()}\n📱DEVICE : ${MyPhone.phone.device_manufacturer}\n🖥PLATFORM : ${os.platform()}\n\n`, id)
            break

        case '#daftar':
             if (args.length === 1) return client.reply(from, '*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#*daftar 6281289096745|ridho|17* \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX!_*', id)
            let datadaftar = JSON.parse(fs.readFileSync('./lib/daftar.json', 'utf8'))
            const no = sender.id.replace(/[@c.us]/g,'')
            const istelahdaftar = datadaftar.includes(sender.id) ? false : true
            if(!istelahdaftar) return client.reply(from, 'ANDA TELAH TERDAFTAR!', id)
            tgl = new Date().getDate()
            bln = new Date().getMonth()
            thn = new Date().getFullYear()
            const chati = await client.getAllChatIds()
            const group = await client.getAllGroups()
          nomor = body.slice(8).split('|')[0]
          nama = body.split('|')[1]
          umur = body.split('|')[2]
           var pict = await client.getProfilePicFromServer(no)
           var namao = pushname
           var sts = await client.getStatus(sender.id)
            const status = sts
            console.log(sts)
            {
            daftar.push(no+'@c.us')
            fs.writeFileSync('./lib/daftar.json', JSON.stringify(daftar))
            client.sendFileFromUrl(from, pict, 'pfp.jpg', `*DAFTAR SUKSES DENGAN FORMAT*\n\n*User Profile* ✨ \n\n*➸ Username: ${namao}*\n\n*➸ User Info: ${status.status}*\n\n*➸ NOMOR : ${nomor}* \n\n*➸ NAMA : ${nama}* \n\n*➸ UMUR : ${umur} TAHUN* \n\n*➸ TIME : ${tgl}-${bln}-${thn}* \n\n\n*➸ [ ${daftar.length} ] PENGGUNA YANG TERDAFTAR* \n\n*➸ [ ${chati.length} ] PENGGUNA RIDHO BOT*\n\n*➸ [ ${group.length} ] GROUP RIDHO BOT* \n\n*TERIMAKASIH SUDAH IKUT BERGABUNG DI RIDHO BOT*`, id)
             }
            break

        case '#reg':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
           const reg = body.slice(5)
            {
            daftar.push(reg+'@c.us')
            fs.writeFileSync('./lib/daftar.json', JSON.stringify(daftar))
            client.reply(from, 'SUKSES MENDAFTARKAN TARGET', id)
            }
            break

        case '#listdaftar':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            if (!isOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner RIDHO BOT!', id)
            let ld = `INI ADALAH USER YANG SUDAH DAFTAR DI RIDHO BOT\nTotal : ${daftar.length}\n`
            for (let i of daftar) {
                ld += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await client.reply(from, ld, id)
            break
        case 'bot':
        case 'halo bot':
        case 'ini bot?':
        case 'bg':
        case 'ridho':
        case 'bg ridho':
        case 'hai':
        case 'cok':
        case 'cuk':
        case 'bro':
        case 'kak':
        case 'bang':
        case 'bor':
        case 'kk':
            client.reply(from, `Iya ? ada apa bor ? mending ketik *#menu* untuk melihat fitur bot`, id)
            break

        case 'p':
             client.reply(from, `utamakan salam, *Assalamualaikum*`, id)
             break
        
        case 'assalamualaikum':
        case '*Assalamualaikum*':
             client.reply(from, `waallaikumsallam`, id)
             break   

        case '#help':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            const no2 = sender.id.replace(/[@c.us]/g,'')
            var pict = await client.getProfilePicFromServer(no2)
            client.sendFileFromUrl(from, pict, 'pfp.jpg', `════════════════\n'''HAI MAU MINTA TOLONG APA?'''\n\n════════════════\n\n*NAMA : ${pushname}*\n\n════════════════\n\n*UNTUK MELIHAT MENU KETIK* #menu sayang...\n\n`)
            break

        case '#menu':
            if (!isdaftar) return client.reply(from, `${ubah}*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*${ubah}`, id)
            client.sendText(from, help)
            break

        case '#menu1':
            const no1 = sender.id.replace(/[@c.us]/g,'')
           var pict1 = await client.getProfilePicFromServer(no1)
            client.sendFileFromUrl(from, pict1, 'pfp.jpg', `#cmd
                #Profile`, id)
                break

        case '#diamond':
            client.reply(from, diamond, id)
            break

        case '#ff':
            if (args.length === 1) return client.reply(from, `CARA ORDER ✨  \n#ff [NO ID : ] [ DIAMOND : ] \nCONTOH : #ff NO ID 243240776 DIAMOND 500💎 TUNGGU ADMIN CHAT KAMU`, id)
            const ff = body.slice(4)
            if(!ff) return 
            if (isGroupMsg){
            client.sendText(ownerNumber, `*[ORDER]*\n*WAKTU : ${time}*\n*NO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}*\n*GROUP : ${formattedTitle}*\n\n*ISI PESAN : ${ff}*`)
            client.reply(from, `*PESANAN ${pushname} AKAN SEGERA DI TANGGAPI OLEH ADMIN DAN ADMIN AKAN CHAT ${pushname} SEGERA*.` ,id)
            }else{
            client.sendText(ownerNumber, `*[PSAN]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\n\n*ISI PESAN : ${ff}*`)
            client.reply(from, `*PESANAN ${pushname} AKAN SEGERA DI TANGGAPI OLEH ADMIN DAN ADMIN AKAN CHAT ${pushname} SEGERA*.` ,id)
            }
            break

        case '#peraturan':
            client.reply(from, peraturan, id)
            break

        case '#iklan':
            client.reply(from, iklan, id)
            break

        case '#info':
            client.sendText(from, info)
            break

        case '#snk':
            client.reply(from, snk, id)
            break

        case '#akun':
            client.reply(from, akun, id)
            break

        case '#donasi':
        case '#donate':
            client.reply(from, donasi, id)
            break

        case '#cmd':
            if (!isdaftar) return client.reply(from, `${ubah}*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*${ubah}`, id)
            client.reply(from, cmd, id)
            break

        case '#freemusic':
        case '#freemusik':
            client.reply(from, freemusic, id)
            break

        case '#preminfo':
        case '#infoprem':
            client.reply(from, preminfo, id)
            break

        case '#rdp':
            client.reply(from, rdp, id)
            break

        case '#jasa':
            client.reply(from, jasa, id)
            break

        case '#readme':
            client.reply(from, readme, id)
            break
        case '#privat':
            if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dilakukan oleh Owner bot', id)
            client.reply(from, privat, id)
            break

    //music
    case 'coba':
        client.sendPtt(from, './media/tts/resId.mp3', id)
        break
    case '*penantian*':
            client.sendPtt(from, './mp3/penantian.mp3', id)
            break
    case 'halo':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/tapi boong.mpeg', id)
            break
        case 'hallo':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/dalem sayang.mpeg', id)
            break
        case '*ikan*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/ikan hiu makan tomat.mp3', id)
            break
        case '*jujur*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/jujur sa su bilang.mp3', id)
            break
        case '*karna*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/karena ada ko.mp3', id)
            break
        case '*pergi*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/kini ku tlah pergi.mp3', id)
            break
        case '*brubah*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/ko langsung brubah.mp3', id)
            break
        case '*kopidangdut*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/kopi dangdut koplo.mp3', id)
            break
        case '*kopidangdut2*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/kopi dangdut.mp3', id)
            break
        case '*kutimangtimang*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/kutimang timang adik ku sayang.mp3', id)
            break
        case '*lupakanlah*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/lupakanlah semua.mp3', id)
            break
        case '*menantikoplo*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/menanti koplo.mp3', id)
            break
        case '*penantian*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/penantian.mp3', id)
            break
        case '*perlahan*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/perlahan.mp3', id)
            break
        case '*sapamit*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/sa pamit mu pulang.mp3', id)
            break
        case '*bosanko*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/sayang kalao ko bosan ko bilang.mp3', id)
            break
        case '*yangkuberikan*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/semua yang tlah ku berikan.mp3', id)
            break
        case '*kesepian*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/sephia kesepian.mp3', id)
            break
        case '*mangkadadang*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/tiap hari mangkadadang.mp3', id)
            break
        case '*tibangbang*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/tibang bang.mp3', id)
            break
        case '*mencintaimu*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/aku mentaimu.mp3', id)
            break
        case '*alealemilo*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/aleale milo.mp3', id)
            break
        case '*amongus*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/among us 2.mp3', id)
            break
        case '*amongus2*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/among us.mp3', id)
            break
        case '*atmyworst*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/atmyworst.mpeg', id)
            break
        case '*potapota*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/potapota.mp3', id)
            break
        case '*djpotapota*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/djpotapota.mp3', id)
            break
        case '*berentikasihan*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/berentikasihan.mpeg', id)
            break
        case '*djodaing*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/djodaing.mpeg', id)
            break
        case '*kangcopet*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/kangcopet.mpeg', id)
            break
        case '*djbgjono*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/djbgjono.mpeg', id)
            break
        case '*maduaholong*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/maduaholong.mpeg', id)
            break
        case '*memoriberkasih*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/memoriberkasih.mpeg', id)
            break
        case '*youbroke*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/youbroke.mpeg', id)
            break
        case '*djkeringetan*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/djkeringetan.mpeg', id)
            break
        case '*harus*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/harus.mpeg', id)
            break
        case '*karnaadako*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/karnaadako.mpeg', id)
            break
        case '*melepaskanmu*':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/melepaskanmu.mpeg', id)
            break
        case 'hai':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/dalem sayang.mpeg', id)
            break
        case 'iri':
            if (!isdaftar) return client.reply(from, `*NOMOR KAMU BELUM TERDAFTAR DI RIDHO BOT* \n\n*SILAHKAN LAKUKAN PENDAFTARAN DENGAN CARA KETIK* \n\n#daftar nomor|nama|umur \n\nCONTOH : \n\n#daftar 6281289096745|ridho|17 \n\n*_PENULISAN NOMOR HARUS MENGGUNAKAN 62812XXXXX_*`, id)
            client.sendPtt(from, './mp3/iri.mpeg', id)
            break
            default:
            if (!isGroupMsg) return client.reply(from, `${ubah}BOT INI MENGGUNAKAN PREFIX${ubah} #\n\n${ubah}INI ADALAH RIDHO BOT UNTUK MENAMPILKAN MENU KETIK${ubah} *#menu*\n\n${ubah}YANG BELUM DAFTAR KETIK${ubah} *#daftar*\n\n${ubah}JOIN GRUB RIDHO BOT KETIK${ubah} *#ridhogroup*\n ${ubah}ADA PERTANYAAN HUBUNGI OWNER BOT${ubah} https://wa.me/6281289096745 CARA PENGGUNAAN BOT : https://www.youtube.com/watch?v=wGE7U8mI2JM`, id)
            if (command.startsWith('#')) {
                client.reply(from, `Maaf ${pushname}, Command *${args[0]}* Tidak Terdaftar Di Dalam *#menu*`, id)
            }
            await client.sendSeen(from) 
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
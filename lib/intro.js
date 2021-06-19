const fs = require('fs-extra')

module.exports = intro = async (client, event) => {
    //console.log(event.action)
    const intro = JSON.parse(fs.readFileSync('./settings/intro.json'))
    const isIntro= intro.includes(event.chat)
    const ubah = "```"
    const ig = 'https://instagram.com/ridho_setiawan02'
    const yt = 'https://youtube.com/lowoijo'
    try {
        if (event.action == 'add' && isIntro) {
            const gChat = await client.getChatById(event.chat)
            const pChat = await client.getContact(event.who)
            const { contact, groupMetadata, name } = gChat
            const pepe = await client.getProfilePicFromServer(event.who)
            const capt = `*MEMBER BARU INTRO DULU*\n
*NAMA* : \n
*USIA* : \n 
*JENIS KELAMIN* : \n
*TINGGAL* : \n
*KOTA* : \n
*STATUS* : \n
*FAVORITE ANIME* :
-
-
-
-
- \n
*FAVORITE GAME* : 
-
-
-
-
-\n

*NB : SALIN TEKS INI, ISI DAN KIRIM KEMBALI...*

*JANGAN LUPA* 
${ubah}FOLLOW INSTGRAM ADMIN${ubah}  
${ig}
${ubah}SUBSCRIBE YOUTUBE ADMIN${ubah}
${yt}

*TERIMA KASIH...*`
               await client.sendText(event.chat, capt)
            }
    } catch (err) {
        console.log(err)
    }
} 
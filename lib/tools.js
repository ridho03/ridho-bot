var fs       = require('fs')
var ttsId    = require('node-gtts')('id')
var ttsEn    = require('node-gtts')('en')
var needle   = require('needle')
var moment   = require('moment-timezone')
var api_link = 'https://api.i-tech.id/tools/' // Link API https://api.i-tech.id/
var api_key  = 'xzYmRq-EYvmGr-117MD1-cKgfgI-s2kLbI' // API KEY Dari https://api.i-tech.id/

const getBase64 = (file) => new Promise((resolve, reject) => {
  let files  = fs.readFileSync(file)
  let result = files.toString('base64')
  resolve(result)
})

const toxic = () => new Promise((resolve, reject) => {
  let kata = [
    'babi',
    'monyet',
    'anjing',
    'kafir',
    'jembut',
    'memek',
    'kontol',
    'tempik',
    'tempik',
    'gay',
    'lesbi',
    'setan',
    'cangcut',
    'bagong',
    'bangsat',
    'anjay',
    'anjim',
    'anjas',
    'njay',
    'asu',
    'asw',
    'ngentot'
  ]
  let randKata = kata[Math.floor(Math.random() * kata.length)]
  let list = [
    `muka lo kek ${randKata}`, `anda tau ${randKata} ?`,`${randKata} Lo ${randKata}`,
    `ngapa ${randKata} ga seneng?`,`ribut sini lo ${randKata}`,`jangan ngakak lo ${randKata}`,
    `wey ${randKata}!!`,`aku sih owh aja ya ${randKata}`,`ga seneng send lokasi lo ${randKata}`,
    `capek w ${randKata}`, `hari ini kau minat gelut ${kata[2]} ?`, `w tw lo itu ${randKata}`,
    `w ganteng dan lo kek ${randKata}`,`bucin lo ${randKata}`,`najis baperan kek ${randKata}`,
    `nge-teh ${randKata}`,`gaya lo sok iye, mukalo kek ${randKata}`,`${randKata} awokwowkok`
   ]
   resolve(list[Math.floor(Math.random() * list.length)])
})

const quotes = () => new Promise((resolve, reject) => {
  let arr = [
    'Bagi dunia, kamu mungkin satu orang, tetapi bagi satu orang kamu adalah dunia.',
    'Cinta mungkin hadir karena takdir tapi tak ada salahnya kita saling memperjuangkan.',
    'Cinta adalah d imana kamu selalu punya alasan untuk kembali meski kamu sudah berjalan begitu jauh.',
    'Dalam cinta, menyerah tak selalu berarti kamu lemah. Kadang itu hanya berarti kamu cukup kuat tuk melepaskannya.',
    'Kamu mungkin memegang tanganku untuk sementara waktu, tetapi kamu memegang hatiku selamanya.',
    'Saat aku bersamamu, aku akan melepaskan segala ketakutan dan kecemasan.',
    'Kamu nyaman? Kamu sayang? Tapi cuma dianggap temen? Kadang gitu. Nyamanmu belum tentu nyamannya. Cukup dipahami aja.',
    'Dibilang sayang? Iya. Dibilang cinta? Iya. Dibilang pacar? Bukan.',
    'Apakah namamu WiFi? Soalnya aku bisa merasakan konektivitas.',
    'Bersamamu aku tidak pernah takut lagi menjadi pemimpi.',
    'Move on itu pilihan. Gagal move on itu cobaan. Pura-pura move on itu pencitraan.',
    'Sepurane aku nggak nguber awakmu maneh. Kepastianmu abstrak, podo karo raimu.',
    'You`re just my cup of tea.',
    'My love belongs to you.',
    'I love you - those three words have my life in them.',
    'You are my strength but loving you is my biggest weakness.',
    'I promise that i`ll love you in every step of mine',
    'Aku tidak pernah keberatan menunggu siapa pun berapa lama pun selama aku mencintainya.',
    'Aku tak ingin berakhir seperti mereka, saling mencintai. Lantas kehilangan dan kini mereka hanya mengenang dan merenung dari jauh.',
    'Kau mencintaiku tanpa sepatah kata, aku mencintaimu, dengan satu kata yang tak pernah patah.',
    'Allah menciptakan senja untuk mengingatkanku untuk pulang pada cinta yang kukenang.',
    'Cinta tak berupa tatapan satu sama lain, tetapi memandang keluar bersama ke arah yang sama.',
    'Cinta tidak terlihat dengan mata, tetapi dengan hati.',
    'Cinta itu layaknya angin, aku tidak bisa melihatnya tetapi aku bisa merasakannya.',
    'Cinta tidak pernah menuntut, cinta selalu memberi. Cinta selalu menderita, tanpa pernah meratap, tanpa pernah mendendam.',
    'Masa lalu saya adalah milik saya, masa lalu kamu adalah milik kamu, tapi masa depan adalah milik kita.',
    'Bahagia itu kita yang ciptain, bukan mereka.',
    'Cinta itu, rela melihat orang yang kita cintai bahagia bareng orang lain.',
    'Aku hanyalah kunang-kunang, dan kau hanyalah senja, dalam gelap kita berbagi, dalam gelap kita abadi.',
    'Dalam diam, aku memperjuangkan cintamu dalam doaku.',
  ]
  let acak = arr[Math.floor(Math.random() * arr.length)]
  resolve(acak)
})

const quotes2 = async (text) => new Promise((resolve, reject) => {
  var url = 'quotes?key='
  needle(api_link + url + api_key, (err, resp, body) => {
    resolve([body])
  })
})

const quotes3 = async (text) => new Promise((resolve, reject) => {
  var url = 'quotes2?key='
  needle(api_link + url + api_key, (err, resp, body) => {
    resolve([body])
  })
})

const pantunpakboy = async (text) => new Promise((resolve, reject) => {
  var url = 'pantun?key='
  needle(api_link + url + api_key, (err, resp, body) => {
    resolve([body])
  })
})

const ptl = async (text) => new Promise((resolve, reject) => {
  var url = 'gambar?key'
  needle(api_link + url + api_key, (err, resp, body) => {
    resolve([body])
  })
})


const hilih = (kata) => new Promise((resolve, reject) => {
  var url = 'hilih?key='
  needle(api_link + url + api_key + '&kata=' + kata, (err, resp, body) => {
    resolve([body])
  })
})

const alay = (kata) => new Promise((resolve, reject) => {
  var url = 'alay?key='
  needle(api_link + url + api_key + '&kata=' + kata, (err, resp, body) => {
    resolve([body])
  })
})

const shtlink = (link) => new Promise((resolve, reject) => {
  var url = 'shorturl?key='
  needle(api_link + url + api_key + '&link=' + link, (err, resp, body) => {
    resolve([body])
  })
})


const ninja = (nama) => new Promise((resolve, reject) => {
  var url = 'ninja?key='
  needle(api_link + url + api_key + '&kata=' + nama, (err, resp, body) => {
    resolve([body])
  })
})

const QutesMaker = async (tipe, author, kata) => new Promise((resolve, reject) => {
  var url = 'qtm?key='
  needle(api_link + url + api_key + '&type=' + tipe + '&author=' + author + '&text=' + kata, (err, resp, body) => {
    resolve([body])
  })
})

const wikipedia = async (query) => new Promise((resolve, reject) => {
  var url = 'wiki?key='
  needle(api_link + url + api_key + '&query=' + query, (err, resp, body) => {
    resolve([body])
  })
})

const Brainly = (query) => new Promise((resolve, reject) => {
  let url = 'brainly?key='

  if  (query.length === 0) reject (`❌ Harap masukkan query yang ingin dicari.`)
  needle(api_link + url + api_key + '&query=' + query, (err, resp, body) => {
      try {
        resolve(body.result)
      } catch (err) {
          reject(err)
      }
  })
})

const cuaca = async (kota) => new Promise((resolve, reject) => {
  var url = 'cuaca?key='

    needle(api_link + url + api_key + '&kota=' + kota, (err, resp, body) => {
      resolve([body])
    })
})

const jamdunia = async (kota) => new Promise((resolve, reject) => {
  var url = 'jam?key='

    needle(api_link + url + api_key + '&kota=' + kota, (err, resp, body) => {
      resolve([body])
    })
})

const jadwalSholat = async (kota) => new Promise((resolve, reject) => {
  var url = 'sholat?key='

    needle(api_link + url + api_key + '&kota=' + kota, (err, resp, body) => {
      resolve([body])
    })
})

const arti = (nama) => new Promise((resolve, reject) => {
  var url = 'arti?key='

  needle(api_link + url + api_key + '&nama=' + nama, (err, resp, body) => {
    resolve([body])
  })
})

const lirik = (lagu) => new Promise((resolve, reject) => {
  var url = 'lirik?key='

  needle(api_link + url + api_key + '&query=' + lagu, (err, resp, body) => {
    resolve([body])
  })
})

const jodoh = async (nama1, format, nama2) => new Promise((resolve, reject) => {
  var url = 'jodoh?key='

  if (nama1 !== undefined) {
    needle(api_link + url + api_key + '&p1=' + nama1 + format + 'p2=' + nama2, (err, resp, body) => {
      resolve([body])
    })
  }
})

const cekjodoh = async (nama1, format1, nama2, format2, nama3) => new Promise((resolve, reject) => {
  var url = 'cekjodoh?key='

  if (nama1 !== undefined) {
    if (nama3 === undefined) {
      needle(api_link + url + api_key + '&query=' + nama1 + '-' + nama2, (err, resp, body) => {
        resolve([body])
      })
    } else {
      needle(api_link + url + api_key + '&query=' + nama1 + '-' + nama2 + '-' + nama3, (err, resp, body) => {
        resolve([body])
      })
    }
  }
})

const Chord = async (judul) => new Promise((resolve, reject) => {
  var url = 'chord?key='

    needle(api_link + url + api_key + '&query=' + judul, (err, resp, body) => {
      resolve([body])
    })
})

const bmkg = async (text) => new Promise((resolve, reject) => {
  var url = 'bmkg?key='

    needle(api_link + url + api_key, (err, resp, body) => {
      resolve([body.result.gempa])
    })
})

const ssweb = async (link) => new Promise((resolve, reject) => {
  var url = 'ssweb?key='

    needle(api_link + url + api_key + '&link=' + link, (err, resp, body) => {
      resolve([body])
    })
})

const tvnow = async (link) => new Promise((resolve, reject) => {
  var url = 'tvnow?key='

    needle(api_link + url + api_key, (err, resp, body) => {
      resolve([body])
    })
})

const jadwalTv = async (query) => new Promise((resolve, reject) => {
  var url = 'jadwaltv?key='

    needle(api_link + url + api_key + '&channel=' + query, (err, resp, body) => {
      resolve([body])
    })
})

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  module.exports = { 
    toxic,
    quotes,
    quotes2,
    quotes3,
    hilih,
    alay,
    ninja,
    getBase64,
    QutesMaker,
    wikipedia,
    Brainly,
    cuaca,
    jamdunia,
    jadwalSholat,
    arti,
    lirik,
    jodoh,
    cekjodoh,
    Chord,
    bmkg,
    ssweb,
    jadwalTv,
    tvnow,
    sleep,
    shtlink,
    pantunpakboy,
    ptl
    
   }
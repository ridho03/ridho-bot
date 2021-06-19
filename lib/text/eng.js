const fs = require('fs-extra')

exports.afkOn = (pushname, reason) => {
    return `AFK feature was successfully *enabled*!\n\n➸ *Username*: ${pushname}\n➸ *Reason*: ${reason}`
}

exports.afkOnAlready = () => {
    return `AFK feature has been enabled before.`
}

exports.afkMentioned = (getReason, getTime) => {
    return `*「 AFK MODE 」*\n\nSssttt! The person is on AFK state, don't bother!\n➸ *Reason*: ${getReason}\n➸ *Since*: ${getTime}`
}

exports.afkDone = (pushname) => {
    return `*${pushname}* is back from AFK, welcome~`
}


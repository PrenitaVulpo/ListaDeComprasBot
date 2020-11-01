const env = require('../.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { Console } = require('console');
const bot = new Telegraf(env.token);

let lista = [];

const buttons = () => Extra.markup(
  Markup.inlineKeyboard(
    lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
    {columns:3}
  )
)

bot.start(async context =>{
  const name = context.update.message.from.first_name;
  console.log(context.update.message.from)
  await context.reply(`Seja bem-vindo(a), ${name}!`);
  await context.reply('Escreva, um a um, os ítens que você deseja adicionar.');
})

bot.on('text', context => {
  const item = context.update.message.text;
  lista.push(item);
  context.reply(`${item} adicionado.`, buttons())
})

bot.action(/delete (.+)/, context => {
  lista = lista.filter(item => item !== context.match[1]);
  context.reply(`${context.match[1]} deletado!`, buttons())
})

bot.startPolling();
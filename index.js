const { Telegraf, session, Scenes: { BaseScene, Stage}, Markup, Router} = require('telegraf');
BOT_TOKEN = '';
const bot = new Telegraf(BOT_TOKEN);


//--------------------------------------------------------
//                      Conexões e Consultas ao DB
//--------------------------------------------------------

// conexão com o banco de dados
const mysql = require('mysql');
const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"neo_bd"
})
conn.connect(function(err){
    if(err){
        throw err;
    }
})


//Avalia se o usuario esta cadastrado no banco
bot.use((ctx, next) => {
    let id_usuario = ctx.chat.id;

    conn.query(
        `SELECT(
            SELECT id_telegram
                FROM usuarios
                    WHERE id_telegram = '${id_usuario}'
                        ) AS id_telegram`,
        
            function(err, result, fields){
                if(err){
                    throw err;
                }

                dataStore = [];

                result.forEach(item =>{
                    dataStore.push({
                        id_telegram: item.id_telegram,
                    })
                    
                id_usuario_telegram = (item.id_telegram);
                console.log(id_usuario_telegram);

                next();
                return id_usuario_telegram;

        })
    })   
    console.log('usuario:', ctx.from.first_name, ctx.chat.id);
})

//cancelar cadastro
const cancelar = 'Cancelar'
//mensagem de erro para usuarios não cadastrados
const msg_usuario_nao_cadastrado = 'Desculpe, mas não consegui encontrar seus dados. Digite /cadastro para se cadastrar e poder usar as funcionalidades do nosso Bot ;)'


//--------------------------------------------------------
//                      Cadastro do usuário
//--------------------------------------------------------

//parâmetros
const exit_keyboard = Markup.keyboard([ `${cancelar}` ]).oneTime()
const remove_keyboard = Markup.removeKeyboard()

//nome completo
const nome_completo_scene = new BaseScene('nome_completo_scene')
    nome_completo_scene.enter((ctx) => {
        ctx.reply('Digite seu nome completo', exit_keyboard)})

    nome_completo_scene.on('text', (ctx)=> {
        //envia o valor para o próximo laço da scene.
        return ctx.scene.enter('matricula_scene', {nome_completo: ctx.message.text})    
})


//Matricula
const matricula_scene = new BaseScene('matricula_scene')
    matricula_scene.enter((ctx) => {
        ctx.reply('Digite sua Matricula.\nCaso não saiba sua matrícula, coloque 0.', exit_keyboard)})

    matricula_scene.on('text', ctx=>{

        //busca os parametros da scene anterior e adiciona a essa.
        ctx.session.nome_completo = ctx.scene.state.nome_completo;
        ctx.session.matricula = ctx.message.text;

        //envia o valor para o próximo laço da scene.
        return ctx.scene.enter('empresa_scene', 
            {nome_completo: ctx.scene.state.nome_completo, 
            matricula: ctx.message.text
    })
})


//empresa
const empresa_scene = new BaseScene('empresa_scene')
    empresa_scene.enter(ctx => {
        ctx.telegram.sendMessage(ctx.chat.id, 'Em qual empresa você trabalha?', {
            reply_markup:{
                inline_keyboard:[   //botões para pressionar.
                    [
                        {text: 'Neo Brasília', switch_inline_query_current_chat: 'NeoBSB'}, 
                        {text: 'COSERN', switch_inline_query_current_chat: 'COSERN'} 
                    ],
                    [
                        {text: 'opcao03', switch_inline_query_current_chat: 'opcao03'},
                        {text: 'opcao04', switch_inline_query_current_chat: 'opcao04'}
                    ]
            ]
        }
    }, exit_keyboard)
})  
    empresa_scene.on('text', (ctx) => {

        //capturando a resposta do usuário
        //E separando a resposta do @bot
        msg_empresa = ctx.message.text;
        arr_msg_empresa = msg_empresa.split(' ');
        arr_msg_empresa.shift();
        arr_nome_empresa = arr_msg_empresa.join('');  
        console.log(arr_msg_empresa)


        //busca os parametros da scene anterior e adiciona a essa.
        ctx.session.nome_completo = ctx.scene.state.nome_completo;
        ctx.session.matricula = ctx.scene.state.matricula;
        ctx.session.empresa = arr_nome_empresa;
        
        //envia o valor para o próximo laço da scene.
        return ctx.scene.enter('area_scene', 
            {nome_completo: ctx.scene.state.nome_completo, 
                matricula: ctx.scene.state.matricula, 
                empresa: arr_nome_empresa
    })
})



//area
const area_scene = new BaseScene('area_scene')
    area_scene.enter(ctx => {
        ctx.telegram.sendMessage(ctx.chat.id, 'Em que parte da empresa você trabalha?', {
            reply_markup:{
                inline_keyboard:[   //botões para selecionar.
                    [
                        {text: 'Operacional', switch_inline_query_current_chat: 'operacional'}, 
                        {text: 'Financeira', switch_inline_query_current_chat: 'financeira'} 
                    ],
                    [
                        {text: 'RH', switch_inline_query_current_chat: 'rh'},
                        {text: 'Estratégico', switch_inline_query_current_chat: 'estratégico'}
                    ],
                    [
                        {text: 'Outra', switch_inline_query_current_chat: 'outra'}
                    ]
            ]
        }
    }, exit_keyboard)
})  
    area_scene.on('text', (ctx) => {

        //tratando a resposta do usuário
        //E separando do @bot
        
        msg_area = ctx.message.text;
        arr_msg_area = msg_area.split(' ');
        arr_msg_area.shift();
        arr_msg_area = arr_msg_area.join(' ');
        

        //busca os parametros da scene anterior e adiciona a essa.
        ctx.session.nome_completo = ctx.scene.state.nome_completo;
        ctx.session.matricula = ctx.scene.state.matricula;
        ctx.session.empresa = ctx.scene.state.empresa;
        ctx.session.area = arr_msg_area;
        
        
        //envia o valor para o próximo laço da scene.
        return ctx.scene.enter('telefone_scene', 
            {nome_completo: ctx.scene.state.nome_completo, 
                matricula: ctx.scene.state.matricula, 
                empresa: ctx.scene.state.empresa,
                area: arr_msg_area
    })
})


//telefone
const telefone_scene = new BaseScene('telefone_scene')
    telefone_scene.enter( async (ctx)=> {
    await ctx.reply('Por favor, compartilhe seu contato conosco ;)',
        Markup.keyboard(
            [
                {
                text: 'Compartilhar meu contato', request_contact: true
                }
            ]
        )
    )
    ctx.telegram.sendMessage(ctx.chat.id, 'Clique para compartilhar', {
        reply_markup:{
            inline_keyboard: [
                [
                    {text: 'Meu Contato', callback_data: 'meu_contato' }
                ]
            ]
        }
    }, exit_keyboard )
})

bot.action('meu_contato', (ctx) =>{
    ctx.reply('Clique na parte inferior da tela', 
     Markup.keyboard(
        [
            {
            text: 'Compartilhar meu contato', request_contact: true
            }
        ]
    ), exit_keyboard
    )
})
    telefone_scene.on(('text', 'contact'), (ctx) => {

        //busca os parametros da scene anterior e adiciona a essa.
        ctx.session.nome_completo = ctx.scene.state.nome_completo;
        ctx.session.matricula = ctx.scene.state.matricula;
        ctx.session.empresa = ctx.scene.state.empresa;
        ctx.session.area = ctx.scene.state.area;
        ctx.session.telefone = ctx.message.contact.phone_number;

        //envia o valor para o próximo laço da scene.
        return ctx.scene.enter('confirmacao_scene', 
            {   
                nome_completo: ctx.scene.state.nome_completo, 
                matricula: ctx.scene.state.matricula, 
                empresa: ctx.scene.state.empresa,
                area: ctx.scene.state.area,
                telefone: ctx.message.contact.phone_number
    })
})



//Confirmando o Cadastro e enviando ao banco de dados
const confirmacao_scene = new BaseScene('confirmacao_scene')
    confirmacao_scene.enter( async (ctx) =>{
        await ctx.telegram.sendMessage(ctx.chat.id, 
        `
<b><i>DADOS:</i></b>
<b><i>Nome:</i></b> ${ctx.session?.nome_completo},
<b><i>Matricula:</i></b> ${ctx.session?.matricula},
<b><i>Empresa:</i></b> ${ctx.session?.empresa},
<b><i>Área de Atuação:</i></b> ${ctx.session?.area},
<b><i>Telefone:</i></b> ${ctx.session?.telefone}`, 
    {
    parse_mode: 'HTML'
    }
)

    ctx.telegram.sendMessage(ctx.chat.id, 'Confira seus dados, e selecione uma das opções ', {
        reply_markup:{
            inline_keyboard:[
                [
                    {text: 'CONFIRMAR CADASTRO', callback_data: 'confirmar_cadastro'}
                ],
                [
                    {text: 'CANCELAR', callback_data: 'cancelar_cadastro'}
                ]
            ]
        }  
    }, exit_keyboard
)

//enviando os dados para o banco
bot.action('confirmar_cadastro', (ctx)=>{
            let id_usuario_cadastro = ctx.from.id;
            let first_name = ctx.from.fist_name;
            let last_name = ctx.from.last_name;

            let adiciona_usuario_no_bd = `
            INSERT INTO solicitacao_cadastro
            (
                id_telegram,
                first_name,
                last_name,
                nome_completo,
                matricula,
                telefone,
                empresa,
                area_atuacao
            ) VALUES(
                '${id_usuario_cadastro}',
                '${first_name}',
                '${last_name}',
                '${ctx.session?.nome_completo}',
                '${ctx.session?.matricula}',
                '${ctx.session?.telefone}',
                '${ctx.session?.empresa}',
                '${ctx.session?.area}'
            );
            `;


            conn.query(adiciona_usuario_no_bd);

            ctx.deleteMessage();
            ctx.reply('Solicitação de cadastro adicionada.\nAgora é só esperar!!\nVamos revisar os dados e se tudo estiver certo, o acesso será liberado logo logo =)'
            )
        }, exit_keyboard)
    return ctx.scene.leave()
})

//cancelando cadastro
bot.action('cancelar_cadastro', (ctx) =>{
    ctx.deleteMessage()
    ctx.reply('Tente novamente com /cadastro.\nNão desista!!', Markup.keyboard(), exit_keyboard)
})


//Parâmetros da Stage
//Você precisa colocar toda nova scene aqui
const stage = new Stage([nome_completo_scene, matricula_scene, empresa_scene, area_scene, telefone_scene, confirmacao_scene])   
stage.hears(`${cancelar}`, ctx => ctx.scene.leave())
bot.use(session())
bot.use(stage.middleware())


//--------------------------------------------------------
//                      Comandos do bot
//--------------------------------------------------------

bot.start(async (ctx) => {
    
   await ctx.reply('Bem-vinda (o), '+ctx.from.first_name);

    if(id_usuario_telegram != null){
        ctx.telegram.sendMessage(ctx.chat.id, 
        `
        <b><i>Nossos comandos atuais são:</i></b>
        <b>/start</b>
        <b>/cadastro</b>
        <b>/equipamento</b>
        <b>/help</b> - Use para saber mais.
        `, 
            {
                parse_mode: 'HTML',
            })  
    }else{
        ctx.reply(`${msg_usuario_nao_cadastrado}`
        )
    }
})


bot.command('cadastro', async (ctx) => {
    
    await ctx.reply('Olá, para se cadastrar responda as perguntas abaixo.');
    await ctx.reply('Para desistir digite "Cancelar" a qualquer momento.');
    ctx.scene.enter('nome_completo_scene')  
})


bot.command('/equipamento', async (ctx) => {
    if(id_usuario_telegram != null){

        //tratando os dados digitados pelo usuário
        let id_digitado = ctx.message.text;
        arr_id_digitado = id_digitado.split(' ');
        arr_id_digitado.shift();
        let id_equipamento = arr_id_digitado.join(' ');
    
        if(id_equipamento.length > 0){

            //consultando o banco de dados
            conn.query(
                `SELECT * 
                        FROM neo_chaves 
                            WHERE chave = '${id_equipamento}'`, 

        //tratando o resultado da consulta
                function(err, result, fields){
                    if(err){
                        throw err;
                    }   
                dataStore = [];
                console.log(result.length)
                
                if(result.length == 0){
                    ctx.reply('Chave não encontrada, tente novamente.');
                    return;

                }else{
                    result.forEach(item => {
                       
                    if(!item.tipo_chave){
                            item.tipo_chave = ' ';
                            }else{
                                }if(!item.circuito){
                                item.circuito = ' ';
                                    }else{
                                      }if(!item.categoria){
                                        item.categoria = ' ';
                                        }else{
                                          }if(!item.endereco){
                                            item.endereco = ' ';
                                            }else{
                                              }if(!item.circuito_interligacao){
                                                item.circuito_interligacao = ' ';
                                                }else{
                                                  }if(!item.potencia_interrompida_kva){
                                                    item.potencia_interrompida_kva = ' ';
                                                    }else{
                                                      }
                                                      if(!item.consumidores){
                                                        item.consumidores = ' ';
                                                        }else{
                                                          }
                                                          if(!item.elo){
                                                            item.elo = ' ';
                                                            }else{
                                                              }
                                                              if(!item.tipo){
                                                                item.tipo = ' ';
                                                                }else{
                                                                  }                        
                            dataStore.push({
                                chave: item.chave,
                                tipo_chave: item.tipo_chave,
                                circuito: item.circuito,
                                latitude: item.latitude,
                                longitude: item.longitude,
                                categoria: item.categoria,
                                endereco: item.endereco,
                                circuito_interligacao: item.circuito_interligacao,
                                potencia_interrompida_kva: item.potencia_interrompida_kva,
                                consumidores: item.consumidores,
                                elo: item.elo,
                                tipo: item.tipo,
                            })
                        
                      ctx.telegram.sendMessage(ctx.chat.id, `<b>Informações do Equipamento:</b>\n
<b>Chave:</b>   
        ${item.chave}
<b>Tipo de chave:</b>   
        ${item.tipo_chave}         
<b>Circuito:</b>    
        ${item.circuito}
<b>Categoria:</b>  
        ${item.categoria}
<b>Endereço:</b>    
        ${item.endereco}
<b>Circuito Interligação:</b>   
        ${item.circuito_interligacao}
<b>Potência Interrompida (kVA):</b> 
        ${item.potencia_interrompida_kva}
<b>Consumidores:</b>    
        ${item.consumidores}
<b>elo:</b> 
        ${item.elo}
<b>Tipo:</b>    
        ${item.tipo}\n
`,
                {
                    parse_mode: 'HTML', //Adiciona funções de html ao texto.
                })

                    //localização
                    ctx.telegram.sendLocation(ctx.chat.id, 
                        `${item.latitude}`, `${item.longitude}`)
                })
            }
        })

        }else{
            ctx.reply('Faça como no exemplo:\n /equipamento 000000')
        }

    }else{
        ctx.reply(`${msg_usuario_nao_cadastrado}`)
    }
})


bot.help( (ctx) => {
    if(id_usuario_telegram != null){
        ctx.telegram.sendMessage(ctx.chat.id, 
        `<b>Lista de comandos:</b>
        <b>/start</b> - Comando Inicial,
        <b>/cadastro</b> - para solicitar seu cadastro,
        <b>/equipamento</b> - Buscar informações de um equipamento a partir da <b><i>chave</i></b>.
        `, 
        {
            parse_mode: 'HTML',
        })

    }else{
        ctx.reply(`${msg_usuario_nao_cadastrado}`)
    }  
})

bot.launch();
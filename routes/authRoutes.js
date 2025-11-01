/*********************************************
 * Objetivo:Arquivo de rotas responsaveis por fazer todo o caminho google, seja vinculação conta gmail, envio de gmail ou google calendar 
 * Data: 01/11/2025
 * Autor: Gustavo Deodato
 * Versão 1.0
 * ***********************************************/

import express from 'express'
import { google } from 'googleapis'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()
const router = express.Router()
const prisma = new PrismaClient()

// Configuração OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK_URL 
)

// ======================================================
// Endpoint: Redireciona o usuário para a tela de consentimento
// ======================================================
router.get('/v1/google/auth', async (req, res) => {
  try {
    const userId = req.query.userId
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: JSON.stringify({ userId })
    })

    res.redirect(url)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao gerar URL de autenticação' })
  }
})

// ======================================================
//  Endpoint: Callback — troca "code" por tokens e salva no banco
// ======================================================
router.get('/v1/google/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code
    const state = JSON.parse(req.query.state || '{}')
    const userId = state.userId

    if (!code || !userId) {
      return res.status(400).json({ error: 'Parâmetros inválidos' })
    }

    // Troca o código por tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Obtém informações do usuário Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()

    // Verifica se já existe conta Google vinculada a esse usuário
    const existingAccount = await prisma.tbl_contas_google.findFirst({
      where: { tbl_usuario_id: Number(userId) }
    })

    if (existingAccount) {
      // Atualiza tokens e google_id se já existir vínculo
      await prisma.tbl_contas_google.update({
        where: { id: existingAccount.id },
        data: {
          google_id: userInfo.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || existingAccount.refresh_token
        }
      })
    } else {
      // Cria nova vinculação
      await prisma.tbl_contas_google.create({
        data: {
          google_id: userInfo.id,
          tbl_usuario_id: Number(userId),
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }
      })
    }

    res.send('✅ Conta Google vinculada com sucesso! Você pode fechar esta aba.')
  } catch (error) {
    console.error('Erro no callback OAuth2:', error)
    res.status(500).json({ error: 'Erro ao processar autenticação Google', details: error.message })
  }
})


// ----------------------------------------------------------
// POST /v1/google/link
// ----------------------------------------------------------


router.post('/v1/google/link', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: JSON.stringify({ userId })
    })

    res.json({ authUrl: url })
  } catch (error) {
    console.error('Erro ao gerar URL de link:', error)
    res.status(500).json({ error: 'Erro ao gerar link de autenticação' })
  }
})

// ----------------------------------------------------------
// GET /v1/google/oauth2callback
// ----------------------------------------------------------
router.get('/v1/google/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code
    const state = JSON.parse(req.query.state || '{}')
    const userId = state.userId

    if (!code || !userId) {
      return res.status(400).json({ error: 'Parâmetros inválidos' })
    }

    // Troca o code por tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Obtém dados da conta Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()

    // Verifica se já existe vínculo
    const existing = await prisma.tbl_contas_google.findFirst({
      where: { tbl_usuario_id: Number(userId) }
    })

    if (existing) {
      await prisma.tbl_contas_google.update({
        where: { id: existing.id },
        data: {
          google_id: userInfo.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || existing.refresh_token
        }
      })
    } else {
      await prisma.tbl_contas_google.create({
        data: {
          google_id: userInfo.id,
          tbl_usuario_id: Number(userId),
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token
        }
      })
    }

    res.send('✅ Conta Google vinculada com sucesso! Pode fechar esta aba.')
  } catch (error) {
    console.error('Erro no callback OAuth2:', error)
    res.status(500).json({ error: 'Erro ao processar autenticação Google', details: error.message })
  }
})

// ----------------------------------------------------------
// POST /v1/google/send-email
// ----------------------------------------------------------
router.post('/v1/google/send-email', async (req, res) => {
  try {
    const { fromUserId, to, subject, text, html } = req.body

    if (!fromUserId || !to || !subject) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' })
    }

    // Busca tokens do usuário vinculado
    const conta = await prisma.tbl_contas_google.findFirst({
      where: { tbl_usuario_id: Number(fromUserId) }
    })

    if (!conta) {
      return res.status(404).json({ error: 'Usuário não possui conta Google vinculada' })
    }

    // Configura OAuth2 com tokens do usuário
    oauth2Client.setCredentials({
      access_token: conta.access_token,
      refresh_token: conta.refresh_token
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Monta e codifica a mensagem no formato RFC 2822 (Base64)
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      html || text || ''
    ]
    const message = messageParts.join('\n')

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Envia o e-mail via API Gmail
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    })

    res.json({ success: true, message: ' E-mail enviado com sucesso!' })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    res.status(500).json({ error: 'Erro ao enviar e-mail', details: error.message })
  }
})

// ----------------------------------------------------------
// refresh automatico de tokens
// ----------------------------------------------------------
oauth2Client.on('tokens', async (tokens) => {
  if (tokens.access_token) {
    await prisma.tbl_contas_google.update({
      where: { id: conta.id },
      data: { access_token: tokens.access_token }
    })
  }
})

// ----------------------------------------------------------
// POST /v1/calendar/create-event
// ----------------------------------------------------------
router.post('/v1/calendar/create-event', async (req, res) => {
  try {
    const { userId, titulo, inicio, fim, local, descricao } = req.body

    if (!userId || !titulo || !inicio || !fim) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' })
    }

    // Busca tokens do usuário vinculado
    const conta = await prisma.tbl_contas_google.findFirst({
      where: { tbl_usuario_id: Number(userId) }
    })

    if (!conta) {
      return res.status(404).json({ error: 'Usuário não possui conta Google vinculada' })
    }

    // Configura OAuth2 com tokens do usuário
    oauth2Client.setCredentials({
      access_token: conta.access_token,
      refresh_token: conta.refresh_token
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Cria evento no Google Calendar
    const event = {
      summary: titulo,
      location: local || '',
      description: descricao || '',
      start: {
        dateTime: inicio, // formato: "2025-11-02T14:00:00-03:00"
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: fim,
        timeZone: 'America/Sao_Paulo'
      }
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event
    })

    const googleEventId = response.data.id

    res.json({
      success: true,
      message: ' Evento criado e sincronizado com Google Calendar!',
      googleEventId
    })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    res.status(500).json({ error: 'Erro ao criar evento', details: error.message })
  }
})

// ----------------------------------------------------------
// POST /v1/calendar/update-event
// ----------------------------------------------------------
router.post('/v1/calendar/update-event', async (req, res) => {
  try {
    const { userId, eventoIdLocal, titulo, inicio, fim, local, descricao } = req.body

    if (!userId || !eventoIdLocal) {
      return res.status(400).json({ error: 'userId e eventoIdLocal são obrigatórios' })
    }

    // Busca evento no banco local
    const eventoLocal = await prisma.tbl_eventos_calendar.findUnique({
      where: { id: Number(eventoIdLocal) }
    })

    if (!eventoLocal) {
      return res.status(404).json({ error: 'Evento local não encontrado' })
    }

    // Busca conta Google vinculada
    const conta = await prisma.tbl_contas_google.findFirst({
      where: { tbl_usuario_id: Number(userId) }
    })

    if (!conta) {
      return res.status(404).json({ error: 'Usuário não possui conta Google vinculada' })
    }

    // Configura OAuth2
    oauth2Client.setCredentials({
      access_token: conta.access_token,
      refresh_token: conta.refresh_token
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Atualiza evento no Google Calendar
    const eventUpdate = {
      summary: titulo || eventoLocal.titulo,
      description: descricao || eventoLocal.descricao,
      location: local || eventoLocal.local,
      start: {
        dateTime: inicio || eventoLocal.inicio,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: fim || eventoLocal.fim,
        timeZone: 'America/Sao_Paulo'
      }
    }

    await calendar.events.update({
      calendarId: 'primary',
      eventId: eventoLocal.google_event_id,
      requestBody: eventUpdate
    })

    // Atualiza também no banco local
    const eventoAtualizado = await prisma.tbl_eventos_calendar.update({
      where: { id: eventoLocal.id },
      data: {
        titulo: eventUpdate.summary,
        descricao: eventUpdate.description,
        local: eventUpdate.location,
        inicio: eventUpdate.start.dateTime,
        fim: eventUpdate.end.dateTime
      }
    })

    res.json({
      success: true,
      message: '🗓️ Evento atualizado com sucesso!',
      evento: eventoAtualizado
    })
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    res.status(500).json({ error: 'Erro ao atualizar evento', details: error.message })
  }
})

// ----------------------------------------------------------
// GET /v1/calendar/events
// ----------------------------------------------------------
router.get('/v1/calendar/events', async (req, res) => {
  try {
    const userId = req.query.userId

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    // Busca todos os eventos locais do usuário
    const eventos = await prisma.tbl_eventos_calendar.findMany({
      where: { tbl_usuario_id: Number(userId) },
      orderBy: { inicio: 'asc' }
    })

    res.json({
      success: true,
      eventos
    })
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    res.status(500).json({ error: 'Erro ao listar eventos', details: error.message })
  }
})



export default router

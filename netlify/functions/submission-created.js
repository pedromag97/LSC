/* ============================================================
   GRUPO LSC — Email com design para os formulários do site
   (pedido de orçamento de carregadores e contacto)
   ------------------------------------------------------------
   O Netlify chama esta função automaticamente sempre que um
   formulário recebe uma submissão válida ("submission-created").
   Monta um email em HTML e envia-o através do Resend.

   Variáveis de ambiente (Netlify → Site configuration → Environment variables):
     RESEND_API_KEY  chave da API do Resend (obrigatória; sem ela não envia)
     MAIL_FROM       remetente, ex.: "Grupo LSC <orcamentos@lusocabo.com>"
                     (o domínio tem de estar validado no Resend)
     MAIL_TO         destinatário; por omissão geral@lusocabo.com
   ============================================================ */

const FORMS = ["orcamento-carregadores", "contacto"];
const SITE = "https://lusocabo.com";

const NAVY = "#0c2c4e";
const BLUE = "#1565c0";
const ACCENT = "#f59e0b";
const MUTED = "#5b6b7c";
const LINE = "#e3e9f0";
const SOFT = "#f3f6fa";

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Os nomes dos campos têm acentos e espaços; comparar de forma tolerante. */
function norm(k) {
  return String(k).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function reader(data) {
  const map = {};
  Object.keys(data || {}).forEach(function (k) { map[norm(k)] = data[k]; });
  return function (name) {
    const v = map[norm(name)];
    return v === undefined || v === null ? "" : v;
  };
}

function row(label, value) {
  if (!value) return "";
  return '<tr>' +
    '<td style="padding:10px 0;border-bottom:1px solid ' + LINE + ';font:500 13px Arial,Helvetica,sans-serif;color:' + MUTED + ';width:42%;vertical-align:top;">' + esc(label) + '</td>' +
    '<td style="padding:10px 0;border-bottom:1px solid ' + LINE + ';font:600 14px Arial,Helvetica,sans-serif;color:#25313d;vertical-align:top;">' + esc(value) + '</td>' +
    '</tr>';
}

function heading(text) {
  return '<p style="margin:28px 0 6px;font:700 12px Arial,Helvetica,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:' + BLUE + ';">' + esc(text) + '</p>';
}

function button(href, text, primary) {
  const bg = primary ? ACCENT : "#ffffff";
  const color = primary ? "#1b1b1b" : NAVY;
  const border = primary ? ACCENT : NAVY;
  return '<a href="' + esc(href) + '" style="display:inline-block;margin:0 8px 8px 0;padding:11px 20px;border-radius:999px;border:1.5px solid ' + border + ';background:' + bg + ';color:' + color + ';font:700 14px Arial,Helvetica,sans-serif;text-decoration:none;">' + esc(text) + '</a>';
}

function photo(label, file) {
  if (!file || typeof file !== "object" || !file.url) return "";
  return '<td style="padding:0 10px 10px 0;vertical-align:top;width:33%;">' +
    '<a href="' + esc(file.url) + '" style="text-decoration:none;">' +
    '<img src="' + esc(file.url) + '" alt="' + esc(label) + '" width="170" style="display:block;width:100%;max-width:170px;height:auto;border-radius:10px;border:1px solid ' + LINE + ';">' +
    '<span style="display:block;margin-top:6px;font:600 12px Arial,Helvetica,sans-serif;color:' + MUTED + ';">' + esc(label) + '</span>' +
    '</a></td>';
}

function buildEmail(formName, data, createdAt) {
  const get = reader(data);
  const isContact = formName === "contacto";
  const nome = get("Nome") || get("name");
  const tel = get("Telemóvel") || get("phone");
  const email = get("email");
  const local = get("Localidade");
  const assunto = get("assunto");
  const obs = get("Observações") || get("message");

  const when = new Date(createdAt || Date.now()).toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const instalacao =
    row("Tipo de local", get("Tipo de local")) +
    row("Carregador", get("Equipamento")) +
    row("Instalação elétrica", get("Alimentação")) +
    row("Potência pretendida", get("Potência do carregador")) +
    row("Potência contratada", get("Potência contratada")) +
    row("Distância do quadro ao carregador", get("Distância ao quadro (m)") ? get("Distância ao quadro (m)") + " m" : "") +
    row("Veículo", get("Veículo")) +
    row("N.º de carregadores", get("N.º de carregadores"));

  const fotos =
    photo("Quadro elétrico", get("Foto do quadro elétrico")) +
    photo("Local do carregador", get("Foto do local")) +
    photo("Outra fotografia", get("Outra foto"));

  const telHref = "tel:" + String(tel).replace(/[^\d+]/g, "");
  const mailHref = "mailto:" + email + "?subject=" + encodeURIComponent(isContact ? "Re: " + (assunto || "Contacto Grupo LSC") : "Orçamento — Carregador para veículo elétrico");

  const html =
'<!DOCTYPE html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedido de orçamento</title></head>' +
'<body style="margin:0;padding:0;background:' + SOFT + ';">' +
'<div style="display:none;max-height:0;overflow:hidden;">' + esc(nome) + ' · ' + esc(local) + ' · ' + esc(isContact ? assunto : get("Tipo de local")) + '</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + SOFT + ';"><tr><td align="center" style="padding:28px 12px;">' +
'<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ' + LINE + ';">' +

/* Cabeçalho */
'<tr><td style="background:' + NAVY + ';padding:24px 32px;">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
'<td style="vertical-align:middle;"><img src="' + SITE + '/assets/images/LOGO-sem_bg.png" alt="Grupo LSC" height="40" style="display:inline-block;height:40px;width:auto;vertical-align:middle;background:#ffffff;border-radius:8px;padding:4px;">' +
'<span style="font:700 18px Arial,Helvetica,sans-serif;color:#ffffff;vertical-align:middle;padding-left:10px;">GRUPO <span style="color:' + ACCENT + ';">LSC</span></span></td>' +
'<td align="right" style="font:500 12px Arial,Helvetica,sans-serif;color:#b9c7d8;vertical-align:middle;">' + esc(when) + '</td>' +
'</tr></table></td></tr>' +
'<tr><td style="height:4px;background:' + ACCENT + ';font-size:0;line-height:0;">&nbsp;</td></tr>' +

/* Corpo */
'<tr><td style="padding:30px 32px 8px;">' +
'<p style="margin:0 0 6px;font:700 12px Arial,Helvetica,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:' + ACCENT + ';">' + (isContact ? 'Formulário de contacto' : 'Carregadores para veículos elétricos') + '</p>' +
'<h1 style="margin:0 0 6px;font:700 24px Arial,Helvetica,sans-serif;color:' + NAVY + ';">' + (isContact ? 'Nova mensagem do site' : 'Novo pedido de orçamento') + '</h1>' +
'<p style="margin:0;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:' + MUTED + ';"><strong style="color:#25313d;">' + esc(nome) + '</strong>' + (local ? ' · ' + esc(local) : '') + '</p>' +

heading("Cliente") +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
row("Nome", nome) + row("Telemóvel", tel) + row("Email", email) + row("Localidade", local) + row("Assunto", assunto) + row("Origem", get("Origem")) +
'</table>' +
'<p style="margin:18px 0 0;">' +
(tel ? button(telHref, "Ligar ao cliente", true) : "") +
(email ? button(mailHref, "Responder por email", !tel) : "") +
'</p>' +

(instalacao ? heading("Instalação") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + instalacao + '</table>' : "") +

(obs ? heading(isContact ? "Mensagem" : "Observações") +
'<div style="background:' + SOFT + ';border-left:4px solid ' + ACCENT + ';border-radius:8px;padding:14px 16px;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:#25313d;">' + esc(obs).replace(/\r?\n/g, "<br>") + '</div>' : "") +

(fotos ? heading("Fotografias") + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' + fotos + '</tr></table>' +
'<p style="margin:4px 0 0;font:400 12px Arial,Helvetica,sans-serif;color:' + MUTED + ';">Clique numa fotografia para a abrir em tamanho real.</p>' : "") +

'</td></tr>' +

/* Rodapé */
'<tr><td style="padding:24px 32px 28px;">' +
'<p style="margin:0;padding-top:18px;border-top:1px solid ' + LINE + ';font:400 12px/1.6 Arial,Helvetica,sans-serif;color:' + MUTED + ';">Enviado através do formulário em <a href="' + SITE + (isContact ? '/#contacto' : '/carregadores.html') + '" style="color:' + BLUE + ';">lusocabo.com' + (isContact ? '' : '/carregadores.html') + '</a>.<br>Grupo LSC — Inovação, Transformação e Qualidade</p>' +
'</td></tr>' +

'</table></td></tr></table></body></html>';

  const subject = isContact
    ? "Contacto do site — " + nome + (assunto ? " — " + assunto : "")
    : "Pedido de orçamento — Carregador VE — " + nome + (local ? " (" + local + ")" : "");
  return { subject: subject, html: html, replyTo: email };
}

exports.buildEmail = buildEmail;

exports.handler = async function (event) {
  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload || {};
  } catch (e) {
    return { statusCode: 400, body: "Pedido inválido" };
  }
  if (FORMS.indexOf(payload.form_name) === -1) return { statusCode: 200, body: "Outro formulário — ignorado" };

  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) {
    console.log("RESEND_API_KEY ou MAIL_FROM em falta — email com design não enviado.");
    return { statusCode: 200, body: "Sem configuração de email" };
  }

  const mail = buildEmail(payload.form_name, payload.data || {}, payload.created_at);
  const message = {
    from: from,
    to: [process.env.MAIL_TO || "geral@lusocabo.com"],
    subject: mail.subject,
    html: mail.html
  };
  if (mail.replyTo) message.reply_to = mail.replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
  if (!res.ok) {
    console.error("Resend recusou o envio:", res.status, await res.text());
    return { statusCode: 502, body: "Falha no envio do email" };
  }
  return { statusCode: 200, body: "Email enviado" };
};

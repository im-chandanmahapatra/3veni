// Minimal local SMTP sink for verifying enquiry delivery end-to-end WITHOUT a real mail account (audit C1).
// Accepts any message (any AUTH), keeps every received mail in memory and, optionally, writes it to <dir>/<n>.eml.
//
//   node scripts/smtp-sink.mjs [port=2525] [dir=scratch/smtp-sink]
//
// Then run the site with:
//   SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_USER=sink SMTP_PASS=sink SMTP_FROM=web@example.test ENQUIRY_RECIPIENT_EMAIL=team@example.test
import net from 'node:net';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function startSink({ port = 0, dir } = {}) {
  const messages = [];
  if (dir) mkdirSync(dir, { recursive: true });

  const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    let buffer = '';
    let inData = false;
    let data = '';
    let envelope = { from: '', to: [] };
    let authStep = null;
    const send = (line) => socket.write(line + '\r\n');
    send('220 sink.local ESMTP smtp-sink ready');

    socket.on('data', (chunk) => {
      buffer += chunk;
      for (;;) {
        if (inData) {
          data += buffer;
          buffer = '';
          const end = data.indexOf('\r\n.\r\n');
          if (end === -1) return;
          const raw = data.slice(2, end).replace(/\r\n\.\./g, '\r\n.'); // drop the sentinel CRLF, undo dot-stuffing
          buffer = data.slice(end + 5);
          data = '';
          inData = false;
          const msg = { envelope, raw, index: messages.length + 1 };
          messages.push(msg);
          if (dir) writeFileSync(join(dir, `${msg.index}.eml`), raw, 'utf8');
          envelope = { from: '', to: [] };
          send('250 2.0.0 queued');
          continue;
        }
        const eol = buffer.indexOf('\r\n');
        if (eol === -1) return;
        const line = buffer.slice(0, eol);
        buffer = buffer.slice(eol + 2);
        const upper = line.toUpperCase();

        if (authStep === 'user') {
          authStep = 'pass';
          send('334 UGFzc3dvcmQ6');
        } else if (authStep === 'pass') {
          authStep = null;
          send('235 2.7.0 authenticated');
        } else if (upper.startsWith('EHLO') || upper.startsWith('HELO')) {
          socket.write('250-sink.local\r\n250-AUTH PLAIN LOGIN\r\n250-8BITMIME\r\n250 SIZE 10485760\r\n');
        } else if (upper.startsWith('AUTH PLAIN')) {
          send('235 2.7.0 authenticated');
        } else if (upper.startsWith('AUTH LOGIN')) {
          authStep = 'user';
          send('334 VXNlcm5hbWU6');
        } else if (upper.startsWith('MAIL FROM:')) {
          envelope.from = line.slice(10).trim();
          send('250 2.1.0 ok');
        } else if (upper.startsWith('RCPT TO:')) {
          envelope.to.push(line.slice(8).trim());
          send('250 2.1.5 ok');
        } else if (upper === 'DATA') {
          inData = true;
          data = '\r\n'; // sentinel so an empty body's terminator is still detected
          send('354 end with <CRLF>.<CRLF>');
        } else if (upper === 'RSET' || upper === 'NOOP') {
          send('250 ok');
        } else if (upper === 'QUIT') {
          send('221 2.0.0 bye');
          socket.end();
          return;
        } else {
          send('502 5.5.2 command not recognised');
        }
      }
    });
    socket.on('error', () => {});
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({
        port: server.address().port,
        messages,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.argv[2] || 2525);
  const dir = process.argv[3] || 'scratch/smtp-sink';
  const sink = await startSink({ port, dir });
  console.log(`smtp-sink listening on 127.0.0.1:${sink.port} — messages are written to ${dir}/`);
}

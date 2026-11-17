import { spawn } from 'node:child_process';

function parseCliArgs(argv) {
  let port = process.env.PORT || '3000';
  let host = process.env.HOST || '0.0.0.0';

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if ((arg === '--port' || arg === '-p') && argv[i + 1]) {
      port = argv[i + 1];
      i++;
    } else if (arg.startsWith('--port=')) {
      port = arg.split('=')[1] || port;
    } else if ((arg === '--host' || arg === '-H' || arg === '--hostname') && argv[i + 1]) {
      host = argv[i + 1];
      i++;
    } else if (arg.startsWith('--host=')) {
      host = arg.split('=')[1] || host;
    }
  }

  return { port, host };
}

const { port, host } = parseCliArgs(process.argv.slice(2));

const isWindows = process.platform === 'win32';
const child = spawn('npx', ['next', 'start', '-p', port, '-H', host], {
  stdio: 'inherit',
  env: process.env,
  shell: isWindows,
});

child.on('exit', (code, signal) => {
  if (signal) {
    try {
      process.kill(process.pid, signal);
    } catch {
      process.exit(1);
    }
    return;
  }
  process.exit(code ?? 0);
});

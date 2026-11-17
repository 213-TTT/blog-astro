import { spawn } from 'node:child_process';

const gh = 'D:\\GitHubCLI\\bin\\gh.exe';
const configDir = 'D:\\GitHubCLI\\config';

const proc = spawn(gh, [
  'auth', 'login',
  '--hostname', 'github.com',
  '--git-protocol', 'https',
  '--scopes', 'workflow,repo,user',
  '--web',
], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    GH_CONFIG_DIR: configDir,
    GH_GIT_PATH: 'D:\\Git\\bin\\git.exe',
  },
});

// 自动回答 "y" 确认
proc.stdin.write('y\n');

let output = '';
proc.stdout.on('data', (data) => {
  const str = data.toString();
  output += str;
  process.stdout.write(str);
});

proc.stderr.on('data', (data) => {
  const str = data.toString();
  output += str;
  process.stderr.write(str);
});

proc.on('close', (code) => {
  console.log(`\n[gh auth login exited with code ${code}]`);
  process.exit(code);
});

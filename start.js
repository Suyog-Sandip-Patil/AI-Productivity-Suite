const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Mindful Day Application...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Wait a moment then start frontend
setTimeout(() => {
  console.log('🎨 Starting frontend development server...');
  const frontend = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, 'client')
  });

  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
    backend.kill();
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

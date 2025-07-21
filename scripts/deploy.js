// scripts/deploy.js
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mensagensAleatorias = [
  "feat: melhorias no mapa 🗺️",
  "fix: correções e ajustes 🔧", 
  "style: melhorias visuais ✨",
  "refactor: organizando código 🧹",
  "feat: novas funcionalidades 🚀",
  "update: atualizações gerais 🔄",
  "improvement: aprimoramentos 📈",
  "feature: nova implementação 🎉"
];

function deployRapido() {
  const mensagem = mensagensAleatorias[Math.floor(Math.random() * mensagensAleatorias.length)];
  const timestamp = new Date().toLocaleString('pt-BR');
  const commitMsg = `${mensagem} - ${timestamp}`;
  
  console.log('🚀 Deploy Rápido');
  console.log(`📝 Mensagem: ${commitMsg}`);
  
  exec(`git add . && git commit -m "${commitMsg}" && git push origin main`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erro: ${error.message}`);
      return;
    }
    console.log('✅ Deploy concluído!');
    if (stdout) console.log(stdout);
  });
}

function deployPersonalizado() {
  rl.question('📝 Digite sua mensagem de commit: ', (mensagem) => {
    if (!mensagem.trim()) {
      mensagem = mensagensAleatorias[Math.floor(Math.random() * mensagensAleatorias.length)];
    }
    
    exec(`git add . && git commit -m "${mensagem}" && git push origin main`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erro: ${error.message}`);
      } else {
        console.log('✅ Deploy concluído!');
      }
      rl.close();
    });
  });
}

// Verificar argumento
const modo = process.argv[2];

if (modo === '--custom' || modo === '-c') {
  deployPersonalizado();
} else {
  deployRapido();
}
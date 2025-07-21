// scripts/deploy.js
const { exec } = require('child_process');
const readline = require('readline');

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
  console.log('⏳ Executando comandos...');
  
  exec(`git add . && git commit -m "${commitMsg}" && git push origin main`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erro: ${error.message}`);
      process.exit(1); // ← SAÍDA COM ERRO
    }
    
    console.log('✅ Deploy concluído com sucesso!');
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    
    process.exit(0); // ← SAÍDA NORMAL
  });
}

function deployPersonalizado() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('📝 Digite sua mensagem de commit: ', (mensagem) => {
    if (!mensagem.trim()) {
      mensagem = mensagensAleatorias[Math.floor(Math.random() * mensagensAleatorias.length)];
    }
    
    console.log('⏳ Executando comandos...');
    
    exec(`git add . && git commit -m "${mensagem}" && git push origin main`, (error, stdout, stderr) => {
      rl.close(); // ← FECHAR READLINE PRIMEIRO
      
      if (error) {
        console.error(`❌ Erro: ${error.message}`);
        process.exit(1); // ← SAÍDA COM ERRO
      }
      
      console.log('✅ Deploy concluído com sucesso!');
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      
      process.exit(0); // ← SAÍDA NORMAL
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
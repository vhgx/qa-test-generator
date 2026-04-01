import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { runQAPipeline } from './src/pipeline.js';

// Função para salver o output
function saveToFile(content, filename) {
  const dir = path.resolve('output');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
}

async function main() {
  console.clear();
  console.log(chalk.bold.magenta('╔══════════════════════════════════════════╗'));
  console.log(chalk.bold.magenta('║        QA TEST GENERATOR AGENT           ║'));
  console.log(chalk.bold.magenta('╚══════════════════════════════════════════╝'));
  console.log(chalk.gray('Rodando com LLM provider configurado no ./src/llmClient.js e .env\n'));

  const { requirement } = await inquirer.prompt([
    {
      type: 'input',
      name: 'requirement',
      message: 'Descreva o requisito funcional (ex: "Usuário deve conseguir recuperar senha por SMS"):',
      validate: (input) => input.length > 5 ? true : 'Por favor, insira um requisito válido.'
    }
  ]);

  console.log('');
  const spinner = ora({
    text: 'Iniciando o agente QA...',
    color: 'cyan'
  }).start();

  try {
    const updateProgress = (msg) => {
      spinner.text = msg;
    };

    const results = await runQAPipeline(requirement, updateProgress);

    spinner.succeed(chalk.green('Pipeline concluído com sucesso! Gerando relatório...\n'));

    // Exibindo no Terminal
    console.log(chalk.bgBlue.bold('\n 1. INTERPRETAÇÃO DO REQUISITO '));
    console.log(results.interpretation);

    console.log(chalk.bgGreen.bold('\n 2. CENÁRIOS BDD (GHERKIN) '));
    console.log(results.bdd);

    console.log(chalk.bgMagenta.bold('\n 3. CASOS DE TESTE ESTRUTURADOS '));
    console.log(results.testCases);

    console.log(chalk.bgYellow.black.bold('\n 4. CÓDIGO AUTOMATIZADO (PLAYWRIGHT) '));
    console.log(results.playwrightCode);

    console.log(chalk.bgRed.bold('\n 5. EDGE CASES & TESTES EXTREMOS '));
    console.log(results.edgeCases);

    // Salvando em disco
    const timestamp = Date.now();
    saveToFile(
      `# Requisito: ${requirement}\n\n## Interpretação\n${results.interpretation}\n\n## BDD\n${results.bdd}\n\n## Casos de Teste\n${results.testCases}\n\n## Edge Cases\n${results.edgeCases}`, 
      `tests_${timestamp}.md`
    );
    saveToFile(results.playwrightCode.replace(/\`\`\`javascript|\`\`\`/g, ''), `tests_${timestamp}.spec.js`);

    console.log(chalk.green(`\n[✔] Resultados também salvos na pasta ./output/`));

  } catch (error) {
    spinner.fail(chalk.red('Falha na geração dos testes.'));
    console.error(chalk.red(error.message));
  }
}

main();

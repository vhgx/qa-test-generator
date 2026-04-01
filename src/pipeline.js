import { generateContent } from './llmClient.js';
import { PROMPTS } from './prompts.js';

/**
 * Pipeline de orquestração de testes.
 * Executa as 5 etapas sequencialmente, passando o contexto acumulado a cada passo.
 */
export async function runQAPipeline(requirement, updateProgress) {
  try {
    // Passo 1: Interpretação
    if (updateProgress) updateProgress('1/5: Analisando requisito e extraindo detalhes...');
    const interpretation = await generateContent(
      PROMPTS.INTERPRETATION,
      `Requisito Funcional: "${requirement}"`
    );

    // Passo 2: Cenários BDD
    if (updateProgress) updateProgress('2/5: Gerando cenários Gherkin (BDD)...');
    const contextForBdd = `Requisito Original: ${requirement}\n\nInterpretação:\n${interpretation}`;
    const bdd = await generateContent(PROMPTS.BDD, contextForBdd);

    // Passo 3: Casos de Teste Estruturados
    if (updateProgress) updateProgress('3/5: Formatando casos de teste em tabela...');
    const contextForTable = `Cenários BDD:\n${bdd}`;
    const testCases = await generateContent(PROMPTS.TEST_CASES, contextForTable);

    // Passo 4: Código Playwright
    if (updateProgress) updateProgress('4/5: Gerando código de automação Playwright...');
    const contextForCode = `Requisito Original: ${requirement}\nCasos de Teste:\n${testCases}`;
    const playwrightCode = await generateContent(PROMPTS.PLAYWRIGHT, contextForCode);

    // Passo 5: Edge Cases
    if (updateProgress) updateProgress('5/5: Identificando edge cases maliciosos e robustez...');
    const contextForEdgeCases = `Requisito: ${requirement}\nCenários e Testes Atuais:\n${bdd}\n\nCódigo Playwright:\n${playwrightCode}`;
    const edgeCases = await generateContent(PROMPTS.EDGE_CASES, contextForEdgeCases);

    return {
      interpretation,
      bdd,
      testCases,
      playwrightCode,
      edgeCases
    };

  } catch (error) {
    throw new Error(`Falha no pipeline de QA: ${error.message}`);
  }
}

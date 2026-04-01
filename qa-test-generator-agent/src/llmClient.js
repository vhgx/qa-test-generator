import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Configurado para apontar para o LM Studio por padrão, mas pode ser sobrescrito no .env
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || 'http://localhost:1234/v1',
  apiKey: process.env.OPENAI_API_KEY || 'lm-studio',
});

const MODEL = process.env.OPENAI_MODEL || 'local-model'; // LM Studio ignora o nome do modelo na maioria das vezes

/**
 * Chama a API do LLM com um system prompt e um user prompt.
 * @param {string} systemPrompt - Instruções de comportamento.
 * @param {string} userContext - Contexto ou requisito do usuário.
 * @returns {Promise<string>} - Resposta do modelo.
 */
export async function generateContent(systemPrompt, userContext) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContext }
      ],
      temperature: 0.1, // temperatura baixa para respostas determinísticas e estruturadas
      max_tokens: 2500,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Erro ao chamar o LLM: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n[!] DICA: O LM Studio está rodando? Verifique se o Local Server foi iniciado na porta 1234.');
    }
    throw error;
  }
}

# QA Test Generator Agent

Uma ferramenta de linha de comando (CLI) baseada em LLM que recebe um requisito funcional (User Story) e gera automaticamente toda a documentação e código de QA necessários.

A ferramenta executa um pipeline que injeta continuamente o resultado da etapa anterior como contexto na próxima etapa, garantindo fidelidade de escopo.

## Entregáveis Gerados:
1. **Interpretação Estruturada** do requisito
2. **Cenários BDD (Gherkin)**
3. **Casos de Teste Estruturados** (tabela markdown)
4. **Código de automação em Playwright** usando JavaScript
5. **Sugestões de Edge Cases**

---

## 🚀 Como Executar

### 1. Pré-Requisitos
- [Node.js](https://nodejs.org/) (versão 16+)
- Um provedor de LLM rodando na sua máquina (ex: [LM Studio](https://lmstudio.ai/) ou Ollama), ou caso opte por usar a OpenAI, altere no `.env`.

### 2. Instalação

```bash
# Instale as dependências
npm install
```

### 3. Configuração do LLM (Padrão: LM Studio Local)

Por padrão, o projeto aponta para `http://localhost:1234/v1`, que é a porta padrão do LM Studio rodando localmente no modo "Local Server".

Basta abrir o LM Studio, carregar um modelo de código ou de linguagem de sua preferência (recomendações: `Qwen2.5-Coder-7B`, `Llama-3-8B-Instruct`), e clicar em **"Start Server"**.

Se você quiser alterar a URL ou usar a OpenAI, crie/edite o arquivo `.env` na raiz:

```env
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_API_KEY=sua-chave-se-necessario
OPENAI_MODEL=nome-do-seu-modelo
```

### 4. Executando a Aplicação

Inicie a aplicação executando:

```bash
node index.js
```

A aplicação fará uma pergunta no terminal:
> **Descreva o requisito funcional (ex: "Usuário deve conseguir recuperar senha por SMS"):**

Digite o seu requisito, pressione Enter e acompanhe a geração em 5 etapas no terminal!

Os arquivos brutos (`.md` e `.spec.js`) serão gerados automaticamente dentro da pasta `output/`.

---

## 📁 Estrutura do Projeto

```text
.
│
├── src/
│   ├── llmClient.js    # Cliente do LLM
│   ├── pipeline.js     # Orquestrador das 5 etapas
│   └── prompts.js      # Prompts otimizados para cada etapa
│
├── output/             # Os artefatos gerados são salvos aqui
│
├── .env                # Variáveis de ambiente (ignorado pelo git)
├── .gitignore          # Arquivos ignorados pelo git
├── index.js            # Interface CLI principal
├── package.json        
└── README.md
```


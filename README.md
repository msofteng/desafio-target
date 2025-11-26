## desafio-target

Essa aplicação tem como objetivo apresentar a resolução de problemas do desafio para vaga de ["Desenvolvedor de Sistemas Jr."](https://targetsistemas.gupy.io/jobs/10385832) na [Target Sistemas](https://targetsistemas.com.br/)

Não há nenhum pré-requisito para rodar esse projeto além do ambiente Node.js de qualquer versão instalado em seu computador

### Documentação

Esse programa tem 3 aplicações que são acessadas via terminal:

- `comissionamento` lê os registros de vendas e calcula a comissão de cada vendedor
- `controle-estoque` acessa os dados do estoque e realiza movimentações dos itens
- `calculo-juros` calcula o total de juros com base no valor a pagar e sua data de vencimento

### Como usar

Cada aplicativo pode ser acessado rodando o `index.js` dentro do Node.js com o argumento `--app` que indica a aplicação que o sistema irá abrir

#### Exemplo:
```bash
node index.js --app=comissionamento # abrindo o aplicativo de cálculo de comissões por vendedor
```

### Estrutura

Veja na tabela a seguir quais os parâmetros necessários para rodar cada aplicação:

#### comissionamento (ex.: `--app=comissionamento`)

nome | descrição | exemplo (uso)
---- | --------- | -------------
`--file` | localização do arquivo JSON onde estão os registros de vendas do time comercial | `--file=./vendas.json`

#### controle-estoque (ex.: `--app=controle-estoque`)

nome | descrição | exemplo (uso)
---- | --------- | -------------
`--file` | localização do arquivo JSON com dados do estoque | `--file=./estoque.json`

#### calculo-juros (ex.: `--app=calculo-juros`)

> Não exige parâmetros adicionais

### Exemplo

```bash
> node index.js --app=controle-estoque --file=./estoque.json # abre o sistema com a aplicação de controle de estoque carregando os itens do arquivo "estoque.json"
```

#### Resultado

```
> ======= CONTROLE DE ESTOQUE =======
> 
> Itens (Estoque):
> -----------------------------------
> cód.   nome        qtd. 
> -----------------------------------
> 101 - Caneta Azul (150 disponíveis)
> 102 - Caderno Universitário (75 disponíveis)
> ...
> sair - finalizar
> show - exibir as movimentações
> 
> digite o código do produto:
> 
```

🧑🏻‍💻😉
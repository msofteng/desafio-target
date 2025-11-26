const fs = require('fs');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value;
  return acc;
}, {});

if (args.app == 'comissionamento') {
  if (!args.file) {
    console.log('Indique um arquivo com os dados da venda para continuar')
    process.exit(0);
  }

	console.log('======= CÁLCULO DE COMISSÃO =======');

  const data = fs.readFileSync(args.file, 'utf8');
  const dados = JSON.parse(data);

  if (!dados.vendas) {
    console.log('Arquivo inválido');
    process.exit(0);
  }

  const vendedores = [...new Set(dados.vendas.map(venda => venda.vendedor))];

  const calculaComissao = (valor) => {
    if (valor < 100) {
      return 0;
    }

    else if (valor >= 100 && valor < 500) {
      return valor * 0.01;
    }

    else {
      return valor * 0.05;
    }
  }

  const construirRelatorioVendedor = (vendedor) => {
    const dadosVendedor = {
      nomeVendedor: vendedor,
      vendas: dados.vendas
                .filter(venda => venda.vendedor === vendedor)
                .map(venda => ({
                  valorVenda: venda.valor,
                  valorComissao: calculaComissao(venda.valor)
                }))
    };
    
    return {
      ...dadosVendedor,
      totalComissao: dadosVendedor.vendas
                      .map(venda => venda.valorComissao)
                      .reduce((acumulador, valorAtual) => acumulador + valorAtual, 0)
    };
  }

  const comissionamento = vendedores.map(vendedor => construirRelatorioVendedor(vendedor))

  console.log('');

  for (const vendedor of comissionamento) {
    console.log(`Vendedor: ${vendedor.nomeVendedor}`);
    console.log(`Total de comissão: ${formatarMoeda(vendedor.totalComissao)}`);
    console.log(`Total de vendas: ${vendedor.vendas.length}`);
    console.log('')
  }

	process.exit(0);
}

else if (args.app == 'controle-estoque') {
  if (!args.file) {
    console.log('Indique um arquivo com os dados do estoque para continuar')
    process.exit(0);
  }

  const data = fs.readFileSync(args.file, 'utf8');
  const dados = JSON.parse(data);

  if (!dados.estoque) {
    console.log('Arquivo inválido');
    process.exit(0);
  }

	console.log('======= CONTROLE DE ESTOQUE =======');

  var estoque = dados.estoque;
  const movimentacoes = [];

  const movimentarEstoque = () => {
    rl.question(`\nItens (Estoque):\n-----------------------------------\ncód.   nome        qtd. \n-----------------------------------\n${estoque.map((produto) => `${produto.codigoProduto} - ${produto.descricaoProduto} (${produto.estoque} disponíveis)`).join('\n')}\nsair - finalizar\nshow - exibir as movimentações\n\ndigite o código do produto:\n`, (codigoProduto) => {
      if (codigoProduto === 'sair') {
        console.log('Saindo...');
        rl.close();
        process.exit(0);
      }

      if (codigoProduto === 'show') {
        console.log()
        console.log('Movimentações:');
        console.log('Quantidade: ' + movimentacoes.length);
        for (const movimentacao of movimentacoes) {
          console.log(`[${movimentacao.operacao}] ${movimentacao.descricaoProduto} - ${movimentacao.quantidade} itens ${ movimentacao.operacao === 'Entrada' ? 'adicionados' : 'removidos' }`);
        }
        console.log()

        return movimentarEstoque();
      }
        
      const produto = estoque.find(produto => produto.codigoProduto.toString() === codigoProduto);

      if (!produto) {
        console.log('>>> Produto não encontrado <<<');
        return movimentarEstoque();
      }

      rl.question('\nSelecione a operação:\n1 - Entrada\n2 - Saída\n', (operacao) => {
        if (!['1', '2'].includes(operacao)) {
          console.log('>>> Operação inválida <<<');
          return movimentarEstoque();
        }

        rl.question('\nQuantidade: \n', (quantidade) => {
          if (isNaN(parseInt(quantidade))) {
            console.log('>>> Quantidade inválida <<<');
            return movimentarEstoque();
          }

          if (operacao === '2' && parseInt(quantidade) > produto.estoque) {
            console.log('>>> Quantidade insuficiente em estoque <<<');
            return movimentarEstoque();
          }

          movimentacoes.push({
            id: movimentacoes.length + 1,
            codigoProduto: produto.codigoProduto,
            descricaoProduto: produto.descricaoProduto,
            operacao: operacao === '1' ? 'Entrada' : 'Saída',
            quantidade: parseInt(quantidade)
          });

          estoque = estoque.map(produto => {
            if (produto.codigoProduto === parseInt(codigoProduto)) {
              return {
                ...produto,
                estoque: operacao === '1' ? produto.estoque + parseInt(quantidade) : produto.estoque - parseInt(quantidade)
              };
            }

            return produto;
          });

          console.log('Movimentação registrada com sucesso!');
          return movimentarEstoque();
        });
      });
    })
  }

  movimentarEstoque();
}

else if (args.app == 'calculo-juros') {
  console.log('======= CÁLCULO DE JUROS =======');

  rl.question('\nInsira o valor (formato 000.000.000,00):\n', (valor) => {
    if (isNaN(parseFloat(valor))) {
      console.log('>>> Valor inválido <<<');
      rl.close();
      process.exit(0);
    }

    rl.question('\nInsira a data de vencimento (formato DD/MM/AAAA):\n', (dataVencimento) => {
      const dataAtual = new Date();
      const dataVencimentoDate = new Date(dataVencimento.split('/').reverse().join('-'));

      if (dataVencimentoDate.toString() === 'Invalid Date') {
        console.log('>>> Data de vencimento inválida <<<');
        rl.close();
        process.exit(0);
      }

      const valorTotal = parseFloat(valor.replaceAll('.', '').replaceAll(',', '.'));

      let diasAtraso = Math.ceil((dataAtual - dataVencimentoDate) / (1000 * 60 * 60 * 24)) - 1;

      if (diasAtraso < 0) {
        diasAtraso = 0;
      }

      // multa de 2,5% por dia de atraso
      const valorJuros = ((valorTotal * 0.025) * diasAtraso)

      console.log()
      console.log(`Valor: ${formatarMoeda(valorTotal)}`);
      console.log(`Dias de atraso: ${diasAtraso} dia(s)`)
      console.log(`Data de vencimento: ${dataVencimento}`);
      console.log('Total a pagar: ' + formatarMoeda(valorTotal + valorJuros))
      console.log(`Juros (2,5% ao dia): ${formatarMoeda(valorJuros)}`);

      rl.close();
      process.exit(0);
    });

  })
}

else {
  console.log('Nenhum aplicativo selecionado')
}
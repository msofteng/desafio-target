const fs = require('fs');

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [key, value] = arg.replace(/^--/, '').split('=');
	acc[key] = value;
	return acc;
}, {});

if (args.app == 'comissionamento') {
	if (!args.file) {
		console.log('Indique um arquivo com os dados da venda para continuar')
		return;
	}

	const data = fs.readFileSync(args.file, 'utf8');
	const dados = JSON.parse(data);

	if (!dados.vendas) {
		console.log('Arquivo inválido');
		return;
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

	for (const vendedor of comissionamento) {
		console.log(`Vendedor: ${vendedor.nomeVendedor}`);
		console.log(`Total de comissão: ${vendedor.totalComissao.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		})}`);
		console.log(`Total de vendas: ${vendedor.vendas.length}`);
		console.log('')
	}
}

else if (args.app == 'controle-estoque') {
	if (!args.file) {
		console.log('Indique um arquivo com os dados do estoque para continuar')
		return
	}
}

else if (args.app == 'calculo-juros') {
	if (!args.valor) {
		console.log('Indique um valor para continuar')
		return
	}
}

else {
	console.log('Nenhum aplicativo selecionado')
}
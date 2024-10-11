import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API Mercado', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';

  p.request.setDefaultTimeout(90000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('MERCADO', () => {
    it('Get Mercado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/mercado`)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('acougue');
    });

    it('Adiciona um novo mercado', async () => {
      await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .withHeaders({
          'Content-Type': 'application/json'
        })
        .withJson({
          nome: 'Mercado Exemplo',
          cnpj: '12345678000199',
          endereco: 'Rua Exemplo, 123'
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          nome: 'Mercado Exemplo',
          cnpj: '12345678000199',
          endereco: 'Rua Exemplo, 123'
        });
    });

    const mercadoId = 1;
    it('Altera um mercado existente', async () => {
      await p
        .spec()
        .put(`${baseUrl}/mercado/${mercadoId}`)
        .withJson({
          cnpj: '76269798000101',
          endereco: 'Rua Alterada, 456, Cidade Alterada, Estado, 00000-001',
          nome: 'Novo Nome do Mercado LTDA',
          produtos: {
            acougue: [
              {
                bovinos: [
                  {
                    nome: 'Picanha',
                    preco: 60
                  }
                ]
              }
            ]
          }
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            cnpj: { type: 'string' },
            endereco: { type: 'string' }
          },
          required: ['id', 'nome', 'cnpj', 'endereco']
        });
    });

    it('Obtém os produtos de um mercado específico', async () => {
      await p
        .spec()
        .get(`${baseUrl}/mercado/1/produtos`)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('massas');
    });
  });
});

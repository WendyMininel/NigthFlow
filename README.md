# NigthFlow


## Descrição

**NIGHTFLOW** é uma plataforma de gestão de eventos especializada em festas e shows. O sistema permite que organizadores criem e gerenciem seus eventos, enquanto participantes podem visualizar eventos disponíveis, comprar ingressos e acompanhar suas entradas.

---

## Protótipo

O protótipo foi inicialmente criado no **Canva** e posteriormente migrado para o **Figma** para melhor visualização da navegação entre páginas, permitindo entender claramente para onde cada botão leva.

- **Link do Canva:** [Clique aqui](https://canva.link/dslj97la5d5u7o7)
- **Link do Figma:** [Clique aqui](https://www.figma.com/design/0KJM1h7seGdtyTlu0r3vJ6/Untitled?node-id=0-1&t=pNt2VnFpE3tpVyHC-1)

---

## Avisos Importantes

### Sobre as Imagens
As imagens utilizadas neste projeto foram obtidas através do Google Imagens e são de propriedade de seus respectivos autores. Este é um projeto **educativo/demonstrativo** sem fins comerciais. 

### Sobre os Dados
Todos os dados presentes no protótipo do Figma (incluindo nomes, números, descrições e estatísticas) são **completamente fictícios** e criados apenas para fins de demonstração. Nenhuma informação real foi utilizada.

---

## Estrutura de Navegação

### Páginas
- **Home** - Página inicial da plataforma

### Fluxo do Organizador
Ao clicar em **"Criar Evento"** → Acesso à página do organizador, que contém as opções:
- Criar eventos
- Meus eventos
- Dados

### Fluxo do Comprador/Cliente
Ao clicar em **"Meus ingressos"** ou **"Carrinho"** → Permanece na área do comprador/cliente

---

## Tecnologias

- JavaScript
- React
- Node.js

---

## Product Backlog

| Rank | User Story | Sprint | Prioridade | Estimativa |
|------|------------|--------|------------|------------|
| 1 | Como organizador, quero me cadastrar e fazer login na plataforma, para acessar as funcionalidades de gestão dos meus eventos. | 1 | Alta | 16h |
| 2 | Como organizador, quero criar um novo evento informando título, data, local, gênero musical, descrição e valor do ingresso para disponibilizá-lo aos participantes. | 1 | Alta | 25h |
| 3 | Como participante, quero visualizar uma lista de eventos disponíveis e comprar ingressos online, escolhendo a quantidade e realizando o pagamento, para garantir minha entrada. | 1 | Alta | 28h |
| 4 | Como organizador, quero visualizar a lista de inscritos por evento com opção de exportar para Excel, para gerenciar os participantes e realizar check-in. | 2 | Média | 25h |
| 5 | Como organizador, quero realizar o check-in dos participantes na entrada da festa, validando o ingresso e marcando presença, para controlar o acesso e evitar fraudes. | 2 | Média | 27h |
| 6 | Como organizador, quero criar um cronograma de atividades para o evento com horários e responsáveis, para orientar os participantes. | 2 | Média | 27h |
| 7 | Como organizador, quero visualizar relatórios completos (quantidade de ingressos vendidos, comparecimento), para avaliar o sucesso da festa. | 3 | Alta | 30h |

**Total de horas estimadas:** 178h

---

## Sprints

### Sprint 1 (Prioridade Alta)
| Rank | Funcionalidade | Horas |
|------|----------------|-------|
| 1 | Cadastro e Login | 16h |
| 2 | Criação de Eventos | 25h |
| 3 | Compra de Ingressos | 28h |

**Total Sprint 1:** 69h

### Sprint 2 (Prioridade Média)
| Rank | Funcionalidade | Horas |
|------|----------------|-------|
| 4 | Lista de inscritos + Exportar Excel | 25h |
| 5 | Check-in de participantes | 27h |
| 6 | Cronograma de atividades | 27h |

**Total Sprint 2:** 79h

### Sprint 3 (Prioridade Alta)
| Rank | Funcionalidade | Horas |
|------|----------------|-------|
| 7 | Relatórios completos | 30h |

**Total Sprint 3:** 30h


**Para melhor detalhamento das sprints:** [Clique aqui](https://docs.google.com/spreadsheets/d/161dRP5XLzue6MtjPKxvDc8HS_kAyimDGgbeQHeZ55jc/edit?gid=2038054660#gid=2038054660)

---


## Como Executar o Projeto

1.  **Clone este repositório**

2.  **Executando o Back-end (Node):**
    ```bash
    npm install
    npm install express mysql2 cors body-parser multer
    (conectar com o sql digitando sua senha)
    node server.js
    ```

3.  **Executando o Front-end (React):**
    Em um novo terminal:
    ```bash
    npm start
    ```
4.  **Acesse o link local**

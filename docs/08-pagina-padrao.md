


- ![Computer](../images/prints/computer.png)
  - ![Print](../images/prints/08-pagina-padrao.png)

# PÁGINA PADRÃO

| Ícone               | Legenda                                            |
| ------------------- | -------------------------------------------------- |
| :large_blue_circle: | Campo funcional                                    |
| :no_entry:          | Não possui o campo ou apenas para controle interno |
| :black_circle:      | Campo obrigatório no admin                         |

&nbsp;

**_Observações:_**

Podem ser cadastradas quantas páginas padrões necessárias, apenas substituir o slug.

&nbsp;

**_Informações:_**

| Dúvida                       | Instrução                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Onde cadastrar**           | Páginas                                                                   |
| **Onde será exibido**        | Página padrão                                                             |
| **Cadastro exemplo**         | [Admin](https://template5.vnda.dev/admin/paginas/editar?id=pagina-padrao) |
| **Página para visualização** | [Página](https://template5.vnda.dev/p/pagina-padrao)                      |

**_Orientações sobre os campos:_**

| Campo         | Funcional?     | Orientação                                          |
| ------------- | -------------- | --------------------------------------------------- |
| **Titulo**    | :black_circle: | Titulo da página                                    |
| **Url**       | :black_circle: | `slug`                                              |
| **Descrição** | :black_circle: | Descrição da meta tag. Utilizada para melhorar SEO. |
| **Descrição** | :black_circle: | `.`                                                 |

&nbsp;

## FULLBANNER TOPO

**_Informações:_**

| Dúvida                | Instrução                                                     |
| --------------------- | ------------------------------------------------------------- |
| **Onde cadastrar**    | Banners                                                       |
| **Onde será exibido** | Topo do layout padrão das páginas institucionais              |
| **Cadastro exemplo**  | [Admin](https://template5.vnda.dev/admin/midias/editar?id=87) |

**_Orientações sobre os campos:_**

| Campo         | Funcional?          | Orientação                                                    |
| ------------- | ------------------- | ------------------------------------------------------------- |
| **Imagem**    | :large_blue_circle: | Dimensão sugerida 2280x660 pixels                             |
| **Título**    | :black_circle:      | Alt da imagem                                                 |
| **Subtítulo** | :large_blue_circle: | Upper title a cima do título                                  |
| **Descrição** | :large_blue_circle: | Texto do banner em markdown                                   |
| **Externo?**  | :no_entry:          |                                                               |
| **URL**       | :no_entry:          |                                                               |
| **Posição**   | :black_circle:      | `slug-banner-principal`. Ex: `pagina-padrao-banner-principal` |
| **Cor**       | :large_blue_circle: | Cor do texto                                                  |

&nbsp;

**_Exemplo Descrição do Banner:_**

```md
\#\# título da categoria

Subtítulo vem aqui
```

**OBSERVAÇÃO**: Obrigatório remover as barras antes dos jogos da velha (hashtag).

&nbsp;

## BANNER CONTEÚDO - TEXTO SUPERIOR

**_Informações:_**

| Dúvida                | Instrução                                                     |
| --------------------- | ------------------------------------------------------------- |
| **Onde cadastrar**    | Banners                                                       |
| **Onde será exibido** | Banner texto a baixo do banner topo                           |
| **Cadastro exemplo**  | [Admin](https://template5.vnda.dev/admin/midias/editar?id=88) |

&nbsp;

**_Orientações sobre os campos:_**

| Campo         | Funcional?          | Orientação                                                  |
| ------------- | ------------------- | ----------------------------------------------------------- |
| **Imagem**    | :no_entry:          |                                                             |
| **Título**    | :black_circle:      | Controle interno                                            |
| **Subtítulo** | :no_entry:          | Título da seção de texto superior                           |
| **Descrição** | :large_blue_circle: | Texto da seção em markdown.                                 |
| **Externo?**  | :no_entry:          |                                                             |
| **URL**       | :no_entry:          |                                                             |
| **Posição**   | :black_circle:      | `slug-banner-conteudo`. Ex: `pagina-padrao-banner-conteudo` |
| **Cor**       | :no_entry:          |                                                             |

***

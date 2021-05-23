# seuBarriga
API de transação financeira desenvolvida com NODE guiado pelo TDD


FAÇA FUNCIONAR!

REQUISITOS:
 - NODEJS instalado.
    link: https://nodejs.org/en/
 - Postgrees instalado.
    link: https://www.postgresql.org/download/
 - GIT instalado.
     link: https://git-scm.com/book/pt-br/v2/Come%C3%A7ando-Instalando-o-Git
 
 PASSOS para instalação:
   1º - execute no terminal: git clone https://github.com/GilbertoTADS/seuBarriga.git
      1.1 - execute no terminal: cd seuBarriga.
   2º - Altere as configrações de connexão do postgress em .../seuBarriga/knexfile.js para as suas configurações de bd
   3º - No seu terminal faça:
       3.1 - npm i
       3.2 - execute no terminal: npm run (repita este comando junto de cada opção abaixo por vez e EXATAMENTE nesta ordem) 
          3.2.1 --> knex:run
          3.2.2 --> knex:users
          3.2.3 --> knex:accounts
          3.2.4 --> knex:transaction
  
  TUDO CERTO! OBA!!! VAMOS FAZER FUNCIONAR!!!! let's go my baby ;)
    1º - npm run start
    NOTA: Se tudo deu certo, o projeto já está no ar e pronto para receber requisições HTPP.
    
   QUER TESTAR ???
    2º - Faça no terminal: npm run secure-mode, e veja os resultados ;)
    
    Abraços :)

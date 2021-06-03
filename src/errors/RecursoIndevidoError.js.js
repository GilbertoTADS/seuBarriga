const error = 'Este recurso não pertence ao usuário';
module.exports = function RecursoIndevidoError(message = error) {
  this.name = 'RecursoIndevidoError';
  this.message = message;
};

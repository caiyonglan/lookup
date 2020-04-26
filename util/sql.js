//sql.js
// SQL语句封裝
var user = {
  insert:'INSERT INTO questions(id, name, answer, classname, author) VALUES(?,?,?,?,?)',
  update:'UPDATE questions SET name=?, age=? WHERE id=?',
  delete: 'DELETE FROM questions WHERE id=?',
  queryByName: 'SELECT * FROM questions',
  queryAll: 'SELECT * FROM questions ORDER BY id DESC'
};
module.exports = user;

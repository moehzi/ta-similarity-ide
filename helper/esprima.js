var esprima = require('esprima');

function traverse(node, func) {
  func(node); //1
  for (var key in node) {
    //2
    // console.log(key);
    if (node.hasOwnProperty(key)) {
      //3
      var child = node[key];
      if (typeof child === 'object' && child !== null) {
        //4

        if (Array.isArray(child)) {
          child.forEach(function (node) {
            //5
            traverse(node, func);
          });
        } else {
          traverse(child, func); //6
        }
      }
    }
  }
}
function analyzeCode(code) {
  var ast = esprima.parse(code);
  // console.log(esprima.parse(code));

  let temp = '';
  traverse(ast, function (node) {
    if (node.type === 'Program') node.type = 'A';
    if (node.type === 'AssignmentExpression') node.type = 'B';
    if (node.type === 'BinaryExpression') node.type = 'C';
    if (node.type === 'BlockStatement') node.type = 'D';
    if (node.type === 'CallExpression') node.type = 'E';
    if (node.type === 'ExpressionStatement') node.type = 'F';
    if (node.type === 'FunctionDeclaration') node.type = 'G';
    if (node.type === 'Identifier') node.type = 'H';
    if (node.type === 'Literal') node.type = 'I';
    if (node.type === 'MemberExpression') node.type = 'J';
    if (node.type === 'VariableDeclaration') node.type = 'K';
    if (node.type === 'VariableDeclarator') node.type = 'L';
    if (node.type === 'FunctionExpression') node.type = 'M';
    if (node.type === 'WhileStatement') node.type = 'N';
    if (node.type === 'IfStatement') node.type = 'O';
    if (node.type === 'LogicalExpression') node.type = 'P';
    if (node.type === 'ReturnStatement') node.type = 'Q';
    if (node.type === 'ArrayExpression') node.type = 'R';
    if (node.type === 'EmptyStatement') node.type = 'S';
    if (node.type === 'DoWhileStatement') node.type = 'T';
    if (node.type === 'ForStatement') node.type = 'U';
    if (node.type === 'UpdateExpression') node.type = 'V';
    if (node.type === 'UnaryExpression') node.type = 'W';
    if (node.type === 'BreakStatement') node.type = 'X';
    if (node.type === 'ArrowFunctionExpression') node.type = 'Y';
    if (node.type === 'TemplateLiteral') node.type = 'Z';
    if (node.type === 'TemplateElement') node.type = 'AB';
    if (node.type === undefined) node.type = 'UN';
    if (node.type === 'NewExpression') node.type = 'NE';
    if (node.type === 'ConditionalExpression') node.type = 'CE';

    temp += node.type;
  });
  return temp;
}
//analyzeCode(program);

module.exports = analyzeCode;

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'."
    },
    fixable: "code",
    schema: []
  },
  create(context) {
    return {

      // Performs action in the function on every variable declarator
      VariableDeclarator(node) {
        // Check if a `const` variable declaration
        if (node.parent.kind === "const") {
          console.log(1);
          
          // Check if variable name is `foo`
          if (node.id.type === "Identifier" && node.id.name === "foo") {
            console.log(2);
            
            // Check if value of variable is "bar"
            if (node.init && node.init.type === "Literal" && node.init.value !== "bar") {
              console.log(3);
              

              /*
               * Report error to ESLint. Error message uses
               * a message placeholder to include the incorrect value
               * in the error message.
               * Also includes a `fix(fixer)` function that replaces
               * any values assigned to `const foo` with "bar".
               */
              console.log('context.report')
              context.report({
                node,
                message: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
                data: {
                  notBar: node.init.value
                },
                fix(fixer) {
                  console.log('fixer', fixer)
                  return fixer.replaceText(node.init, '"bar"');
                }
              });
            }
          }
        }
      },
      Literal(node) {
        console.log("Literal: typeof node.value", node.value, typeof node.value)
      },
      TemplateLiteral(node) {
        console.log("TemplateLiteral: typeof node.value", node.value, typeof node.value)
      }
    };
  }
}

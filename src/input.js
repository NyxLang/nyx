// See http://lisperator.net/pltut/parser/input-stream
const { NyxInputError } = require("./errors");

function InputStream(input) {
  let pos = 0;
  let line = 1;
  let col = 1;

  function next() {
    let ch = input.charAt(pos++);
    if (ch == "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    console.log(col);
    return ch;
  }

  function peek() {
    return input.charAt(pos);
  }

  function lookahead() {
    return input.charAt(pos + 1);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new NyxInputError(`${msg} (at ${line}:${col})`);
  }

    return {
    next,
    peek,
    lookahead,
    eof,
    croak,
    line,
    col
  };
}

module.exports = InputStream;

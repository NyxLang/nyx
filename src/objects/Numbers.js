const math = require("./_math");
const { mixin } = require("../util");

class NyxNumber {
  constructor() {
    throw new Error("Cannot instantiate abstract Number class directly");
  }

  "+"(other) {
    return numberReturn(math.add(this, other));
  }
}

function numberReturn(value) {
  if (value instanceof math.Double || typeof value == "number") {
    return double(value);
  } else if (math.typeOf(value) == "BigNumber") {
    return decimal(value);
  } else if (math.typeOf(value) == "Fraction") {
    return fraction(value);
  } else if (math.typeOf(value) == "Complex") {
    return complex(value);
  } else {
    return value;
  }
}

function numberMixin(destination) {
  for (let key of Object.getOwnPropertyNames(NyxNumber.prototype)) {
    destination.__proto__[key] = NyxNumber.prototype[key];
  }
  return destination;
}

function double(value) {
  let d = new math.double(value.valueOf());
  d.toString = function doubleToString() {
    if (isNaN(value)) {
      return "NaN";
    } else if (value == Infinity || value == -Infinity) {
      return `${value < 0 ? "-" : ""}Infinity`;
    }
    return `${d.__proto__.toString.call(d)}d`;
  };
  Object.defineProperty(d, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(d);
}

function decimal(value) {
  let d = new math.bignumber(value);
  return numberMixin(d);
}

function fraction(value) {
  let f = new math.fraction(value);
  f.toString = function fractionToString() {
    let str = f.s > -1 ? "" : "-";
    str += `${f.n}/${f.d}`;
    return str;
  };
  Object.defineProperty(f, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(f);
}

function complex(value) {
  let c = new math.complex(value);
  c.toString = function complexToString() {
    let str = c.re.toString();
    str += c.im < 0 ? "" : "+";
    str += `${c.im.toString()}i`;
    return str;
  };
  Object.defineProperty(c, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(c);
}

module.exports = {
  Number: NyxNumber,
  Double: double,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
};

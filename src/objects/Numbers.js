const math = require("./_math");

class NyxNumber {
  constructor() {
    throw new Error("Cannot instantiate abstract Number class directly");
  }

  "+"(other) {
    return math.add(this, other);
  }
}

function numberMixin(destination) {
  for (let key of Object.getOwnPropertyNames(NyxNumber.prototype)) {
    destination.__proto__[key] = NyxNumber.prototype[key];
  }
  return destination;
}

function double(value) {
  let n = new math.double(value);
  return numberMixin(n);
}

function decimal(value) {
  let d = new math.bignumber(value);
  return numberMixin(d);
}

function fraction(value) {
  let f = new math.fraction(value);
  return numberMixin(f);
}

function complex(value) {
  let c = new math.complex(value);
  return numberMixin(c);
}

function number() {
  return new NyxNumber();
}

module.exports = {
  Number: number,
  Double: double,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
};
const { create, all, factory, typedDependencies } = require("mathjs");

let math = create(typedDependencies);

const allOthers = Object.keys(all)
  .map((key) => all[key])
  .filter((factory) => math[factory.fn] === undefined);

math.import([
  factory(
    "Double",
    ["typed"],
    function createDouble({ typed }) {
      typed.addType({
        name: "Double",
        test: (x) => x instanceof Number,
      });
      return Number;
    },
    { lazy: false }
  ),
  factory("double", ["typed", "Double"], function createDouble({ typed }) {
    return typed("double", {
      "number | string": (x) => new Number(x),
      BigNumber: (x) => new Number(x.toNumber()),
      Fraction: (x) => new Number(x.valueOf()),
    });
  }),
  factory("add", ["typed"], function createDoubleAdd({ typed }) {
    return typed("add", {
      "Double, Double": (a, b) => math.double(a + b),
      "Double, BigNumber": (a, b) => math.double(b.add(a.valueOf()).toNumber()),
      "Double, Fraction": (a, b) => math.double(b.add(a.valueOf()).valueOf()),
      "BigNumber, Double": (a, b) => math.double(a.add(b.valueOf()).toNumber()),
      "Fraction, Double": (a, b) => math.double(a.add(b.valueOf()).valueOf()),
    });
  }),
]);

math.typed.conversions.unshift(
  {
    from: "Double",
    to: "number",
    convert: function doubleToNumber(double) {
      return Number(double);
    },
  },
  {
    from: "Double",
    to: "Complex",
    convert: function doubleToComplex(double) {
      return new math.Complex(double.valueOf());
    },
  },
  {
    from: "BigNumber",
    to: "Double",
    convert: function bigNumToDouble(bignum) {
      return bignum.toNumber();
    },
  },
  {
    from: "Fraction",
    to: "Double",
    convert: function fractionToDouble(fraction) {
      return new math.Double(fraction.n).div(fraction.d);
    },
  },
  {
    from: "Fraction",
    to: "BigNumber",
    convert: function fractionToBigNum(fraction) {
      return new math.BigNumber(fraction.n).div(fraction.d);
    },
  }
);

math.import(allOthers);

module.exports = math;
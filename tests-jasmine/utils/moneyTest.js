import { formatCurrency } from "../../scripts/utils/money.js";

describe('test suite: formatCurrency',()=>{
  it('Converts cents to dollars',()=>{
    expect(formatCurrency(2095)).toBe('20.95');
  });

  it('works with 0 cents',()=>{
    expect(formatCurrency(0)).toBe('0.00');
  })

  it('Rounds upto the nearest cent',()=>{
    expect(formatCurrency(2000.5)).toBe('20.01');
    expect(formatCurrency(2000.4)).toBe('20.00');
  })
})
let _weight;
let _age;

export function setAge(age) {
  _age = age;
}
export function setWeight(weight) {
  _weight = weight;
}
export function respiratoryVitals() {
  let rr
  if (_age > 16) {
    return [];
  } else if (_age <= 1) {
    rr = '30 - 60';
  } else if (_age <= 2) {
    rr = '24 - 40';
  } else if (_age <= 5) {
    rr = '20 - 34';
  } else if (_age <= 12) {
    rr = '15 - 30';
  } else {
    rr = '12 - 20';
  }
  return [{ title: 'RR', dose: rr, class: 'green' }];
}
export function cardiovascularVitals() {
  let hr, sbp;
  if (_age > 16) {
    return [];
  } else if (_age <= 1) {
    hr = '80 - 160'; // 120
    sbp = '85';
  } else if (_age <= 2) {
    hr = '80 - 130'; // 110
    sbp = '85';
  } else if (_age <= 4) {
    hr = '80 - 120'; // 100
    sbp = '85';
  } else if (_age <= 6) {
    hr = '75 - 115'; // 100
    sbp = '90';
  } else if (_age <= 8) {
    hr = '70 - 110'; // 90
    sbp = '95';
  } else if (_age <= 10) {
    hr = '70 - 110'; // 90
    sbp = '110';
  } else if (_age <= 16) {
    hr = '70 - 110'; // 90
    sbp = '115';
  }
  return [
    { title: 'HR', dose: hr, class: 'red' },
    { title: 'SBP', dose: sbp, class: 'red' },
  ];
}
export function airway() {
  let ett;

  if (_age <= 1) ett = { size: 3.5, length: 0 }; // 8mo-1y
  else if (_age <= 3) ett = { size: 4, length: 13 };
  else if (_age <= 5) ett = { size: 4.5, length: 14 };
  else if (_age <= 7) ett = { size: 5, length: 15 };
  else if (_age <= 9) ett = { size: 5.5, length: 16 };
  else if (_age <= 11) ett = { size: 6, length: 17 };
  else if (_age <= 13) ett = { size: 6.5, length: 18 };
  else if (_age <= 16) ett = { size: 7, length: 19 };
  else ett = { size: 7.5, length: 20 };

  const size = '#' + ett.size;
  const length = ett.length + 'cm';

  return { title: 'COETT', dose: size, formula: length };
}
export function tidalVolume() {
  const vt = _weight * 8;
  return { title: 'Tidal volume', dose: vt, formula: '8ml/kg' };
}
export function bloodVolume() {
  const bv = _age > 16 ? _weight * 70 : _weight * 80;
  const formula = _age > 16 ? '70ml/kg' : '80ml/kg';
  return { title: 'Blood volume', dose: bv, formula: formula };
}

function formatNumber(num, type = 'solid', decimals = 2) {
  if (num === 0) return '0';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = type == 'solid' ? ['mcg', 'mg', 'g'] : ['μL', 'ml', 'L'];

  const i = Math.floor(Math.log(num) / Math.log(k));

  return ({
    num: parseFloat((num / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i]
  });
}
function formatRange(arr) {
  if (arr.length == 1) return arr[0].num + arr[0].unit;
  else if (arr[0].unit == arr[1].unit) return arr[0].num + '-' + arr[1].num + arr[1].unit;
  else return arr[0].num + arr[0].unit + '-' + arr[1].num + arr[1].unit;
}
export function drug(name, opts) {
  const type = opts.type ? opts.type : 'solid';
  const dose = opts.formula.map(value => {
    const calc = value * _weight;
    const result = opts.max && calc > opts.max ? opts.max : calc;
    return formatNumber(result, type);
  });
  const formula = opts.formula.map(value => {
    return formatNumber(value, type);
  });
  return {
    title: name,
    dose: formatRange(dose),
    formula: formatRange(formula) + '/kg',
    class: opts.class || 'default',
  };
}
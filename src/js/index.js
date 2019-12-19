import { calcFormula } from './calculator'

var submitBtn = document.getElementById('submit')
submitBtn.addEventListener('click', function(e) {
  const formula = document.getElementById("formula").value
  const data = {
    table1: {
      field0:	20,
      field1:	40,
      field2:	12,
    },
    table2: {
      field0:	30,
      field1:	45,
      field2:	7,
    },
  }

  const result = calcFormula({formula, data})
  document.getElementById('result').innerText = result
})
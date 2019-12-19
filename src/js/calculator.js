/**
 * 描述：带括号的四则运算
 * 作者：caijieying
 */
import { Stack } from "./dataStructure"
import _ from "lodash"

function isBracket(c) {
  return c === "(" || c === ")"
}
function isOper(c) {
  return c === "(" || c === ")" || c === "+" || c === "-" || c === "*" || c === "/"
}
function getPriority(oper) {
  switch (oper) {
    case "+":
    case "-":
      return 0
    case "*":
    case "/":
      return 1
    case "(":
    case ")":
      return -1
    default:
      return -2
  }
}
function handlerSymbol(c, postfixHelper, postfix) {
  if (postfixHelper.empty()) {
    postfixHelper.push(c)
    return
  }
  if (isBracket(c)) {
    if (c === "(") postfixHelper.push(c)
    else {
      // 弹出所有元素直到遇到左括号
      while (postfixHelper.top() !== "(") {
        let ch = postfixHelper.top()
        postfix.push(ch)
        postfixHelper.pop()
      }
      // 当遇到左括号时，弹出但不加入postfix(后缀表达式中）
      postfixHelper.pop()
    }
  } else {
    // 如果不是括号
    // 取出栈顶元素，与当前符号进行优先性比较
    let sym = postfixHelper.top()
    // 比较两符号的优先性
    if (getPriority(c) <= getPriority(sym)) {
      // 如果c的优先性比栈顶符号小或等于，弹出栈顶元素
      postfixHelper.pop()
      // 并将其压入postfix（后缀表达式）中
      postfix.push(sym)
      // 递归调用handler,比较当前符号c与下一个栈顶符号的优先性
      handler(c, postfixHelper, postfix)
    } else {
      // 如果c比栈顶符号优先级大，那将c压入coll2(操作符栈）中
      postfixHelper.push(c)
    }
  }
}

/**
 * 中缀表达式公式转换为后缀表达式
 * 
 * @param {string} infix 
 * @param {arr} postfix 
 */
function infixToPostFix(infix, postfix) {
  let postfixHelper = Stack()
  for(let i=0; i<infix.length; i++) {
    let c = infix[i]
    if (!isOper(c)) { // 处理操作数
      let operands = ""
      while (i<infix.length && !isOper(infix[i])) {
        operands += infix[i++]
      }
      postfix.push(operands)
      i--;
    } else {// 处理操作符做出处理
      handlerSymbol(c, postfixHelper, postfix)
    }
  }
  // 如果输入结束，将栈内元素全部弹出，加入后缀表达式中
  while (!postfixHelper.empty()) {
    let c = postfixHelper.top()
    postfix.push(c)
    postfixHelper.pop()
  }
}

// 计算后缀表达式
function calcPostFix(postfix, data) {
  let helperStack = Stack()
  for (let i=0; i<postfix.length; i++) {
    let c = postfix[i]

    // 如果是操作数，压入栈中
    if (!isOper(c)) {
      let op = formatData(c, data)
      helperStack.push(op)
    } else {
      // 如果是操作符，从栈中弹出元素进行计算
      let op1 = helperStack.top()
      helperStack.pop()
      let op2 = helperStack.top()
      helperStack.pop()
      if (op1 === null || op2 === null) {
        helperStack.push(null)
      } else {

        switch (c) {
          case "+":
            helperStack.push(op2 + op1)
            break
          case "-":
            helperStack.push(op2 - op1)
            break
          case "*":
            helperStack.push(op2 * op1)
            break
          case "/":
            helperStack.push(op2 / op1) // 注意是op2(op)op1而不是op1(op)op2
            break
        }
      }
    }
  }
  return helperStack.top()
}

/**
 * 处理自定义公式操作数
 * 对于字符串：根据规则获取数据库字段
 * 对于数字：直接返回
 * @param {} param0 
 */
function formatData(opRaw, data) {
  let op = _.trim(opRaw)
  if (_.isFinite(_.toNumber(op))) {
    return _.toNumber(op)
  } else if (op.search(/(\S*)_(\S*)/g) >= 0) {
    let obj = RegExp.$1
    let key = RegExp.$2
    if (data.hasOwnProperty(obj)) {
      return data[obj][key]
    } else {
      return null
    }
  }
}

/**
 *
 * @param formula 公式
 * @param data    数据对象
 */
export function calcFormula({ formula, data }) {
  let infix = formula.replace(/\s/g, '') // 去除公式空格
  let postfix = []

  // 1. 中缀表达式转后缀表达式
  infixToPostFix(infix, postfix)

  // 2. 计算后缀表达式
  const res = calcPostFix(postfix, data)
  return res
}

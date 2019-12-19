export function Stack() {
  let arr = []
  const push = (val) => {
    arr.push(val)
  }
  const pop = () => {
    arr = arr.slice(0, arr.length - 1)
  }
  const top = () => {
    if (arr.length === 0) return null
    else return arr[arr.length - 1]
  }
  const empty = () => {
    return arr.length === 0
  }
  return {
    push,
    pop,
    top,
    empty,
    arr,
  }
}

export function Deque() {
  let arr = []
  const push_front = (val) => {
    arr.unshift(val)
  }
  const push_back = (val) => {
    arr.push(val)
  }
  const pop_front = () => {
    if (arr.length === 0) return null
    let temp = arr[0]
    arr = arr.slice(1)
    return temp
  }
  const pop_back = () => {
    if (arr.length === 0) return null
    let temp = arr[arr.length - 1]
    arr = arr.slice(0, arr.length - 1)
    return temp
  }
  const front = () => {
    if (arr.length === 0) return null
    else return arr[0]
  }
  const back = () => {
    if (arr.length === 0) return null
    else return arr[arr.length - 1]
  }
  const empty = () => {
    return arr.length === 0
  }
  return {
    push_front,
    push_back,
    pop_front,
    pop_back,
    front,
    back,
    empty,
  }
}

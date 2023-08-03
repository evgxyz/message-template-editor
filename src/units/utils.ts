
export const getFromLocalStorage = 
  function(name: string, valueDefault: unknown = null): unknown {
//
  return localStorage[name] ? JSON.parse(localStorage[name]) : valueDefault
}
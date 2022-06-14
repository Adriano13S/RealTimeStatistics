/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
interface Icounters {
  formula?: string;
  today_formula?: string;
  this_year_formula?: string;
  types?: string[];
  actions?: string[];
  reset_formula?: string;
  reset_action?: string;
  format?: object;
}
export interface IresultObject {
  serverTime: number;
  seconds: string;
  counters: { [name: string]: Icounters };
}

const firstStep = (payload: string): string => {
  const helperString: string = '0123456789abcdef';
  const arrayTransform: string[] = [];
  for (let i = 0; i < 256; i += 1) {
    const indexConstructor =
      helperString.charAt(i >> 4) + helperString.charAt(i & 15);
    arrayTransform[indexConstructor] = String.fromCharCode(i);
  }
  if (!payload.match(/^[a-f0-9]*$/i)) {
    return 'no match';
  }
  if (payload.length % 2) {
    payload = `0${payload}`;
  }
  const arrayToJoin: string[] = [];
  let indexCounter: number = 0;
  for (let i = 0; i < payload.length; i += 2) {
    arrayToJoin[(indexCounter += 1)] = arrayTransform[payload.substr(i, 2)];
    // substring method no an alternative
  }
  return arrayToJoin.join('');
};

const secondStep = (identity: string, firstStepResult: string): string => {
  const helperArray: number[] = [];
  for (let i = 0; i < 256; i += 1) {
    helperArray[i] = i;
  }
  let indexCounter: number = 0;
  let numberHelper: number;
  for (let i = 0; i < 256; i += 1) {
    indexCounter =
      (indexCounter +
        helperArray[i] +
        identity.charCodeAt(i % identity.length)) %
      256;
    numberHelper = helperArray[i];
    helperArray[i] = helperArray[indexCounter];
    helperArray[indexCounter] = numberHelper;
  }
  let indexOne: number = 0;
  let indexTwo: number = 0;
  let stringToReturn: string = '';
  for (let i = 0; i < firstStepResult.length; i += 1) {
    indexOne = (indexOne + 1) % 256;
    indexTwo = (indexTwo + helperArray[indexOne]) % 256;
    numberHelper = helperArray[indexOne];
    helperArray[indexOne] = helperArray[indexTwo];
    helperArray[indexTwo] = numberHelper;
    const indexSet: number =
      helperArray[(helperArray[indexOne] + helperArray[indexTwo]) % 256];
    stringToReturn += String.fromCharCode(
      firstStepResult.charCodeAt(i) ^ indexSet
    );
  }
  return stringToReturn;
};

const decodeFunction = (identity: string, payload: string): IresultObject => {
  const firstResult = firstStep(payload);
  const decodedResult = secondStep(identity, firstResult);
  const jsonResult: IresultObject = JSON.parse(
    decodedResult.replaceAll('window.', 'global.')
  );
  return jsonResult;
};

export default decodeFunction;

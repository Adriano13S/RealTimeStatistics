import https from 'https';
import decodeFunction from './decode';

interface IOptions {
  hostname: string;
  port: number;
  path: string;
  method: string;
}

const currentDate: Date = new Date();
const options: IOptions = {
  hostname: process.env.SOURCE,
  port: 443,
  path: `${process.env.SOURCE_PATH}${currentDate.getTime()}`,
  method: 'GET'
};

const getData = (): Promise<boolean> =>
  new Promise<boolean>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body: string = '';
      // eslint-disable-next-line no-return-assign
      res.on('data', (chunk: string) => (body += chunk));
      res.on('end', () => {
        try {
          const text = body
            .replaceAll(')', '')
            .replaceAll('(', '')
            .replaceAll("'", '')
            .replaceAll(';', '')
            .trim();
          global.resultObject = decodeFunction(process.env.IDENTITY, text);
          // eslint-disable-next-line no-new-func
          const secondsFormula = new Function(global.resultObject.seconds);
          global.time_at_load = new Date();
          global.server_time = Number(global.resultObject.serverTime) + 2750;
          /* 3 seconds more for sync to worldometers */
          global.server_time_offset =
            global.server_time - global.time_at_load.getTime();
          global.rts_seconds = secondsFormula();
          setInterval(() => {
            global.server_time_offset =
              global.server_time - global.time_at_load.getTime();
            global.rts_seconds = secondsFormula();
          }, 500);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });

export default getData;

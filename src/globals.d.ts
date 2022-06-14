/* eslint-disable */
import { IresultObject } from './decode';

declare global {
  var resultObject: IresultObject;
  var time_at_load: Date;
  var server_time: number;
  var server_time_offset: number;
  var rts_seconds: Function;
}

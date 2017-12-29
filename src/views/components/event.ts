import { HornetEvent, fireHornetEvent } from "hornet-js-core/src/event/hornet-event";


export interface ErrorEventDetail { error: Error; }
export var ERROR_EVENT = new HornetEvent<ErrorEventDetail>("ERROR_EVENT");

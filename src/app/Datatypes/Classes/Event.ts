import IEvent from '../Interface/IEvent';
import Location from './Location';

export class Event implements IEvent{
  confirmedUsers: string[];
  createdByUser: string;
  dresscode: string;
  invitedUsersWithRegisterdMailAdress: string[];
  location: Location;
  message: string;
  title: string;
  constructor(obj: IEvent) {
    Object.assign(this, obj);
  }
}

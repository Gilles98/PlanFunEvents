import Location from '../Classes/Location';
import {SelectDressCode} from '../SelectDresscodeEnum';

export default interface IEvent{
  location: Location;
  createdByUser: string;
  invitedUsersWithRegisterdMailAdress?: string[];//user id's van de genodigde die geregistreerd staan met email adress
  confirmedUsers?: string[];// de user id's waarvan de personen hun komst bevestigd hebben
  message:  string;
  title: string;
  dresscode: string;
}

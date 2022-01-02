import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NominatimResponse} from '../shared/models/nominatimResponse';
import {map} from 'rxjs/operators';
import {BASE_NOMINATIM_URL, DEFAULT_VIEW_BOX} from '../../environments/environment';

@Injectable()
export class NominatimService {

  constructor() {
  }



}

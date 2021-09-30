import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILeiDianInfo } from 'app/shared/model/lei-dian-info.model';

type EntityResponseType = HttpResponse<ILeiDianInfo>;
type EntityArrayResponseType = HttpResponse<ILeiDianInfo[]>;

@Injectable({ providedIn: 'root' })
export class HomeService {
  public resourceUrl = SERVER_API_URL + 'leidian';

  constructor(protected http: HttpClient) {}

  getLeiDianInfoList(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILeiDianInfo[]>(`${this.resourceUrl}/getVmList`, { params: options, observe: 'response' });
  }

  quitVmByName(name: string): Observable<EntityResponseType> {
    return this.http.get<ILeiDianInfo>(`${this.resourceUrl}/quitVmByName/${name}`, { observe: 'response' });
  }

  launchVmByName(name: string): Observable<EntityResponseType> {
    return this.http.get<ILeiDianInfo>(`${this.resourceUrl}/launchVmByName/${name}`, { observe: 'response' });
  }

  patchLaunchVmByName(names: string[]): Observable<EntityResponseType> {
    return this.http.post<ILeiDianInfo>(`${this.resourceUrl}/launchVmByName`, names, { observe: 'response' });
  }

  patchQuitVmByName(names: string[]): Observable<EntityResponseType> {
    return this.http.post<ILeiDianInfo>(`${this.resourceUrl}/quitVmByName`, names, { observe: 'response' });
  }

  sortWindows(size: number): Observable<EntityResponseType> {
    return this.http.get<ILeiDianInfo>(`${this.resourceUrl}/sortWindows/${size}`, { observe: 'response' });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginatedResultMessage, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber, pageSize, container) {
    let params = new HttpParams();
    params = params.append('Container', container);
    params = params.append('PageNumber', pageNumber.toString());
    params = params.append('PageSize', pageSize.toString());
    return getPaginatedResultMessage<Message[]>(this.baseUrl , params, this.http);
  }

  getMessageThread(username: string){
  return this.http.get<Message[]>(this.baseUrl + 'Message/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'Message',
      {recipientUsername: username, content});
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'Message/' + id);
  }
}

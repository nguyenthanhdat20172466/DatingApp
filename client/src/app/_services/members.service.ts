import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/member';
import { PaginatedResult } from '../_model/pagination';
import { UserParams } from '../_model/userParams';
import { AccountService } from './account.service';
import { User } from '../_model/user';
import { getPaginatedResult, getPaginatedResultLike, getPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams
  user: User;



  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams(){
    return this.userParams;
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) {
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);


    return getPaginatedResult<Member[]>(this.baseUrl, params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }));
  }
  getAllMember() {
      if(this.members.length > 0) return of(this.members);
      return this.http.get<Member[]>(this.baseUrl + 'user/allUser' ).pipe(
        map(members => {
          this.members = members;
          return members;
        })
      )
  }

  getMember(username: string){
    // const member = this.members.find(x => x.userName ===username)
    // if(member !== undefined) return of(member);
    const member = [...this.memberCache.values()].reduce((arr,elem) => arr.concat(elem.result), []).find((member: Member) => member.userName ===username );
    if(member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'user/username/' + username )
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'user', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId);
  }
  addLike(username: string){
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber, pageSize) {
    let params = new HttpParams();
    params = params.append('Predicate', predicate);
    params = params.append('PageNumber', pageNumber.toString());
    params = params.append('PageSize', pageSize.toString());

    return getPaginatedResultLike<Partial<Member[]>>(this.baseUrl , params, this.http);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Member } from 'src/app/_model/member';
import { Pagination } from 'src/app/_model/pagination';
import { User } from 'src/app/_model/user';
import { UserParams } from 'src/app/_model/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  memberCount: Member[];
  pagination: Pagination;
  userParams: UserParams
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  //totalItems: number;

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    //this.pageSize = this.loadAllMembers();
    this.loadMembers();
  }

  // loadMembers() {
  //   debugger;
  //   this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.members = response.result;
  //     this.pagination = response.pagination;
  //   })
  // }

  loadMembers() {
    debugger;
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).
      subscribe(response => {
        this.members = response.result;
        this.pagination = response.pagination;
      })
  }

  resetFilter() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
  // loadAllMembers() {
  //   this.memberService.getAllMember().subscribe(members => {
  //     this.memberCount = members;
  //     this.totalItems = members.length
  //   })
  // }
}

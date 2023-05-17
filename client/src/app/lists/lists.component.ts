import { Component, OnInit } from '@angular/core';
import { Member } from '../_model/member';
import { MembersService } from '../_services/members.service';
import { Pagination } from '../_model/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit{
  members: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 4;
  pagination: Pagination;


  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(envent: any) {
    this.pageNumber = envent.page;
    this.loadLikes();
  }

}

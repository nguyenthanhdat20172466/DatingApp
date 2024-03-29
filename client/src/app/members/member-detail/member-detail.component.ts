import { Component, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery/public-api';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/_model/message';
import { MessageService } from 'src/app/_services/message.service';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  //username: string;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService: MessageService ){
  }
  ngOnInit(): void {
    //this.loadMember();
    this.route.data.subscribe(data => {
      this.member = data.member;
    })
   // this.username = this.route.snapshot.paramMap.get('username');
   this.route.queryParams.subscribe(params => {
    params.tab ? this.selectTab(params.tab) : this.selectTab(0);
   })

   this.galleryOptions= [{
    width: '500px',
    height: '500px',
    imagePercent: 100,
    thumbnailsColumns: 4,
    //imageAnimation: NgxGalleryAnimation.Slide,
    preview: false
   }]

   this.galleryImages = this.getImages();
  }
  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for( const photo of this.member.photos){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
    }
  loadMember() {
    //debugger;
    const username = this.route.snapshot.paramMap.get('username');
    this.memberService.getMember(username).subscribe(member =>{
      this.member = member;
    })
  }

  loadMessages(){
    debugger;
    this.messageService.getMessageThread(this.member.userName).subscribe({next :messages =>
      this.messages = messages}
    )
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading ==="Messages" && this.messages.length===0){
        this.loadMessages();
    }
  }
}



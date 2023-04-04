import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery/public-api';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  //username: string;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  constructor(private memberService: MembersService, private route: ActivatedRoute ){

  }
  ngOnInit(): void {
    this.loadMember();
   // this.username = this.route.snapshot.paramMap.get('username');

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
      this.galleryImages = this.getImages();
    })
  }
}



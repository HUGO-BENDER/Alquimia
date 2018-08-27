import { Component, OnInit } from '@angular/core';
import { Metadata } from '../../model/metadata';
import { MetadataService } from '../../services/metadata.service';


@Component({
  selector: 'app-page-about',
  templateUrl: './page-about.component.html',
  styleUrls: ['./page-about.component.scss']
})
export class PageAboutComponent implements OnInit {

  info: any;

  constructor(private dataservice: MetadataService) {
    if ( this.info == null) {
      this.info = { name: null , year: null, author: null, version:null};
    }
  }

  ngOnInit() {
    this.dataservice.getMetadata().then(doc => {
      this.info = doc.data();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Metadata } from '../../model/metadata';
import { MetadataService } from '../../services/firestore/metadata.service';


@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {

  info: Metadata = null;

  constructor(private dataservice: MetadataService) {
  }

  ngOnInit() {
    this.dataservice.getMetadata().then(doc => {
      this.info = <Metadata> doc.data();
    });
  }

}

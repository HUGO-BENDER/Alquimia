import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Metadata } from '../../model/metadata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MetadataService {
  private staticData: Observable<Metadata>;

  constructor(private afs: AngularFirestore) {
    this.staticData = afs.collection('Metadata').doc<Metadata>('AboutData').valueChanges();
  }

  getMetadata() {
    return this.afs.collection('Metadata').doc('AboutData').ref.get();
  }
}

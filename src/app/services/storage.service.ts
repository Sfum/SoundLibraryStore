import { Injectable } from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) {}

  getImageUrl(filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }
}

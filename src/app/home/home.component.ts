import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";

import { Observable } from "rxjs";
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  postText = ""
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  file;
  filePath;
  fileRef;
  task;
  n;
  url: any;
  msg = "";


  constructor(private storage: AngularFireStorage, public auth:AuthServiceService) {
    
   }

  ngOnInit(): void {
  }

  share(){
    //add image to storage
    this.fileRef = this.storage.ref(this.filePath);
    this.task = this.storage.upload(`PostImages/${this.n}`, this.file);
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = this.fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
            
            //add post to db
            this.addToDB();
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });

      //clear form
      this.postText = ""
      this.url = ""
  }

  onFileSelected(event) {
    this.n = Date.now();
    this.file = event.target.files[0];
    this.filePath = `PostImages/${this.n}`;
    if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.url = reader.result; 
		}
  }

  addToDB(){
  //todo 
  }

  
}

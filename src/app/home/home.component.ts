import { PostsService } from './../services/posts.service';
import { UtilsService } from './../services/utils.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";

import { Observable } from "rxjs";
import { AuthServiceService } from '../auth-service.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  postText = ""
  title = "cloudsSorage";
  selectedFile: File = null;
  imageUrl;
  downloadURL: Observable<string>;
  file;
  filePath;
  fileRef;
  task;
  n;
  url: any;
  msg = "";
  currUserId;
  currUserName;
  content = new FormControl('', [Validators.required]);
  isLoading = false;
  feed;

  constructor(private storage: AngularFireStorage,
    public auth:AuthServiceService,
    public db: AngularFirestore,
    private utilsService: UtilsService,
    private postsService: PostsService) {
    
   }

  ngOnInit(): void {
    this.getCurrentUserName();
    this.getPosts();
  }

  share(){
    //add image to storage
    this.isLoading = true;
    if(this.file) {    this.fileRef = this.storage.ref(this.filePath);
        this.task = this.storage.upload(`PostImages/${this.n}`, this.file);
        this.task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = this.fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                if (url) {
                  this.imageUrl = url;
                  console.log(this.imageUrl);
                }
                
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
    } else {
      this.addToDB();
    }

      // //clear form
      // this.postText = ""
      
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
    if(this.content.valid) {
      const req = {
        content: this.content.value,
        created_by: this.currUserId,
        created_on: (new Date()),
        image: this.imageUrl || null
      };
      console.log(req, this.content.value);
      this.postsService.addPost(req).then(
        () => {
          this.utilsService.displayToast("Post created successfully!");
          this.imageUrl = '';
          this.content.reset();
          this.url = ""
          this.isLoading = false;

          // this.content.
        }
      ).catch((err) => {
        this.utilsService.displayToast(err);
        this.isLoading = false;
        
      });
      
    } else {
      this.utilsService.displayToast("Please add content for the post!");
      this.isLoading = false;

    }
  }

  getCurrentUserName(){
    this.currUserId = this.auth.getUserId()
    this.db.collection('Users', ref=>ref
    .where('UserId', '==', this.currUserId))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(res=>{
      this.currUserName = res[0].Name
    })
  }

  getPosts() {
    this.isLoading = true;
    this.postsService.fetchPosts().subscribe(res=>{
      this.isLoading = false;
      this.feed = res
      console.log(this.feed);
      //this.eventsFromDb.sort((a, b) => a.Date.localeCompare(b.Date))
    }, err => this.utilsService.displayToast(err))
  }

  editPost() {
    //TODO:integrate service function updatePost
  }

  removePost() {
    //TODO:integrate service function deletePost

  }
}

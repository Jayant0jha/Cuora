import { PostsService } from './../services/posts.service';
import { UtilsService } from './../services/utils.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";

import { Observable } from "rxjs";
import { AuthServiceService } from '../auth-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray } from '@angular/forms';

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
  commentsForm: FormGroup;
  comments: FormArray;
  // comment = new FormControl('', [Validators.required]);
  isLoading = false;
  feed;

  constructor(private storage: AngularFireStorage,
    public auth:AuthServiceService,
    public db: AngularFirestore,
    private utilsService: UtilsService,
    private postsService: PostsService,
    private formBuilder: FormBuilder) {
    
   }

  ngOnInit(): void {
    this.getCurrentUserName();
    this.getPosts();
    this.commentsForm = this.formBuilder.group({
      comments: this.formBuilder.array([])
    })
    console.log(this.commentsForm);
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
        creator: this.currUserName,
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
      this.feed.map((post:any) => {
        this.postsService.fetchComments(post.id).subscribe(
          (res) => {
            post['comments'] = res;
            // console.log(post);
          }
        )
      })
      console.log(this.feed);
      this.buildCommentsForm();
      //this.eventsFromDb.sort((a, b) => a.Date.localeCompare(b.Date))
    }, err => this.utilsService.displayToast(err))
  }

  buildCommentsForm() {
    this.commentsForm = this.formBuilder.group({
      comments: this.formBuilder.array([])
    })
    // this.commentsFrom = this.formBuilder.array([]);
    this.createItems();
    console.log(this.commentsForm)
  }

  createItems() {
    for (let index = 0; index < this.feed.length; index++) {
      this.addItem()
    }
  }

  addItem() {
    this.comments = this.commentsForm.get('comments') as FormArray;
    this.comments.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      mainComment: ['', Validators.required]
    })
  }

  editPost() {
    //TODO:integrate service function updatePost
  }

  removePost() {
    //TODO:integrate service function deletePost

  }


  addComment(i) {
    const commentControl = this.commentsForm.get(['comments', i, 'mainComment'])
    console.log(commentControl);
    if(commentControl.valid) {
      const req = {
        comment: commentControl.value,
        created_by: this.currUserId,
        creator: this.currUserName,
        created_on: (new Date()),
        post_id: this.feed[i].id,
        parent: null
      };
      console.log(req);
      this.postsService.addComment(req).then(
        () => {
          this.utilsService.displayToast("Comment added!");
          this.commentsForm.get(['comments', i, 'mainComment']).reset();
          this.isLoading = false;
        }
      ).catch((err) => {
        this.utilsService.displayToast(err);
        this.isLoading = false;
      });
    } else {
      this.utilsService.displayToast("Please add content for the comment!");
      this.isLoading = false;
    }
  }
}

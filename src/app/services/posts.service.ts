import { UtilsService } from './utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private db: AngularFirestore, private utilsService: UtilsService) { }


  addPost(req) {
    return this.db.collection("Posts").add(req);
  }
  
  fetchPosts() {
    return this.db
    .collection("Posts",  ref=>ref.orderBy('created_on', "desc"))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
      // , switchMap((posts: any[]) => {
      //   return posts.map((post:any) => {
      //     this.fetchComments(post.id).pipe(
      //       map((comments:any) => ({...post, comments})))
      //   })
      // })
    )
  }

  fetchComments(postId) {
    console.log(postId)
    return this.db
    .collection("Comments",  ref=>ref.where('post_id', '==', postId))
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
  }

  updatePost(id, req) {
    return this.db.collection("Posts").doc(id).set(req)

  }

  deletePost(id) {
    return this.db.collection("Posts").doc(id).delete()
  }

  getUserById(id) {
    return this.db.collection("Users").doc(id).get();
  }

  addComment(req) {
    return this.db.collection("Comments").add(req);
  }
}
 
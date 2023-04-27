import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  /* ---------------------------- Public Properties --------------------------- */

  /** Keeps track of the hover state for file being dragged */
  public isDragOver: boolean = false;
  public showUploadConfig: boolean = false;

  /** Reference to the file uploaded by the user */
  public file: File | null = null;

  /** Responsible for updating the progress bar in the alert component */
  public percentage: number = 0;

  /** Responsible for toggling the percentage in the alert component */
  public showPercentage: boolean = false;

  /** Reference to firebase user object */
  public user: firebase.User | null = null;

  /** Alert Component Properties */
  public showAlert: boolean = false;
  public alertMsg: string = "Please wait! Your clip is being uploaded.";
  public alertColor: string = 'blue';
  public inSubmission: boolean = false;

  /** Form Group & Control Properties */
  public title: FormControl = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(4)
    ],
    nonNullable: true
  });

  public uploadForm = new FormGroup({
    videoTitle: this.title,
  })

  /* -------------------------- Constructor Injection ------------------------- */
  constructor(
    private storageService: AngularFireStorage,
    private fireAuthService: AngularFireAuth,
    private clipsService: ClipService
  ) {
    // Subscribe to the user observable from fireAuthService to get the latest user object
    this.fireAuthService.user.subscribe(user => this.user = user);
  }
  
  /** 
   * * The file is accessible through the drop's event object
   */
  public storeFile($event: Event) {
    this.isDragOver = false;

    // Assert the $event type here before assigning. (Not every event contains the dataTransfer property)
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    // If the file property is null or its type is NOT mp4, exit the method
    if (!this.file || this.file.type !== 'video/mp4') {
      return
    }
    
    // Show the manage upload form
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '') // this regEx will remove the file extension from the name
    );
    this.showUploadConfig = true;
  }

  
  public uploadFile(): void {
    // Disable the form during file upload
    this.uploadForm.disable();
    
    // Update alert properties
    this.showAlert = true;
    this.alertMsg = "Please wait! Your clip is being uploaded.";
    this.alertColor = 'blue';
    this.showPercentage = true;
    this.inSubmission = true;
    
    /** 
     * Conflicting filenames can cause issues and Firebase doesn't handle by default
     * UUID package can be used to generate unique ID's 
     */
    const clipFileName = uuid();

    // Keep your file storage and naming system clean! If a 'clips' directory doesn't exist, Firebase will create one for us
    const clipPath = `clips/${clipFileName}.mp4`;

    // The upload storageService.upload method returns an upload task observable that we can subscribe to for monitoring progress
    const task = this.storageService.upload(clipPath, this.file);

    // The ref function will create a reference to the file in our storage. A reference can be created before a file upload completes
    // If the file doesn't exist firebase will create a temporary placeholder for you
    const clipRef = this.storageService.ref(clipPath);

    // Use the percentageChanges() method to get the upload task's progress
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });

    // Use the last pipe to get the final (successful state) of the upload task
    // * We use arrow functions here to preserve the 'this' context and object syntax to catch errors
    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          // ! Create a reference obj that points to a specific obj in our storage. We can use es6's object shorthand syntax here
          url
        };

        this.clipsService.createClip(clip);

        // Update alert component properties
        this.alertMsg = "Success! Your clip is now ready to share with the world.";
        this.alertColor = 'green';
        this.showPercentage = false;
      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.';
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
      }
    });
  }
}

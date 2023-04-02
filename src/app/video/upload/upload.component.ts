import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  /** Keeps track of the hover state for file being dragged */
  public isDragOver: boolean = false;
  public showUploadConfig: boolean = false;

  /** Reference to the file uploaded by the user */
  public file: File | null = null;

  /* -------------------------- Form Group & Controls ------------------------- */
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

  constructor(
    private storageService: AngularFireStorage
  ) { }
  
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
    /** 
     * Conflicting filenames can cause issues and Firebase doesn't handle by default
     * UUID package can be used to generate unique ID's 
     */
    const clipFileName = uuid();

    // Keep your file storage and naming system clean! If a 'clips' directory doesn't exist, Firebase will create one for us
    const clipPath = `clips/${clipFileName}.mp4`;

    // Store the file in Firebase
    this.storageService.upload(clipPath, this.file)

  }
}

import { Component } from '@angular/core';

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
    this.showUploadConfig = true;
    
  }
}

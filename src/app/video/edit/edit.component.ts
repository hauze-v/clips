import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null;
  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';

  @Output() update = new EventEmitter();

  /** Form Group & Control Properties */
  public title: FormControl = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(4)
    ],
    nonNullable: true
  });

  public clipID: FormControl = new FormControl('', {
    nonNullable: true
  })

  public editForm = new FormGroup({
    videoTitle: this.title,
    id: this.clipID
  })

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnChanges(): void {
    // If the active clip is empty, do nothing
    if (!this.activeClip) {
      return
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit() {
    // If activeClip is empty, do nothing
    if (!this.activeClip) {
      return
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(
        this.clipID.value,
        this.title.value
      )
    }
    catch(err) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Please try again later.';
      return
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}

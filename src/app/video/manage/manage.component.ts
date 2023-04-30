import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {
  /**
   * Property for storing the sorting order.
   * 1 represents descending order
   * 2 represents ascending order
   */
  public videoOrder = '1';

  /** Local store of users clips from firebase */
  public clips: IClip[] = [];
  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { }

  public ngOnInit(): void {
    // Listen for changes in the queryParameters for the activated route and update the local videoOrder reference
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
    }); // nG will complete the Observable when the component is destroyed and the router destroys the component when a user navigates to a different page

    // Subscribe to getUserClips observable
    this.clipService.getUserClips().subscribe(docs => {
      // Reset clips so we don't experience weird behavior
      this.clips = [];

      docs.forEach(document => {
        this.clips.push({
          docID: document.id,
          ...document.data()
        })
      })
    });
  }

  public sort(event: Event) {
    // Destructure the value property from the event.target property which represents the value selected in our select element
    const { value } = (event.target as HTMLSelectElement);

    // this.router.navigateByUrl(`/manage?sort=${value}`);
    // * router.navigate is beefier and allows for a set of options to be passed along
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        sort: value
      }
    }); 
  }

  public openModal($event: Event, clip: IClip): void {
    console.log('inside openModal');
    $event.preventDefault();
    
    this.modal.toggleModal('editClip');
  }
}

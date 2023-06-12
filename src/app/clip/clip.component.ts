import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import IClip from '../models/clip.model';


@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  // Adding static: true here means that the target property will be available in ngOnInit
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  player?: Player;
  clip?: IClip;

  constructor(public route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    /**
     * * Snapshot object grabs information about a route at a moment in time. it does not get updated after we inject the service.
     * * It's great for grabbing info when the component is created. It's not great when we need to grab information about the route
     * * from different moments in time. Luckily, ng exposes observables for listening to changes about the route
     * * The route.params property is an observable that will push events whenever the parameters change.
     * * We need to do this because by default, ng does not destroy the component on route changes if it's the same componet (to save resources)
     * * so we can use this subscription to dynamically update pieces of the component if the route changes.
     */ 

    this.route.data.subscribe(data => {
      this.clip = data.clip as IClip;

      this.player?.src({
        src: this.clip?.url,
        type: 'video/mp4'
      });
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  public id = '';

  constructor(public route: ActivatedRoute) { }

  public ngOnInit(): void {
    /**
     * * Snapshot object grabs information about a route at a moment in time. it does not get updated after we inject the service.
     * * It's great for grabbing info when the component is created. It's not great when we need to grab information about the route
     * * from different moments in time. Luckily, ng exposes observables for listening to changes about the route
     * * The route.params property is an observable that will push events whenever the parameters change.
     * * We need to do this because by default, ng does not destroy the component on route changes if it's the same componet (to save resources)
     * * so we can use this subscription to dynamically update pieces of the component if the route changes.
     */ 

    // this.id = this.route.snapshot.params.id;
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}

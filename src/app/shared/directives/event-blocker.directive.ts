import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]'
})
export class EventBlockerDirective {

 /**
  * * Host element is the one this class is attached to. This decorator selects the host element and listens to events.
  * * It accepts the event type to listen to as the first argument and then an array of values (in our case we want the event value itself)
  * * Multiple decorators can be applied to a single meethod!
  */

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation(); // optional additional step
  }
}

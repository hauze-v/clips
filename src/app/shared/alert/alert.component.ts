import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  /** Property for dynamically setting the bg-color of the alert depending on result of back-end processes */
  @Input() color: string = 'blue';

  /** The get keyword allows us to access the return value "as a property"
   * It allows you to create properties with extra logic before the property is set
   * In order for tailwind to pick apply this class, it needs to be added to the safelist array
   * in the tailwind.config.js file
   */
  public get bgColor() {
    return `bg-${this.color}-400`;
  }
}

import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();

  constructor() { }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )
    
    // If there are no active tabs, set a default active one
    if (!activeTabs || activeTabs.length === 0) {
      // The QuerlyList object has a property called "first" representing the first elem in the array
      this.selectTab(this.tabs.first);
    }
  }

  public selectTab(tab: TabComponent): boolean {
    // Set all tabs to inactive before making one active
    this.tabs?.forEach(tab => {
      tab.active = false;
    });

    tab.active = true;

    /** 
     * Insted of accepting $event as a parameter and removing the default behavior, 
     * we can simply return false to stop achor tags from navigating away
     */
    return false;
  }


}

import { Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { Calendar } from 'primeng/calendar';
import { Dropdown } from 'primeng/dropdown';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [RouterOutlet, MatButtonModule, MatTooltip, MatIconModule, MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogClose, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    MatDatepickerModule, CheckboxModule, AutoCompleteModule, CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private viewRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private eleRef = inject(ElementRef);

  @ViewChild('dialogBox') dialogBox: any;

  title = 'alphonso';
  count = 0;
  getCssClassName: any;
  dropDownArr: any[] = [{ value: '-Select-', viewValue: 'Select' }];
  latestCloneElement: string[] = [];

  elementList = [
    {
      id: "DatePicker",
      elementID: 'matDatePicker',
      label: "AM DatePicker",
      html: `<mat-form-field color="accent">
      <input matInput [matDatepicker]="picker1" />
      <mat-hint>MM/DD/YYYY</mat-hint>
      <mat-datepicker-toggle
        matIconSuffix
        
      ></mat-datepicker-toggle>
      <mat-datepicker></mat-datepicker>
    </mat-form-field>`

    },
    {
      id: "DropDown",
      elementID: 'matDropDown',
      label: "Drop Down",
      html: ` <mat-form-field>
      <select matNativeControl required>
        <option value="">-Select</option>
      </select>
    </mat-form-field>`
    },
    {
      id: "PrimeNgCheckbox",
      elementID: 'PrimeNgCheckbox',
      label: "Pirme ng",
      html: ` <span>
      <p-checkbox [binary]="true" inputId="binary"></p-checkbox>
      <label contenteditable="true">Label</label>
     </span>`
    }
  ]
  historyStack: any[] = [];
  currentIndex = -1;

  constructor(public dialog: MatDialog) {

  }
  allowDrop(ev: any) {
    // console.log(ev, ' ---- allowDrop')
    ev.preventDefault();
  }

  dragStart(ev: any) {
    // console.log(ev, ' ---- dragStart ----', ev.target.id)
    ev.dataTransfer.setData("text", ev.target.id);
  }

  dragEnd(ev: any) {
    // console.log(ev, ' ---- drag End ');
  }
  parentDrop(event: any) {
    console.log(event, "parentDrop")
    event.preventDefault();
    return
  }

  drop(ev: any) {
    // console.log(ev, ' ---- drop');
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text"); // retrieving id
    // console.log(data, ' -- DATA');

    const element = ev.target;
    if (ev.target.id.includes('parent')) {
      // console.log('YES');
      return
    }
    // console.log('STEP');

    let node: any = document.getElementById(data); // accessing node
    // console.dir(node);
    // if (node.id.includes('parentPrimeNg')) {
    //   node = document.getElementById(data)?.childNodes[1];

    // }
    if (data.includes('parent')) {
      // console.log(node);

      const clone: any = this.cloneNode(node, data, ev, false);
      // this.deleteNode(clone);
      // this.addCssClass(clone);
    } else {
      ev.target.appendChild(node);
    }

  }

  private cloneNode(node: any, data: any, ev: any, cloneNode: any) {
    // console.log(ev)

    if (cloneNode) {
      let clone = node.cloneNode(true);
      clone.style.display = 'block';
      clone.id = data.replace("parent", "child") + (++this.count);

      this.latestCloneElement.unshift(clone.id);

      // console.log(this.latestCloneElement);
      ev.target.appendChild(clone);
      clone.classList.add("showHideDelete");
      // console.log(clone);
      return clone;
    } else {
      // console.log(node);
      let element: any;
      let parentEle = this.renderer.createElement('div');
      switch (node.id) {
        case 'parentPrimeNgCalendar':
          element = this.viewRef.createComponent(Calendar);
          break;
        case 'parentPrimeNgDropdown':
          element = this.viewRef.createComponent(Dropdown);
          break;
        default:
          console.log('hi')
      }
      parentEle.appendChild(element.instance.el.nativeElment);
      this.renderer.appendChild(document.getElementById('rightPanel'), parentEle);
      // ev.target.appendChild(element);
      // 
      
      

      // this.renderer.appendChild(ev.target, parentEle);
      // this.renderer.appendChild(this.eleRef.nativeElement, ev.target)
    }


    // console.log(clone.id)

  }

  removeLastAddedElement() {
    console.log(this.latestCloneElement);
    if (this.latestCloneElement.length) {
      document.getElementById(this.latestCloneElement[0])?.remove();
      this.latestCloneElement.splice(0, 1)
    }
  }

  test() {
    console.log('HI')
  }

  private deleteNode(clone: any) {
    document.querySelector("#" + clone.id + " .delete")?.setAttribute('data-parent-id', clone.id);

    document.querySelector("#" + clone.id + " .delete")?.addEventListener("click", function (obj: any) {

      let parentId = "";
      // console.log(obj);
      for (let x in obj.target.attributes) {

        if (obj.target.attributes[x].nodeName === 'data-parent-id') {
          parentId = obj.target.attributes[x].nodeValue;
        }
      }
      document.getElementById(parentId)?.remove();
    });
  }


  private addCssClass(clone: any) {
    const _self = this;
    let dialogRef: any;
    document.querySelector('#' + clone.id + " .cssClass")?.addEventListener("click", function (obj: any) {
      _self.getCssClassName = "";
      dialogRef = _self.dialog.open(_self.dialogBox, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        const className = _self.getCssClassName.split(" ");
        document.querySelector('#' + clone.id + " .addCssClass")?.classList.add(...className);
      });


      // console.log(document.querySelector('#' + clone.id + " .addCssClass"))
    });

  }

  getSource() {
    const sourceHtml: any = document.getElementById('sourceHtml');
    let index: any;
    let originalElement: any = document.getElementById('rightPanel');
    let cloneElement = originalElement.cloneNode(true);
    let cloneChildNodes = cloneElement.childNodes;
    this.findChildNodes(cloneChildNodes);
    sourceHtml.innerText = this.format(cloneElement?.innerHTML);
  }



  private findChildNodes(cloneChildNodes: any) {
    // console.dir(cloneChildNodes)
    cloneChildNodes.forEach((node: any, index: number) => {
      // console.dir(node);
      this.elementList.map((elItem: any) => {
        if (node?.id?.includes(elItem.id) && node?.id?.includes('Atom') ||
          node?.id?.includes(elItem.elementID) && node?.id?.includes('MoleculeAtom')) {
          node.innerHTML = elItem.html;
        }
        if (node.childNodes?.length) {
          this.findChildNodes(node.childNodes);
        }
      });
      if (node.className && node.className.includes("utilitySection")) {
        node.remove();
      }
      removeCssClass("borderDotted");
      removeCssClass("baseMinHeight");

      if (node.id && node.id.includes("child")) {
        node.removeAttribute("id");
        node.classList.remove("showHideDelete")
        node.removeAttribute("draggable");

      }
      if (node.contenteditable) {
        node.removeAttribute("contenteditable");
      }


      function removeCssClass(cssClassName: string) {
        if (node.className && node.className.includes(cssClassName)) {
          node.classList.remove(cssClassName);
        }
      }
    })
  }

  format(html: any) {
    let tab = '\t';
    let result = '';
    let indent = '';
    // console.log(html)
    html.split(/>\s*</).forEach((element: any) => {
      // console.log(el)
      const el: any = this.removeNgContentTag(element);

      const newEl = el.join(" ");
      // console.log(newEl)
      if (newEl.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      // console.log(newEl)
      result += indent + '<' + newEl + '>\r\n';

      if (newEl.match(/^<?\w[^>]*[^\/]$/) && !newEl.startsWith("input")) {
        indent += tab;
      }
    });
    // console.log(result, ' --- result', result.substring(1, result.length - 3))
    return result.substring(1, result.length - 3);
  }

  private removeNgContentTag(element: any) {
    const el: any = element?.split(" ");
    // console.log(el)
    el.map((item: any, index: any) => {

      if (item.includes("_ngcontent-ng")) {
        if (item?.includes(">")) {

          item = item.split('=""');
          item.splice(0, 1);

          item = item.toString();
          // console.log(item , ' __')
        } else {
          el.splice(index, 1);
        }

      }
      // console.log(item, ' - - - item')
      return item;

    });
    return el;
  }

  saveState() {
    // Save the current state of the document
    let currentState: any = this.captureCurrentState();

    // Clear redo history when a new action is performed
    this.historyStack = this.historyStack.slice(0, this.currentIndex + 1);

    // Add the new state to the history stack
    this.historyStack.push(currentState);

    // Update the current index
    this.currentIndex = this.historyStack.length - 1;
  }

  undo() {
    if (this.currentIndex > 0) {
      // Move back in history
      this.currentIndex--;
      this.applyState(this.historyStack[this.currentIndex]);
    }
  }

  redo() {
    if (this.currentIndex < this.historyStack.length - 1) {
      // Move forward in history
      this.currentIndex++;
      this.applyState(this.historyStack[this.currentIndex]);
    }
  }

  applyState(state: any) {
    console.log(state);

    // Apply the given state to the document
    /* code to restore the document state based on the captured state */
  }

  captureCurrentState() {
    // Get the HTML content of the entire document
    let documentHTML = document.documentElement.outerHTML;

    // You can also capture other relevant information as needed, such as styles, form values, etc.
    // For example, capturing the styles of a specific element with the ID "exampleElement":
    let element: any = document?.getElementById('rightPanel');
    let exampleElementStyles = window.getComputedStyle(element);

    // Create an object to store the captured state
    let currentState = {
      html: documentHTML,
      exampleElementStyles: exampleElementStyles,
      // Add more properties as needed
    };

    return currentState;
  }

}




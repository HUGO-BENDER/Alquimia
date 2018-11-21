import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFramepanzoom]'
})
export class FramepanzoomDirective implements AfterViewInit {
  frameOnPan: boolean;
  elementFrame: any;
  rectFrame: Rectangle;
  elementContent: any;
  rectContent: Rectangle;
  pointIniPan: Point;
  zoomRatio: number;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.elementFrame = this.el.nativeElement;
// call onresize
// call calculateFix
// call put
    this.rectFrame = <Rectangle> {
      width: 0,
      heigth: 0,
      topLeft: <Point> {x: 0, y: 0},
      topRigth: <Point> {x: 0, y: 0},
      bottomLeft: <Point> {x: 0, y: 0},
      bottomRigth: <Point> {x: 0, y: 0}
    };
    this.elementContent = this.el.nativeElement.childNodes[0];
    this.rectContent = <Rectangle> {
      width: 0,
      heigth: 0,
      topLeft: <Point> {x: 0, y: 0},
      topRigth: <Point> {x: 0, y: 0},
      bottomLeft: <Point> {x: 0, y: 0},
      bottomRigth: <Point> {x: 0, y: 0}
    };
    //
    console.log('---------------------------------------------------');
    console.log('framePanZoom = ', this.elementFrame);
    console.log('contentPanZoom = ', this.elementContent);
    console.log('---------------------------------------------------');
    // framePanZoom
    // clientHeight: 476
    // ​​clientLeft: 1
    // ​​clientTop: 1
    // ​​clientWidth: 328

    // contentPanZoom
    // clientHeight: 900
    // ​clientLeft: 0
    // ​clientTop: 0
    // ​clientWidth: 900
    // offsetHeight: 900
    // ​offsetLeft: 1
    // ​​offsetTop: 1
    // ​offsetWidth: 900
  }



  // Region HostListener

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
    this.starPan(event);
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event: any) {
    this.stopPan(event);
  }
  @HostListener('mousemove', ['$event']) onMouseMove(event: any) {
    if (this.frameOnPan) { this.onPan(event); }
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.onLeave();
  }
  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.mouseWheelFunc(event);
  }
  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.mouseWheelFunc(event);
  }
  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.mouseWheelFunc(event);
  }
  // End Region HostListener


  private starPan(event: MouseEvent) {
    this.frameOnPan = true;
    this.pointIniPan = { x: event.offsetX, y: event.offsetY };
    console.log('starPan', this.pointIniPan);
  }
  private stopPan(event: any) {
    console.log('stopPan');
    this.frameOnPan = false;
  }
  private onPan(event: any) {
    console.log('onPan');





  }
  private onLeave() {
    if (this.frameOnPan) {
      this.frameOnPan = false;
      console.log('stopPan');
    }
    this.highlight(null);
  }
  private highlight(color: string) {
    this.elementFrame.nativeElement.style.backgroundColor = color;
  }

  private mouseWheelFunc(event: any) {
    event = window.event || event; // old IE support
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
      console.log('para arriba ', delta);
    } else if (delta < 0) {
      console.log('para ABAJO ', delta);
    }
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault();
    }
  }


}

interface Point {
  x: number;
  y: number;
}

interface Rectangle {
  topLeft: Point;
  topRigth: Point;
  bottomLeft: Point;
  bottomRigth: Point;
  heigth: number;
  width: number;
  Orientation?: string;
}


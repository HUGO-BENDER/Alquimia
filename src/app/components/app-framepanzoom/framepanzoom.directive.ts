import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2 } from '@angular/core';

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
  cssScale: number;
  resizeTimeout: any;
  // portrait
  // landscape


  constructor(private el: ElementRef, private renderer: Renderer2) {
    if (this.el.nativeElement) {
      this.elementFrame = this.el.nativeElement;
    }
  }

  ngAfterViewInit() {
if (this.el.nativeElement) {
      this.elementContent = this.el.nativeElement.childNodes[0];
      this.elementFrame = this.el.nativeElement;
      const intervalIni = setInterval((() => {
        if (this.elementContent !== undefined && this.elementContent.clientWidth > 0) {
          clearInterval(intervalIni);
          console.log('clearInterval --- ----- ');
          this.resize();
        }
        console.log('seguimos intentando --- ----- ');
      } ).bind(this), 500);



      // setTimeout(() => {
      //   this.resize();
      // }, 5000);
    }
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
  @HostListener('window:resize') onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
      this.resize();
    }).bind(this), 500);

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
  private resize() {
    console.log('Entre en resize', this.elementContent.clientWidth);
    if (this.elementContent.clientWidth === 0) { return; }
    this.rectFrame = <Rectangle>{
      width: this.elementFrame.clientWidth,
      heigth: this.elementFrame.clientHeight,
      topLeft: <Point>{ x: 0, y: 0 },
      topRigth: <Point>{ x: 0, y: 0 },
      bottomLeft: <Point>{ x: 0, y: 0 },
      bottomRigth: <Point>{ x: 0, y: 0 }
    };
    this.rectContent = <Rectangle>{
      width: this.elementContent.clientWidth,
      heigth: this.elementContent.clientHeight,
      topLeft: <Point>{ x: 0, y: 0 },
      topRigth: <Point>{ x: 0, y: 0 },
      bottomLeft: <Point>{ x: 0, y: 0 },
      bottomRigth: <Point>{ x: 0, y: 0 }
    };
    this.calculateMinFix();
    this.applyChanges();
  }
  private calculateMinFix() {

    this.rectFrame.orientation = this.rectFrame.width > this.rectFrame.heigth ? 'landscape' : 'portrait';
    this.rectContent.orientation = this.rectContent.width > this.rectContent.heigth ? 'landscape' : 'portrait';

    this.cssScale = Math.min(this.rectFrame.heigth / this.rectContent.heigth, this.rectFrame.width / this.rectContent.width);
    // if (this.rectFrame.orientation !== this.rectContent.orientation) {
    //   if (this.rectFrame.orientation = 'landscape') {
    //     this.cssScale = this.rectFrame.heigth / this.rectContent.heigth;
    //   } else {
    //     this.cssScale = this.rectFrame.width / this.rectContent.width;
    //   }
    // }



  }
  private applyChanges() {
    // const transformation = {
    //   '-moz-transform-origin': '0px 0px 0px',
    //   'transform-origin': '0px 0px 0px',
    //   '-ms-transform-origin': '0px 0px 0px',
    //   '-webkit-transform-origin': '0px 0px 0px',
    //   '-webkit-transform': 'scale(' + this.cssScale + ')',
    //   '-moz-transform': 'scale(' + this.cssScale + ')',
    //   '-ms-transform': 'scale(' + this.cssScale + ')',
    //   '-o-transform': 'scale(' + this.cssScale + ')',
    //   'transform': 'scale(' + this.cssScale + ')'
    // };
    // this.renderer.setProperty(this.elementContent, 'transform', transformation);
    // const arg = 'scale(' + this.cssScale + ')';
    this.elementContent.style.transformOrigin = '0px 0px 0px';
    this.elementContent.style.transform = 'scale(' + this.cssScale + ')';
    // this.renderer.setProperty(this.elementContent, 'transform-origin', '0px 0px 0px');
    // this.renderer.setProperty(this.elementContent, 'transform', 'scale(' + this.cssScale + ')');
    console.log('Entre en applyChanges ', ' scale(' + this.cssScale + ')');
  }


  private onLeave() {
    if (this.frameOnPan) {
      this.frameOnPan = false;
      console.log('stopPan');
    }
    this.highlight(null);
  }
  private highlight(color: string) {
    this.elementFrame.style.backgroundColor = color;
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
  orientation?: string;
}


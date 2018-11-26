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
  valuesMinFix: ScaleAndPoint;
  valuesActual: ScaleAndPoint;


  constructor(private el: ElementRef, private renderer: Renderer2) {
    if (this.el.nativeElement) {
      this.elementFrame = this.el.nativeElement;
    }
    this.valuesMinFix = {};
    this.valuesActual = {};
  }

  ngAfterViewInit() {
    if (this.el.nativeElement) {
      this.elementContent = this.el.nativeElement.childNodes[0];
      this.elementFrame = this.el.nativeElement;
      const intervalIni = setInterval((() => {
        if (this.elementContent !== undefined && this.elementContent.clientWidth > 0) {
          clearInterval(intervalIni);
          this.applyChanges(this.calculateMinFix());
        }
      }).bind(this), 500);
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
    this.valuesMinFix = this.calculateMinFix();
    if (this.valuesActual.cssScale < this.valuesMinFix.cssScale) {
      this.applyChanges(this.valuesMinFix);
      console.log('Agrandamos el viewport. redimensionamos');
    } else {
      console.log('Achicamos el viewport.');
    }

  }
  private calculateMinFix(): ScaleAndPoint {
    this.rectFrame = <Rectangle>{
      width: this.elementFrame.clientWidth,
      heigth: this.elementFrame.clientHeight,
      orientation: this.elementFrame.clientWidth > this.elementFrame.clientHeight ? 'landscape' : 'portrait'
    };
    this.rectContent = <Rectangle>{
      width: this.elementContent.clientWidth,
      heigth: this.elementContent.clientHeight,
      orientation: this.elementContent.clientWidth > this.elementContent.clientHeight ? 'landscape' : 'portrait',
      topLeft: <Point>{ x: 0, y: 0 }
    };

    // this.rectFrame.orientation = this.rectFrame.width > this.rectFrame.heigth ? 'landscape' : 'portrait';
    // this.rectContent.orientation = this.rectContent.width > this.rectContent.heigth ? 'landscape' : 'portrait';

    if (this.rectFrame.orientation !== this.rectContent.orientation) {
      if (this.rectFrame.orientation === 'landscape') {
        this.valuesMinFix.cssScale = this.rectFrame.heigth / this.rectContent.heigth;
        this.valuesMinFix.pointTopLeft = {
          x: Math.abs((this.rectFrame.width - (this.rectContent.width * this.valuesMinFix.cssScale)) / 2),
          y: 0
        };
      } else {
        this.valuesMinFix.cssScale = this.rectFrame.width / this.rectContent.width;
        this.valuesMinFix.pointTopLeft = {
          x: 0,
          y: Math.abs((this.rectFrame.heigth - (this.rectContent.heigth * this.valuesMinFix.cssScale)) / 2)
        };
      }
    } else {
      if (this.rectFrame.heigth / this.rectContent.heigth < this.rectFrame.width / this.rectContent.width) {
        this.valuesMinFix.cssScale = this.rectFrame.heigth / this.rectContent.heigth;
        this.valuesMinFix.pointTopLeft = {
          x: Math.abs((this.rectFrame.width - (this.rectContent.width * this.valuesMinFix.cssScale)) / 2),
          y: 0
        };
      } else {
        this.valuesMinFix.cssScale = this.rectFrame.width / this.rectContent.width;
        this.valuesMinFix.pointTopLeft = {
          x: 0,
          y: Math.abs((this.rectFrame.heigth - (this.rectContent.heigth * this.valuesMinFix.cssScale)) / 2)
        };
      }
    }
    return this.valuesMinFix;
  }


  private applyChanges(dataToApply: ScaleAndPoint) {
    let transformation = 'translate(' + (dataToApply.pointTopLeft.x) + 'px,' + (dataToApply.pointTopLeft.y) + 'px)';
    transformation += ' scale(' + dataToApply.cssScale + ')';
    this.elementContent.style.transformOrigin = '0px 0px 0px';
    this.elementContent.style.transform = transformation;
    this.valuesActual = {
      cssScale: dataToApply.cssScale,
      pointTopLeft: {
        x: dataToApply.pointTopLeft.x,
        y: dataToApply.pointTopLeft.y
      }
    };

    // this.renderer.setProperty(this.elementContent, 'transform', transformation);
    // this.renderer.setProperty(this.elementContent, 'transform-origin', '0px 0px 0px');
    // this.renderer.setProperty(this.elementContent, 'transform', transformation);
    console.log('Entre en applyChanges ', transformation);
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

interface ScaleAndPoint {
  cssScale?: number;
  pointTopLeft?: Point;
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


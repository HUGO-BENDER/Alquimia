import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFramepanzoom]'
})
export class FramepanzoomDirective implements AfterViewInit {
  // -- var DOM
  elementFrame: any;
  rectFrame: Rectangle;
  elementContent: any;
  rectContent: Rectangle;

  // -- var control user
  keepInMinFix: boolean;

  // -- var control
  frameOnPan: boolean;
  panPointIni: Point;
  zoomPointMouse: Point;
  zoomPointTarget: Point;
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
    this.onPan(event);
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
    this.panPointIni = { x: event.clientX, y: event.clientY };
    console.log('starPan', this.panPointIni);
  }
  private stopPan(event: any) {
    console.log('stopPan');
    this.frameOnPan = false;
  }
  private onPan(event: MouseEvent) {
    if (this.frameOnPan) {
      console.log('onPan');
      const deltaX = this.panPointIni.x - event.clientX;
      const deltaY = this.panPointIni.y - event.clientY;
      let newX = this.valuesActual.pointTopLeft.x - deltaX;
      let newY = this.valuesActual.pointTopLeft.y - deltaY;

      // -- Check no exceds de limits
      if (this.valuesActual.cssScale === this.valuesMinFix.cssScale) {
        newX = Math.max(Math.min(newX, this.valuesMinFix.pointTopLeft.x), 0);
        newY = Math.max(Math.min(newY, this.valuesMinFix.pointTopLeft.y), 0);
      } else {
        // Si contenido es mas ancho que el frame
        if ( this.rectContent.width * this.valuesActual.cssScale > this.rectFrame.width) {
          newX = Math.min(newX, 15);
          newX = Math.max(newX, this.rectFrame.width - (this.rectContent.width * this.valuesActual.cssScale) - 15);
        } else {
          newX = Math.max(newX, 0);
          newX = Math.min(newX, (this.rectFrame.width - (this.rectContent.width * this.valuesActual.cssScale)) /  2);
        }
        // si el contenido es mas alto que el frame
        if ( this.rectContent.heigth * this.valuesActual.cssScale > this.rectFrame.heigth) {
          newY = Math.min(newY, 15);
          newY = Math.max(newY, this.rectFrame.heigth - (this.rectContent.heigth * this.valuesActual.cssScale) - 15);
        } else {
          newY = Math.max(newY, 0);
          newY = Math.min(newY, (this.rectFrame.heigth - (this.rectContent.heigth * this.valuesActual.cssScale)) / 2);
        }
      }

      this.applyChanges({
        cssScale: this.valuesActual.cssScale,
        pointTopLeft: {
          x: Math.round(newX),
          y: Math.round(newY)
        }
      });
      this.panPointIni = { x: event.clientX, y: event.clientY };
    }
  }
  private resize() {
    this.valuesMinFix = this.calculateMinFix();
    if (this.valuesActual.cssScale < this.valuesMinFix.cssScale) {
      this.applyChanges(this.valuesMinFix);
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
  private onLeave() {
    this.frameOnPan = false;
    this.highlight(null);
  }
  private mouseWheelFunc(e: any) {
    e = window.event || e; // old IE support
    let newX = 0;
    let newY = 0;
    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    const factor = 0.1 * delta;
    const oldScale = this.valuesActual.cssScale;
    const newScale = Math.max(this.valuesActual.cssScale + factor, this.valuesMinFix.cssScale);
    const xInTarget = e.pageX - this.elementFrame.offsetLeft - this.valuesActual.pointTopLeft.x;
    const yInTarget = e.pageY - this.elementFrame.offsetTop - this.valuesActual.pointTopLeft.y;
    if (newScale !== this.valuesMinFix.cssScale) {
      newX = this.valuesActual.pointTopLeft.x + (xInTarget - (xInTarget / oldScale * newScale));
      newY = this.valuesActual.pointTopLeft.y + (yInTarget - (yInTarget / oldScale * newScale));
    } else {
      const diffX = this.valuesActual.pointTopLeft.x - this.valuesMinFix.pointTopLeft.x;
      if (Math.abs(diffX) < 10) {
        newX = this.valuesMinFix.pointTopLeft.x;
      } else {
        newX = this.valuesActual.pointTopLeft.x - (diffX / 10);
      }
      const diffY = this.valuesActual.pointTopLeft.y - this.valuesMinFix.pointTopLeft.y;
      if (Math.abs(this.valuesActual.pointTopLeft.y) < 10) {
        newY = this.valuesMinFix.pointTopLeft.y;
      } else {
        newY = this.valuesActual.pointTopLeft.y - (diffY / 10);
      }
    }
    this.applyChanges({
      cssScale: newScale,
      pointTopLeft: {
        x: Math.round(newX),
        y: Math.round(newY)
      }
    });
    // for IE
    e.returnValue = false;
    // for Chrome and Firefox
    if (e.preventDefault) {
      e.preventDefault();
    }
  }
  private highlight(color: string) {
    this.elementFrame.style.backgroundColor = color;
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
    // ---  the  renderer not working ¿?!!  :-(
    // this.renderer.setProperty(this.elementContent, 'transform', transformation);
    // this.renderer.setProperty(this.elementContent, 'transform-origin', '0px 0px 0px');
    // this.renderer.setProperty(this.elementContent, 'transform', transformation);
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
  heigth: number;
  width: number;
  orientation?: string;
}


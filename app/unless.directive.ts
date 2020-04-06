import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.VCRef.createEmbeddedView(this.temRef)
    }
    else {
      this.VCRef.clear();
    }
  }
  constructor(private temRef: TemplateRef<any>, private VCRef: ViewContainerRef) { }

}

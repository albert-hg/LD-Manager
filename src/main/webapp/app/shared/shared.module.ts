import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LbmanagerSharedLibsModule, LbmanagerSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [LbmanagerSharedLibsModule, LbmanagerSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [LbmanagerSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LbmanagerSharedModule {
  static forRoot() {
    return {
      ngModule: LbmanagerSharedModule
    };
  }
}

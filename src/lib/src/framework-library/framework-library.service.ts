import { Inject, Injectable } from '@angular/core';

import { WidgetLibraryService } from '../widget-library/widget-library.service';

// No framework - unmodified HTML controls, with styles from layout only
import { NoFrameworkComponent } from './no-framework.component';

// Material Design Framework
// https://github.com/angular/material2
import { FlexLayoutRootComponent } from './material-design-framework/flex-layout-root.component';
import { FlexLayoutSectionComponent } from './material-design-framework/flex-layout-section.component';
import { MaterialAddReferenceComponent } from './material-design-framework/material-add-reference.component';
import { MaterialButtonComponent } from './material-design-framework/material-button.component';
import { MaterialButtonGroupComponent } from './material-design-framework/material-button-group.component';
import { MaterialCardComponent } from './material-design-framework/material-card.component';
import { MaterialCheckboxComponent } from './material-design-framework/material-checkbox.component';
import { MaterialCheckboxesComponent } from './material-design-framework/material-checkboxes.component';
import { MaterialDatepickerComponent } from './material-design-framework/material-datepicker.component';
import { MaterialFileComponent } from './material-design-framework/material-file.component';
import { MaterialInputComponent } from './material-design-framework/material-input.component';
import { MaterialNumberComponent } from './material-design-framework/material-number.component';
import { MaterialRadiosComponent } from './material-design-framework/material-radios.component';
import { MaterialSelectComponent } from './material-design-framework/material-select.component';
import { MaterialSliderComponent } from './material-design-framework/material-slider.component';
import { MaterialTabsComponent } from './material-design-framework/material-tabs.component';
import { MaterialTextareaComponent } from './material-design-framework/material-textarea.component';
import { MaterialDesignFrameworkComponent } from './material-design-framework/material-design-framework.component';

// Bootstrap 3 Framework
// https://github.com/valor-software/ng2-bootstrap
import { Bootstrap3FrameworkComponent } from './bootstrap-3-framework.component';

// Suggested future frameworks:
// - Bootstrap 4:
//   https://github.com/ng-bootstrap/ng-bootstrap
//   http://v4-alpha.getbootstrap.com/components/forms/
// - Foundation 6:
//   https://github.com/zurb/foundation-sites
// - Semantic UI:
//   https://github.com/vladotesanovic/ngSemantic

import { hasOwn } from '../shared/utility.functions';

export interface Framework {
  framework: any,
  widgets?: { [key: string]: any },
  stylesheets?: string[],
  scripts?: string[]
};

export interface FrameworkLibrary {
  [key: string]: Framework
};

@Injectable()
export class FrameworkLibraryService {
  activeFramework: Framework = null;
  stylesheets: (HTMLStyleElement|HTMLLinkElement)[];
  scripts: HTMLScriptElement[];
  loadExternalAssets: boolean = false;
  defaultFramework: string = 'material-design';
  frameworkLibrary: FrameworkLibrary = {
    'no-framework': {
      framework: NoFrameworkComponent
    },
    'material-design': {
      framework: MaterialDesignFrameworkComponent,
      widgets: {
        'root':         FlexLayoutRootComponent,
        'section':      FlexLayoutSectionComponent,
        '$ref':         MaterialAddReferenceComponent,
        'number':       MaterialNumberComponent,
        'slider':       MaterialSliderComponent,
        'text':         MaterialInputComponent,
        'date':         MaterialDatepickerComponent,
        'file':         MaterialFileComponent,
        'checkbox':     MaterialCheckboxComponent,
        'button':       MaterialButtonComponent,
        'buttonGroup':  MaterialButtonGroupComponent,
        'select':       MaterialSelectComponent,
        'textarea':     MaterialTextareaComponent,
        'checkboxes':   MaterialCheckboxesComponent,
        'radios':       MaterialRadiosComponent,
        'card':         MaterialCardComponent,
        'tabs':         MaterialTabsComponent,
        'alt-date':     'date',
        'range':        'slider',
        'submit':       'button',
        'radiobuttons': 'buttonGroup',
        'color':        'none',
        'hidden':       'none',
        'image':        'none',
      },
      stylesheets: [
        '//fonts.googleapis.com/icon?family=Material+Icons',
        '//fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      ],
    },
    'bootstrap-3': {
      framework: Bootstrap3FrameworkComponent,
      stylesheets: [
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
      ],
      scripts: [
        '//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
        '//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
      ],
    }
  };

  constructor(
    @Inject(WidgetLibraryService) private widgetLibrary: WidgetLibraryService
  ) { }

  public setLoadExternalAssets(loadExternalAssets: boolean = true): void {
    this.loadExternalAssets = !!loadExternalAssets;
  }

  public setFramework(
    framework?: string|Framework, loadExternalAssets: boolean = this.loadExternalAssets
  ): boolean {
    if (!framework) { return false; }
    let registerNewWidgets: boolean = false;
    if (!framework || framework === 'default') {
      this.activeFramework = this.frameworkLibrary[this.defaultFramework];
      registerNewWidgets = true;
    } else if (typeof framework === 'string' && this.hasFramework(framework)) {
      this.activeFramework = this.frameworkLibrary[framework];
      registerNewWidgets = true;
    } else if (typeof framework === 'object' && hasOwn(framework, 'framework')) {
      this.activeFramework = framework;
      registerNewWidgets = true;
    }
    return registerNewWidgets ?
      this.registerFrameworkWidgets(this.activeFramework) :
      registerNewWidgets;
  }

  registerFrameworkWidgets(framework: Framework): boolean {
    return hasOwn(framework, 'widgets') ?
      this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
      this.widgetLibrary.unRegisterFrameworkWidgets();
  }

  public hasFramework(type: string): boolean {
    return hasOwn(this.frameworkLibrary, type);
  }

  public getFramework(): any {
    if (!this.activeFramework) { this.setFramework('default', true); }
    return this.activeFramework.framework;
  }

  public getFrameworkWidgets(): any {
    return this.activeFramework.widgets || {};
  }

  public getFrameworkStylesheets(load: boolean = this.loadExternalAssets): string[] {
    return (load && this.activeFramework.stylesheets) || [];
  }

  public getFrameworkScripts(load: boolean = this.loadExternalAssets): string[] {
    return (load && this.activeFramework.scripts) || [];
  }
}
